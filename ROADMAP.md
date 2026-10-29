# Social Platform Rebuild: Learning Roadmap

> Single source of truth. Last updated: 2026-10-24
> Legend: `[x]` done · `[ ]` open · `[~]` done with something left to confirm · **(proposed)** = a suggestion, accept it or delete it

**Goal:** Rebuild the AI-generated backend yourself, service by service, using the complete AI-built version as a reference, not a template. The hand-built version lives in `api-gateway/`, `services/` and `frontend/`. By the end you understand every layer of the stack, you're comfortable with Git, and you have a deployed, tested, well-documented portfolio project that reads well to international employers.

**Rule for every stage:** Read reference → Rebuild from scratch → Test in isolation → Wire in → Commit → Check the box.

**Rule for closing a stage:** every box checked or explicitly deferred with a reason, tests green, PR merged, `LEARNED.md` entry written **by you**.

---

## Where you are right now

| Stage | Status |
|---|---|
| 0: Environment, Git, DBs | Done (Neo4j Aura connection still to be confirmed at the start of Stage 3) |
| 1: User Service + Gateway | Done and merged |
| 2: Content Service | Feature-complete and tested. Left: run all suites green, PR, `LEARNED.md` |
| 3–7 | Not started |
| 8: Voice/video calling | Idea logged, not scheduled |

### Bug backlog

**Tier 1: cleared**
- [x] `console.err` typo in logout (was already correct, confirmed)
- [x] One response shape across register, login and logout
- [x] `getAllPosts` query validation: `parsePositiveInt`, `limit` clamped to 50, full `it.each` test coverage
- [x] Mongoose `ValidationError` returns 400 with a clean message
- [x] `register` returns 409 for a duplicate email or username, naming the field, with tests
- [x] Gateway request logs redact `authorization`, `x-internal-secret` and cookies
- [x] `uuid` replaced with `crypto.randomUUID()` (the ESM-only `uuid` package crashed Jest)
- [~] `internalAuth` fails closed when `INTERNAL_SECRET` is unset, with unit tests. Confirm it is applied in **both** `user-service` and `content-service`, and that the "fails closed" test failed against the old code before you swapped it in

**Tier 2: deferred to the Stage 3 window (see Security Hardening Pass)**
- [ ] `verifyToken`: check `startsWith('Bearer ')` with the space, pass `{ algorithms: ['HS256'] }` to `jwt.verify`, separate "bad token" from "Redis down" in messages and logs (it currently fails closed with 401, which is a deliberate choice and now has a test)
- [ ] Per-route rate limits: tight on `/api/user/auth/login` and `/register`, looser on reads
- [ ] User Service moves to the `catchAsync` / `AppError` / `errorController` pattern Content Service already uses
- [ ] Register leaks whether an email exists. Fix properly with email verification, plus the rate limit above

**Frontend loose ends (not blocking Stage 2)**
- [ ] "Load more posts" button is not wired. Wire it (cursor-based pagination is the more robust option) or hide it
- [ ] Author names and avatars are placeholders. Needs a profile lookup from User Service
- [ ] `Profile.jsx` and `Settings.jsx` are still mock UI. Wiring them needs a `PATCH /me` endpoint and the Graph Service
- [ ] E2E test for the error state: abort the feed request and expect the friendly message while the rest of the page stays visible

---

## Testing: how it fits in

`jest` + `supertest` for every Node service. Write the integration test **first** for each new endpoint. Use a separate `_test` database for each store. Stub Redis with `jest.mock` in tests that don't need it.

| Service | Unit test | Integration test |
|---|---|---|
| Gateway | `verifyToken` (valid, missing, garbage, forged, revoked, Redis down, spoofed headers) | covered by E2E |
| User Service | password hashing, JWT signing helpers, `internalAuth` | register / login / logout against test Postgres |
| Content Service | validation helpers, `internalAuth` | post CRUD, pagination, ownership against test MongoDB |
| Graph Service | none (Cypher is mostly integration) | follow / unfollow against test Neo4j |
| Feed Service | fan-out logic (given follower IDs, right Redis commands?) | publish → fan-out → getFeed against test Redis |

Frontend:
- [x] Component tests (Vitest + React Testing Library): `PostComposer` calls `onPost` with the typed text; `PostCard` renders the real post shape
- [x] E2E happy path (Playwright): signup → create post → see it
- [x] E2E stale-feed race: hold the feed response until after the post is saved, then check the post survives. Verified by breaking `Home.jsx` on purpose (failed 3 of 3 runs), then restoring the fix
- [ ] `ProtectedRoute` test: redirects when unauthenticated
- [ ] Extend E2E in Stage 3 and 4: follow a user, see their post in the feed

---

## Stage 0: Environment, Repo, and Git Foundations

- [x] Fresh repo, `.gitignore` (`node_modules/`, `.env`, `.env.test`, `dist/`, `build/`), baseline commit
- [x] Three-zone model, branching as pointers, practiced a merge conflict in a throwaway repo
- [x] Private GitHub repo, `push -u`, PR-per-stage workflow, `git diff` / `stash` / `revert`
- [x] Cloud free-tier databases instead of local Docker: Neon (Postgres), MongoDB Atlas, Upstash (Redis), Neo4j Aura
- [ ] Confirm Neo4j Aura connects from a local script (do this at the start of Stage 3)
- [x] `.env.example` committed with placeholders
- [x] Root `.gitignore` restored after it was accidentally deleted; verified no secrets ever reached git history

**Milestone:** clean git history, cloud databases reachable. ✅

> **Revisit later:** once your own auth works end to end, spend half a day in a throwaway branch swapping it for Supabase Auth to feel what a BaaS abstracts away.

---

## Stage 1: User Service + API Gateway

- [x] Branch `stage-1-user-service`
- [x] User Service on Postgres: Sequelize model, register, login, password hashing, JWT issuing, TDD with Jest/Supertest, real migrations (sequelize-cli), user-enumeration-safe login errors
- [x] Gateway: JWT verification, `x-user-id` injection, header stripping, `x-internal-secret` trust boundary, unit tests for `verifyToken`
- [x] Request IDs, `pino-http` logging with secret redaction, explicit CORS origin, global rate limit
- [x] Frontend: `AuthLogin`, `AuthSignup`, `AuthContext`, `ProtectedRoute`, `api/client.js` interceptors
- [x] Real logout: Redis JWT blacklist keyed by `jti`, TTL from `exp`, checked by the Gateway, logout wired in the UI
- [x] `GET /api/user/me` and `AuthContext` restores the full profile after a refresh
- [x] Merged to `main` via PR

**Milestone:** sign up, log in, logged-in state in the real UI, backed by your own Postgres and Gateway. ✅

---

## Stage 2: Content Service

- [x] Branch `stage-2-content-service`
- [x] Read reference `services/content-service/`
- [x] `POST /api/content/posts`: text only, `maxLength: 200`
- [x] `GET /api/content/posts?page=&limit=&authorId=`: paginated, newest first, optional author filter, validated query parameters
- [x] `PATCH /:id` and `DELETE /:id`: server-side ownership check (403 for someone else's post, 404 if missing, 204 on delete)
- [x] `catchAsync` / `AppError` / `errorController`
- [x] Pino logging with the request ID forwarded from the Gateway, secrets redacted
- [x] `openapi.yaml`
- [x] Integration tests for every endpoint, including the 403, 404 and over-length 400 cases
- [x] `api/posts.js`, `PostComposer`, `PostCard`, `Home` wired and confirmed in the browser
- [x] Feed fix: list no longer hidden while loading, and fetched posts are merged into state (deduped by `_id`, sorted by `createdAt`) instead of replacing it
- [x] Component tests and two Playwright E2E tests (see Testing above)
- [x] Decision: TypeScript starts in Stage 3 (see `LEARNED.md`)
- [ ] Run every suite green once: Gateway, User Service, Content Service, Vitest, Playwright
- [ ] Merge to `main` via PR with a real description (what, why, how tested, known limitations)
- [ ] `LEARNED.md` entry for this stage
- [ ] **Deferred (optional second pass):** Cloudinary media upload. Not required to close the stage

**Milestone:** create, edit, delete a post; see it in MongoDB; see it in the UI; tests prove the ownership rules. ✅ (pending the PR)

---

## Stage 3: Graph Service

- [ ] Branch `stage-3-graph-service`
- [ ] **TypeScript starts here**, on this new service
- [ ] Confirm Aura connectivity; a day of throwaway Cypher in Neo4j Browser (`MATCH`, `CREATE`, `MERGE`, `RETURN`) before any code
- [ ] Follow / unfollow, idempotent (following twice must not create two relationships: use `MERGE`)
- [ ] `getFollowers`, `getFollowing` (paginated, same pattern as Content)
- [ ] Prevent self-follow; integration tests against test Neo4j
- [ ] Add `/api/graph` to the Gateway; internal-secret middleware (fail closed); request-ID logging; `openapi.yaml`
- [ ] Wire `api/graph.js` and the follow buttons in the frontend
- [ ] Tier 2 security items run alongside this stage
- [ ] `LEARNED.md` entry, PR, merge

**Milestone:** follow a test user, confirm the relationship in Neo4j Browser and in the UI.

---

## Stage 4: Feed Service

- [ ] Branch `stage-4-feed-service`
- [ ] Depends on Stages 2 and 3
- [ ] First pass: synchronous fan-out to followers' Redis lists
- [ ] Second pass: refactor to BullMQ after you have felt the problem (post creation blocking on fan-out)
- [ ] **Resilience:** deliberately kill Content Service and watch the feed request. Then add timeouts, retries with backoff, and a circuit breaker or graceful failure with logging
- [ ] **(proposed)** Live updates: new posts from other people appear without a reload (WebSockets or Server-Sent Events)
- [ ] Integration tests for publish → fan-out → getFeed; unit test for the fan-out function
- [ ] Extend the E2E test: follow a user, see their post in the feed
- [ ] `LEARNED.md` entry, PR, merge

**Milestone:** a post shows up in a follower's feed automatically.

### ⭐ Employable core checkpoint
Stages 1–4 working and tested, the security items below done, a deployed demo link, and a README explaining why there are four databases. **This is the line to start applying at.** Everything after it is improvement, not a prerequisite.

---

## Security Hardening Pass (runs alongside Stages 3–6)

- [x] Explicit CORS origin on the Gateway
- [x] Secrets redacted from request logs
- [x] Internal-secret check fails closed (confirm in both services)
- [ ] `verifyToken` hardening (see Tier 2)
- [ ] Per-route rate limiting
- [ ] Helmet.js for secure headers
- [ ] OWASP hands-on: one deliberately vulnerable throwaway endpoint each for SQL injection, XSS, CSRF and CORS misconfiguration. Exploit it, fix it, prove the fix holds
- [ ] Password reset and email verification flows
- [ ] Indexing pass with `EXPLAIN ANALYZE` (Postgres), `explain()` (Mongo), query plans (Neo4j)

---

## Stage 5: CI/CD & DevOps

- [ ] GitHub Actions: one service, `npm ci && npm test` on every push
- [ ] Dockerize in CI; push to GitHub Container Registry
- [ ] Repeat for the other services
- [ ] Staging environment (docker-compose, manual or tag-triggered deploy)
- [ ] Environment-specific config, secrets in GitHub Actions secrets, never committed
- [ ] Optional: health-check monitoring across services (each service already has `/health`)

**Milestone:** a push to `main` tests and builds at least one service, and you can explain the pipeline stage by stage.

---

## Stage 6: Polish for Portfolio

- [ ] Real `README.md`: architecture diagram, setup, why each database fits its domain
- [ ] Live demo (Render, Railway or Fly.io for the backend; Vercel or Netlify for the frontend)
- [ ] 2–3 minute demo video narrating the architecture
- [ ] `git log --oneline` reads like a story
- [ ] **(proposed)** Accessibility and performance checklist: keyboard navigation, color contrast, Lighthouse scores

---

## Stage 7: AI/LLM Engineering Layer

AI-powered product engineering, built on top of your own backend. Frameworks change every few months; these building blocks do not: calling a model with tools, retrieval and embeddings, state and memory, queues and retries, and evaluation.

- [ ] Branch `stage-7-ai-features`
- [ ] Embeddings conceptually first (you can explain cosine similarity in plain language before writing code)
- [ ] `pgvector` on Neon (or Atlas Vector Search); embed posts on creation
- [ ] Similarity-search endpoint (semantic post/user discovery); this can power the search bar that already exists in the layout
- [ ] Minimal RAG flow on `AIAssistant.jsx`: question → vector retrieval → LLM prompt → answer
- [ ] **Tool-calling agent:** a small agent that uses your own Content and Graph services as its tools (MCP or plain function-calling). This reuses your queue and retry work from Stage 4
- [ ] **Basic evaluation harness:** a fixed set of test questions with expected results, so you can tell whether a change made retrieval better or worse
- [ ] Integration tests for the new endpoints; `LEARNED.md` and README updated

**Milestone:** natural-language query returns semantically relevant results, and you can explain, without notes, what an embedding is, why vector search works, and how RAG differs from fine-tuning.

---

## Stage 8 (idea, not scheduled): Voice and video calling

Real-time audio/video between two users, WhatsApp-style. Needs a signaling server (WebSockets), WebRTC in the browser, STUN servers and possibly TURN, camera/mic permissions and call-state UI. Prerequisites: text DMs working, and WebSocket experience from Stage 4. Flesh out its checklist when you get there.

---

## Unscheduled backlog (written down so nothing is forgotten)

- [ ] Comments (the reference project has them)
- [ ] Text direct messages (`Messages.jsx` exists with no backend)
- [ ] Notifications
- [ ] Search (pairs with Stage 7 semantic search)
- [ ] API versioning (`/api/v1/...`): cheap now, expensive later
- [ ] Author enrichment: batch lookup of display names and avatars from User Service
- [ ] Soft delete vs hard delete for posts (know the trade-off even if you keep hard delete)
- [ ] Be able to explain cross-service consistency: deleting a user does not delete their posts in another database

---

## Proposed adjustments (accept or delete)

These came from a review of the roadmap against current market conditions. None change the stage order.

- [ ] **(proposed)** Deploy a bare-bones version right after Stage 2 closes (Gateway, User, Content, frontend on free tiers), then redeploy as each stage lands, instead of one deploy at the end
- [ ] **(proposed)** Pull a thin CI check forward: a GitHub Action that runs `npm test` on every push
- [ ] **(proposed)** Live feed updates inside Stage 4
- [ ] **(proposed)** Semantic search over post text as an early AI touchpoint, wired into the existing search bar
- [ ] **(proposed)** Accessibility and performance checks in Stage 6

Deliberately not chasing: native mobile apps, a design-system extraction, GraphQL, Kubernetes.

---

## Career checkpoint (proposed)

At about six months, reassess using evidence:
- Services deployed with a live link
- About 40 targeted applications sent, including engineering-software roles
- At least 5 interviews
- One paid outside project

Decide the next move from those results, not from how it feels.

---

## Parallel Track: Data Structures & Algorithms

Starts around Stage 3. 2–3 problems a week, pattern-based (arrays/hashmaps, two pointers, sliding window, trees, graphs). Goal: able to talk through an unfamiliar problem out loud.

- [ ] Started (record the date here)

---

## Phase 2 (Separate): Data Science, Deep Learning, RL, Computer Vision

Deliberately **not** folded into Stages 1–7. Existing experience with classical ML and basic TensorFlow carries over. The trigger to start is: Stage 7 done and the employable core deployed. Natural project hooks already in this app: feed ranking, recommendations and semantic search.

Prerequisites when you start: linear algebra, probability and statistics, an ML fundamentals course, the Python data stack (pandas, numpy, scikit-learn), then deep learning, then RL and computer vision as separate tracks.

---

## Working habit: `LEARNED.md`

One entry per stage, in your own words: what confused you, how you resolved it, one thing you'd do differently. This is your interview prep and proof of learning.

---

## The Broader Full-Stack Journey

| Area | When | Why it matters |
|---|---|---|
| Data modeling & SQL | Stage 1 onward | Nearly every backend role tests SQL |
| REST API design | Stage 1–2 | Status codes, idempotency, versioning |
| Testing | Every stage | Often the first signal remote teams check |
| Docker fundamentals | Stage 5 (or earlier) | Near-universal in job postings |
| System design vocabulary | After Stage 4 | Fan-out, caching, polyglot persistence, CAP |
| One cloud (AWS, GCP or Azure) | After Stage 5 | Core compute, storage, managed DB |
| TypeScript | Starts in Stage 3 | Preferred by many remote-first companies |
| English technical writing | Ongoing | README, LEARNED.md, PR descriptions |

---

## Estimated timeline (from 2026-10-24)

Rough estimates that depend on hours per day. Your measured pace is roughly 2 to 2.5 times slower than the original day counts, because you added migrations, logout blacklisting, logging, OpenAPI and tests the plan did not require.

| Milestone | At current pace | If hours double |
|---|---|---|
| Close Stage 2 | days | days |
| Stage 3 | 3–4 weeks | ~2 weeks |
| Stage 4 | 4–5 weeks | 2–3 weeks |
| **Employable core** (Stages 1–4, security, deployed, README) | **~3–4 months** | **~2–2.5 months** |
| Stages 5–6 | +6–8 weeks | +3–4 weeks |
| Stage 7 | +4–6 weeks | +2–3 weeks |

Slower is fine. The checklist doesn't expire. What matters is not skipping "test in isolation before wiring in."
