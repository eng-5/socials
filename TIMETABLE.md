# TIMETABLE: Nov 23, 2026 to Mar 13, 2027

`ROADMAP.md` says **what** to build. This file says **when**. Open it every morning, find today's date, and do that day's block. It replaces the earlier timetable.

## 1. North star

By **Sat Feb 6, 2027** you have an **employable core**: a live, tested, documented social platform with five services (Gateway, User, Content, Graph, Feed + worker), four data stores, green CI, a README with an architecture diagram, a 2 to 3 minute demo video, and a `LEARNED.md` that proves you understand it.

After that, Feb 8 to Mar 13 is the AI layer: semantic search, RAG, a tool-calling agent, an MCP server and an n8n workflow. That is where full stack, ML and automation meet.

"Internationally recognisable" here means three things a reviewer can check in five minutes: it is live, it has tests and CI, and the README explains the trade-offs honestly. "In depth" means you can teach each stage back without notes.

## 2. How to use it: today, this week, this month

Every day entry has a **Feeds** line. Read it first, so the work always connects upward:

- **Today** is one outcome with a "Done when" test.
- **This week** is a milestone (section 6).
- **This month** is a stage closed, a PR merged, a number measured.

Daily loop:
1. **Start (15 min):** read yesterday's "first task for today" note, `git pull`, run the tests for the service you will touch.
2. **Work the blocks** for your day type (section 3).
3. **Close (30 min):** commit, push, add bullets to the `LEARNED.md` draft (bug found, how fixed), write tomorrow's first task.

Rules that never change: read the first error, change one thing, run again. Run `git status` before every `git add`. Write the test first and watch it fail for the right reason.

## 3. Capacity model (what is real, not what is hoped for)

Your time is 4 to 5 hours on a normal day, up to 6 on a good day, and 7 to 9 on a free day when the enthusiasm is there. **Plan on the normal day. Spend spikes on stretch tasks.** Never build the plan on enthusiasm.

| Day type | Hours | A: hard build | B: wiring and tests | C: phone | Close |
|---|---|---|---|---|---|
| **Std** (Mon to Fri) | 4.5 | 2h [L] | 1.5h [L] | 1h [M] | 30 min (inside the totals) |
| **Spike** | 6 | 2.5h [L] | 2h [L] | 1h [M] | 30 min |
| **Deep** (free day) | 8 to 9 | 3h [L] | 3h [L] | 1h [M] | 1 to 2h of stretch |

`[L]` = laptop work (building, testing, debugging). `[M]` = phone-friendly work (DSA, reading docs, writing `LEARNED.md`, reading your own tests).

**Planning baseline: about 29 focus hours a week.** That is Mon to Fri at Std plus a Saturday at Spike or Deep, with Sunday off. At 36 hours a week, the original timetable would have taken about 22 percent fewer weeks.

Hours beyond the baseline are **banked**. A Deep day pulls tomorrow's stretch task forward, or buys back a slipped day. It is never an obligation. Two Deep days a week at most, and at least one full rest day.

## 4. Rules for slipping

- **1 day behind:** absorb it on Saturday.
- **More than 2 days behind at a Saturday review:** cut in this order: optional items (Cloudinary, comments, messages), extra E2E beyond the follow and feed paths, two of the four OWASP exercises.
- **A week behind:** re-plan the remaining weeks from this file. Don't compress sleep.
- **Never cut:** tests for new endpoints, anything that fails open, the PR description, the `LEARNED.md` entry, the weekly teach-back.
- **Short on time on a given day:** do only the "Short on time" line. A tiny finished step beats a big half-finished one.
- **Phone only today:** pick from the Phone menu in section 7. That still counts.

## 5. Month map

| Month | Done when |
|---|---|
| **Nov (to Nov 30)** | Live login stable after idle, CI green, `docs/cypher.md` written, TypeScript modules ported, Graph Service scaffolded |
| **Dec (to Dec 31)** | **Stage 3 closed by Sat Dec 19** (follow in the UI, real usernames, E2E, PR merged). Feed design written, Feed Service scaffolded |
| **Jan (to Jan 31)** | Feed fan-out working, then moved onto BullMQ with measured numbers. Resilience, polling updates, Stage 4 closed ~Jan 23. Security pass started |
| **Feb 1 to 6** | Deploy everything, CI for every service, README, diagrams, demo video: **employable core, Sat Feb 6** |
| **Feb 8 to Mar 13** | Stage 7: embeddings, semantic search, RAG, agent, MCP server, n8n workflow, evaluation harness |

Feb 6 is the target. With the 20 to 40 percent slippage that real projects have, Feb 13 to 20 is realistic. Every Saturday you will see which way it is going.

## 6. Weekly milestones

| Week | Dates | Theme | Done when |
|---|---|---|---|
| 1 | Nov 23 to 28 | Stabilise live and foundations | Live login stable after idle, CI red then green, Cypher doc, TS modules ported |
| 2 | Nov 30 to Dec 5 | Graph Service core (TS) | Follow, unfollow, status, lists, batch status, tested |
| 3 | Dec 7 to 12 | Gateway, security, follow in the UI | Reachable through the Gateway, follow button works, one status call per page |
| 4 | Dec 14 to 19 | Close Stage 3 | Usernames in feed, follow E2E green, Graph Service deployed, PR merged |
| 5 | Dec 21 to 26 | Feed design (holiday week, light) | `docs/feed-design.md`, Feed Service scaffolded |
| 6 | Dec 28 to Jan 2 | Synchronous fan-out | A posts, B's feed has it by curl |
| 7 | Jan 4 to 9 | Read the feed, then BullMQ basics | Cursor feed, feed tabs, latency measured with 2,000 followers |
| 8 | Jan 11 to 16 | BullMQ and resilience | Latency flat, retries and dead-letter proven, circuit breaker working |
| 9 | Jan 18 to 23 | Close Stage 4 | Feed survives a dead service, new posts appear via polling, E2E green, PR merged |
| 10 | Jan 25 to 30 | Security | Secrets rotated, audits clean, 2 OWASP write-ups, indexing pass |
| 11 | Feb 1 to 6 | Deploy, README, demo | **Employable core** |
| 12 | Feb 8 to 13 | Stage 7a | Posts embedded on creation, similarity endpoint |
| 13 | Feb 15 to 20 | Stage 7b | Semantic search in the UI, RAG answer with sources |
| 14 | Feb 22 to 27 | Stage 7c | Tool-calling agent, MCP server, evaluation harness with scores |
| 15 | Mar 1 to 6 | Automation | n8n workflow triggered by new posts, deployed |
| 16 | Mar 8 to 13 | Buffer and checkpoint | Everything merged, README final, career checkpoint |

## 7. Lanes that run beside the build

**Career lane.** One hour every Saturday starting Nov 28: tailor one application or message a real person. From Sat Feb 6 it becomes about 3 hours a week. You already have a live, tested, multi-service app, so don't wait for the employable core to start.

**DSA lane.** Tue, Thu and Sat, one hour, on your phone. Two array or hash-map problems at first, then trees and graphs when Graph Service starts. Write one line per problem in a running log: the pattern and why it works.

**Learning lane (phone).** Reading that sets up the next build week:

| Week | Phone reading |
|---|---|
| 1 | Cypher `MATCH`/`MERGE`, TS types vs interfaces, `unknown` vs `any` |
| 2 to 4 | Neo4j constraints and indexes, TS generics, typing Express handlers, optimistic UI |
| 5 to 6 | Redis sorted sets vs lists, system design for a news feed |
| 7 to 9 | BullMQ docs, idempotency, circuit breaker pattern |
| 10 to 11 | OWASP Top 10, `npm audit`, how to write a good README |
| 12 to 14 | Embeddings and cosine similarity, RAG, tool calling, Claude API docs, MCP |
| 15 | n8n basics, webhooks |

**Phone menu (use when you can't open the laptop):** a DSA problem, a doc from the table above, writing or tidying a `LEARNED.md` entry, reading your own tests and predicting what each one proves, planning tomorrow's first task.

---

## 8. Daily plans: Weeks 1 to 4

Each day lists: the work, **Done when**, **Feeds** (how it connects up), **Stretch** (for a Spike or Deep day), and **Short on time** (about 3 hours).

### Week 1: Nov 23 to 28. Stabilise the live app and lay foundations

**Mon Nov 23 · Std · Auth resilience, part 1**
- [ ] [L] A (2h): split your two unstaged changes into two commits. Put the `errorController` change on its own branch `fix/content-error-controller`. Back on `feature/auth-fix`, commit the `console.log` removal. Then write `AuthContext.test.jsx` (the 503 test and the 401 test). Run it and read why the 503 test fails.
- [ ] [L] B (1.5h): fix `AuthContext`: clear the token only on a 401, set an `authError` state otherwise, and have `ProtectedRoute` show a "can't reach the server, retry" message. Tests green.
- [ ] [M] C (1h): read the axios docs on interceptors and timeouts. Add the first `LEARNED.md` bullet (why "server said no" and "server didn't answer" differ).

Done when: both `AuthContext` tests pass, the 503 test was red first, and you have clean commits.
Feeds: week goal "live app stable"; month goal: Stage 3 shouldn't sit on a flaky login.
Stretch: add `timeout: 30000` to `client.js`.
Short on time: the commit split and the red test only.

**Tue Nov 24 · Std · Gateway hardening**
- [ ] [L] A (2h): `verifyToken`: separate a bad token (401) from Redis being down (503), and log the reason for each. Tests first, mocking Redis to reject. Also move the `x-user-id` header assignments to after the blacklist check. (`startsWith('Bearer ')` and HS256 are already in the code, so tick those roadmap boxes.)
- [ ] [L] B (1.5h): add `app.set('trust proxy', 1)` with a test that the limiter keys on the forwarded IP.
- [ ] [M] C (1h): read the `express-rate-limit` guide on proxies. DSA hour.

Done when: Redis-down gives 503, a bad token gives 401, and both are logged differently.
Feeds: Wednesday's live check; month goal: the Week 7 security item is pulled forward.
Stretch: per-route limits on login and register, with a 429 test.
Short on time: the `verifyToken` split only.

**Wed Nov 25 · Std · Verify live and fix configuration**
- [ ] [L] A (2h): run the three curl hops against the live Gateway (login, `/me`, `/content/posts`). Check this table on the hosts:

| Variable | Must be |
|---|---|
| `JWT_SECRET` | identical on Gateway and User Service |
| `INTERNAL_SECRET` | identical on all three services |
| `REDIS_URL` | an `rediss://` URL (Upstash) on Gateway and User Service |
| `FRONTEND_URL` | exactly the Vercel origin, no trailing slash |
| `CONTENT_SERVICE_URL`, `USER_SERVICE_URL` | the public service URLs |
| `VITE_API_URL` | the public Gateway URL |

- [ ] [L] B (1.5h): write complete `.env.example` files for all three services (names only, no values). Merge both PRs and redeploy. Test live: login, refresh, post, and login again after the apps have been idle 30 minutes.
- [ ] [M] C (1h): write up what you found in `LEARNED.md`, including which hop failed if any did.

Done when: login, refresh and post work live, including after idle.
Feeds: the week goal; the month goal (a deployed base you trust).
Short on time: the curl hops and the env table only.

**Thu Nov 26 · Std · Thin CI**
- [ ] [M] DSA hour first.
- [ ] [L] A (2h): a GitHub Actions workflow that runs the Gateway, User Service and Content Service Jest suites and the frontend Vitest suite, with test database URLs in GitHub secrets.
- [ ] [L] B (1.5h): break one test on a branch, see CI go red, fix it, see it go green.

Done when: you have seen red then green on a pushed commit.
Feeds: every later PR gets a safety net; month goal.
Short on time: workflow for one service, then expand tomorrow.

**Fri Nov 27 · Std · Neo4j and the Cypher doc**
- [ ] [L] A (2h): confirm Aura is running (free instances can pause). Write a throwaway `neo4j-driver` script that fails fast on a bad connection.
- [ ] [L] B (1.5h): `docs/cypher.md`: eight queries (follow, unfollow, is-following, followers, following, counts, mutual follows, friends-of-friends), each run in Neo4j Browser with real output. Show `CREATE` making duplicates and `MERGE` not.
- [ ] [M] C (1h): read about unique constraints on `User.id`.

Done when: eight queries are saved and verified.
Feeds: the Graph Service queries are written before the code. Week 2 starts with no surprises.
Stretch: write the unique constraint and prove it rejects a duplicate.
Short on time: queries 1 to 4.

**Sat Nov 28 · Spike or Deep · TypeScript foundations and the first review**
- [ ] [M] DSA hour first.
- [ ] [L] A (2.5h+): a throwaway TS project with `strict: true`. Learn types vs interfaces, unions, generics basics, typing Express handlers, `unknown` vs `any`. Port `parsePositiveInt` and `AppError` to TypeScript with tests.
- [ ] [L] Weekly review (45 min): run every suite, tick `ROADMAP.md`, update `LEARNED.md`, compare plan with actual, adjust Week 2.
- [ ] [M] Career lane (1h): one tailored application or message.

Done when: both modules compile in strict mode and their tests pass.
Feeds: Graph Service is your first TypeScript service. This week is what makes it learnable.
Stretch (Deep): create the `services/graph-service` folder with `tsconfig.json` and a `/health` route.
Teach-back: why is `unknown` safer than `any`?

### Week 2: Nov 30 to Dec 5. Graph Service core (TypeScript)

**Mon Nov 30 · Std · Scaffold**
- [ ] [L] A (2h): branch `stage-3-graph-service`. Scaffold `services/graph-service` in TypeScript with the `app` / `server` split, a Neo4j driver config that fails fast, `/health`, and Pino logging with request IDs and redaction.
- [ ] [L] B (1.5h): internal-secret middleware that fails closed. Run its test against the old code first and watch "fails closed" fail. Test isolation: every test node id starts with `test-`, and one test proves cleanup deletes only those.
- [ ] [M] C (1h): read about Neo4j driver sessions and transactions.

Done when: the service starts, middleware tests pass, and the cleanup test proves it only deletes `test-` data.
Feeds: week goal "Graph core"; month goal Stage 3.
Short on time: scaffold and `/health` only.

**Tue Dec 1 · Std · Follow, idempotent**
- [ ] [M] DSA hour first.
- [ ] [L] A (2h): tests first. `PUT /api/graph/follow/:userId`, with the caller taken from `x-user-id`. `MERGE` both user nodes and the relationship. Self-follow returns 400. Add the unique constraint on `User.id`. (`PUT` because the action is idempotent.)
- [ ] [L] B (1.5h): test that following twice leaves exactly one relationship.

Done when: following twice leaves exactly one relationship and the self-follow test passes.
Feeds: the core of the Graph Service.
Short on time: the follow endpoint with one happy-path test.

**Wed Dec 2 · Std · Unfollow and status**
- [ ] [L] A (2h): idempotent `DELETE /api/graph/follow/:userId` and a relationship-status endpoint.
- [ ] [L] B (1.5h): `catchAsync` and `AppError` in TypeScript.
- [ ] [M] C (1h): read about status codes for idempotent deletes (204 vs 404).

Done when: tests cover unfollow-when-not-following and status in both directions.

**Thu Dec 3 · Std · Lists and counts**
- [ ] [M] DSA hour first.
- [ ] [L] A (2h): followers and following, paginated with a total, validated with your TS `parsePositiveInt`, stable ordering.
- [ ] [L] B (1.5h): a counts endpoint.

Done when: pagination tests (limits, bad parameters, order) pass.

**Fri Dec 4 · Std · Batch status**
- [ ] [L] A (2h): `POST /api/graph/status/batch`: given a list of ids, return which ones the caller follows. Validate and cap the list size. This stops N+1 requests later.
- [ ] [L] B (1.5h): `PROFILE` the followers query in Neo4j Browser and note what it shows.
- [ ] [M] C (1h): read about N+1 queries.

Done when: tests cover empty, normal and over-limit lists.
Feeds: Week 3's one-status-call-per-page milestone.

**Sat Dec 5 · Spike or Deep · Review and flex**
- [ ] [M] DSA hour. [L] Weekly review. [M] Career lane.
- [ ] [L] Stretch: write the Graph Service `openapi.yaml`.

Done when: all suites green and the week reviewed.
Teach-back: why does `MERGE` make follow idempotent, and what goes wrong without a unique constraint?

### Week 3: Dec 7 to 12. Gateway, security and follow in the UI

**Mon Dec 7 · Std · Through the Gateway**
- [ ] [L] A (2h): add `/api/graph` behind `verifyToken` in the Gateway, with its `pathRewrite`. Add `GRAPH_SERVICE_URL` to the `.env.example`.
- [ ] [L] B (1.5h): confirm the same request ID appears in both services' logs. Curl walkthrough with two real users: follow, status, unfollow.
- [ ] [M] C (1h): update the OpenAPI file.

Done when: follow and unfollow work by curl through the Gateway.

**Tue Dec 8 · Std · Tier 2 security**
- [ ] [M] DSA hour first.
- [ ] [L] A (2h): tight per-route limits on `/login` and `/register`, with 429 tests.
- [ ] [L] B (1.5h): add Helmet to the Gateway. Check headers with `curl -I`.

Done when: the limiter returns 429 past the threshold in a test and the headers show.

**Wed Dec 9 · Std · API client and FollowButton**
- [ ] [L] A (2h): `api/graph.js` and a `FollowButton` with an optimistic update and rollback.
- [ ] [L] B (1.5h): component tests, including the rollback when the request fails.
- [ ] [M] C (1h): read about optimistic UI.

Done when: tests pass and the button toggles in the browser.

**Thu Dec 10 · Std · One status call per page**
- [ ] [M] DSA hour first.
- [ ] [L] A (2h): `Home` calls the batch endpoint once per page, not once per card.
- [ ] [L] B (1.5h): tests for empty and large lists. Check the network tab.

Done when: the network tab shows one status call per page.

**Fri Dec 11 · Std · User Service batch endpoint**
- [ ] [L] A (2h): an internal endpoint that turns ids into usernames, internal-secret protected, with tests.
- [ ] [L] B (1.5h): start the Content Service client for it, with a timeout.
- [ ] [M] C (1h): read about timeouts in service-to-service calls.

Done when: the endpoint is tested, and the Content Service client has a timeout.

**Sat Dec 12 · Spike or Deep · Review and flex**
- [ ] [M] DSA hour. [L] Weekly review. [M] Career lane.
- [ ] [L] Stretch: finish the Content Service fallback (if the call fails, use the placeholder and log).

Teach-back: what does the Gateway trust, and what does it refuse to trust, on every request?

### Week 4: Dec 14 to 19. Close Stage 3

**Mon Dec 14 · Std · Author names, part 1**
- [ ] [L] A (2h): the Content Service returns posts with the author's username, falling back to the placeholder and logging if the User Service call fails.
- [ ] [L] B (1.5h): tests for success, timeout and failure.

Done when: all three cases are covered by tests.

**Tue Dec 15 · Std · Author names, part 2**
- [ ] [M] DSA hour first.
- [ ] [L] A (2h): `PostCard` shows usernames. Update the OpenAPI file and component tests.
- [ ] [L] B (1.5h): run the earlier E2E and confirm it still passes.

Done when: real usernames appear in the feed and the old E2E is green.

**Wed Dec 16 · Std · Follow E2E**
- [ ] [L] A (2h): Playwright with two browser contexts: user A posts, user B follows A, and the follow survives a reload.
- [ ] [L] B (1.5h): fix flakiness (unique usernames per run, waits on responses, not timers).

Done when: the E2E is green three times in a row.

**Thu Dec 17 · Std · Deploy Graph Service**
- [ ] [M] DSA hour first.
- [ ] [L] A (2h): deploy the Graph Service. Env vars in the dashboard, health check, Aura free-tier limits checked.
- [ ] [L] B (1.5h): follow works on the live site.

Done when: follow and unfollow work on the live URL.

**Fri Dec 18 · Std · Tidy and write**
- [ ] [L] A (2h): move the User Service to the `catchAsync` / `AppError` pattern.
- [ ] [L] B (1.5h): the PR description (what, why, how tested, known limitations) and the `LEARNED.md` Stage 3 draft.

Done when: all suites green and the PR description written.

**Sat Dec 19 · Spike or Deep · Close Stage 3**
- [ ] [L] Run every suite. Open the PR, merge it, tick `ROADMAP.md`.
- [ ] [L] **Monthly review #1** (45 min): count services deployed, tests, merged PRs, applications sent. Compare with section 5. Adjust.

Done when: the PR is merged.
Teach-back: why is the graph in Neo4j rather than a Postgres table, and what would change at 10 million follows?

---

## 9. Week cards: Weeks 5 to 11

Expand each week into daily entries on the Saturday before, using your real pace. Items below are in order.

### Week 5: Dec 21 to 26 · Feed design (holiday week, light)
- [ ] Mon Dec 21: `docs/feed-design.md`: fan-out on write, `feed:{userId}` as a sorted set scored by post timestamp, a cap per feed, what happens with authors who have huge followings (note the hybrid pull idea as a known limitation), failure behaviour.
- [ ] Tue Dec 22: Redis lists vs sorted sets in `redis-cli`. Done when you can explain why a sorted set beats a list here (ordering, trimming, harmless re-adds).
- [ ] Wed Dec 23: scaffold the Feed Service in TypeScript: same skeleton as the Graph Service, Redis config with a guard, internal-secret middleware, logging.
- [ ] Thu Dec 24 (half day): confirm tests run locally and in CI with a Redis service container.
- [ ] Fri Dec 25 and Sat Dec 26: off.
- Teach-back: why fan-out on write, and when does it stop being a good idea?

### Week 6: Dec 28 to Jan 2 · Synchronous fan-out
- [ ] Mon Dec 28: a pure `buildFanoutCommands(post, followerIds)` with unit tests.
- [ ] Tue Dec 29: an internal `POST /publish` that applies it synchronously. Integration test: a post lands in every follower's sorted set.
- [ ] Wed Dec 30: Content Service tells the Feed Service after a post is created, with a timeout. A failure is logged and never fails the post.
- [ ] Thu Dec 31: the Feed Service reads followers from the Graph Service, paginated. Mocked-downstream tests for success and failure.
- [ ] Fri Jan 1: off.
- [ ] Sat Jan 2: by curl, A posts and B's feed has it. Weekly review.
- Teach-back: what is idempotency, and why does your fan-out need it?

### Week 7: Jan 4 to 9 · Read the feed, then BullMQ basics
- [ ] Mon Jan 4: `GET /api/feed` with a cursor (the timestamp of the last item) instead of page numbers. Fetch full posts from the Content Service in one batch call. Tests: first page, next page, empty feed, a deleted post still in a feed.
- [ ] Tue Jan 5: Home gets "Following" (feed API) and "Everyone" tabs. Wire "Load more" with the cursor. Component tests.
- [ ] Wed Jan 6: **feel the problem.** Seed one author with about 2,000 fake followers on local Redis and measure `createPost` latency with synchronous fan-out. Record the number and a one-sentence reason it's a problem in `LEARNED.md`.
- [ ] Thu Jan 7: BullMQ basics: queue, worker, job options (attempts, backoff, remove on complete). The worker needs its own `ioredis` connection with `maxRetriesPerRequest: null`. A toy job that retries.
- [ ] Fri Jan 8: `/publish` enqueues one job. The worker splits followers into chunks of about 500. Test chunking, and test that processing the same job twice leaves the feed unchanged.
- [ ] Sat Jan 9: review, career lane.
- Teach-back: why cursor pagination instead of page numbers?

### Week 8: Jan 11 to 16 · BullMQ and resilience
- [ ] Mon Jan 11: retries with exponential backoff, and a dead-letter path (failed jobs kept and listable through an internal endpoint).
- [ ] Tue Jan 12: graceful worker shutdown, `removeOnComplete`, a cap on kept jobs. Test: the worker throws, the job retries N times, then lands in the failed set.
- [ ] Wed Jan 13: measure again. Write both numbers into `LEARNED.md`. Done when latency no longer grows with follower count.
- [ ] Thu Jan 14: resilience drill 1: kill the Content Service in the middle of a feed request and watch. Put a timeout on every outbound call, with retries and backoff only for safe GETs.
- [ ] Fri Jan 15: resilience drill 2: a circuit breaker (for example `opossum`) around the Content call. When open, return what you can with `degraded: true`. Tests show it opening and recovering.
- [ ] Sat Jan 16: review. Career lane. Optional deep day: start the degraded-feed notice in the UI.
- Teach-back: what does a circuit breaker protect, and what does it cost?

### Week 9: Jan 18 to 23 · Close Stage 4
- [ ] Mon Jan 18: degraded-feed notice in the UI. Polling for new posts every 15 to 30 seconds (your fallback for server-sent events).
- [ ] Tue Jan 19: Playwright feed E2E: A posts, B sees it by polling and after a reload.
- [ ] Wed Jan 20: deploy the Feed Service and the worker (as a background service type). Check Upstash command usage against the free limits.
- [ ] Thu Jan 21: request ID visible across three services' logs. Fix gaps.
- [ ] Fri Jan 22: all suites green, PR with a real description, `LEARNED.md`, `ROADMAP.md` ticks.
- [ ] Sat Jan 23: merge. **Monthly review #2.**
- Teach-back: how does one request ID let you debug across five services?

### Week 10: Jan 25 to 30 · Security
- [ ] Mon Jan 25: rotate the JWT and internal secrets everywhere (hosts, CI, local). Confirm no secrets in logs or git history.
- [ ] Tue Jan 26: `npm audit` on every service, enable Dependabot, triage each finding in writing.
- [ ] Wed Jan 27: OWASP exercise 1 (SQL injection or XSS): a deliberately vulnerable endpoint on a throwaway branch, an exploit, the fix, and a test proving it. Write up in `docs/security.md`.
- [ ] Thu Jan 28: OWASP exercise 2 (CORS or token storage in `localStorage`). Same method.
- [ ] Fri Jan 29: indexing pass: `EXPLAIN ANALYZE` on the slowest Postgres query, `explain()` on the slowest Mongo query, `PROFILE` on the slowest Cypher query.
- [ ] Sat Jan 30: tick the security checklist in `ROADMAP.md`. Review.
- Teach-back: pick one attack from this week and explain it to a non-engineer.

### Week 11: Feb 1 to 6 · Deploy, README, demo
- [ ] Mon Feb 1: deploy everything. Health checks. Confirm signup, follow, post and feed work on the live URL.
- [ ] Tue Feb 2: CI for every service (matrix, Redis service container) and auto-deploy on merge to `main`.
- [ ] Wed Feb 3: production-only bugs: run the E2E suite against the live site. Fix CORS, cold start and timeouts. Done when it passes three times in a row.
- [ ] Thu Feb 4: README: architecture diagram, "why four databases", run-locally guide, OpenAPI links, screenshots, honest limitations.
- [ ] Fri Feb 5: record a 2 to 3 minute demo video narrating the architecture. Update your CV and GitHub profile from `LEARNED.md`.
- [ ] **Sat Feb 6: employable core checkpoint.** Weekly review. From Monday, applications become about 3 hours a week.
- Teach-back: record yourself explaining the whole system in two minutes without notes.

---

## 10. After the core: Stage 7 and automation (sketch)

Expand into daily plans at the end of Week 11, using your real pace.

- **Week 12 (Feb 8 to 13):** explain embeddings and cosine similarity in plain language first. Add `pgvector` on Neon, embed posts on creation through a BullMQ job, build the similarity endpoint with tests.
- **Week 13 (Feb 15 to 20):** wire semantic search into the existing search bar. Build the minimal RAG flow on the AI page: question, retrieval, prompt, answer, with sources shown.
- **Week 14 (Feb 22 to 27):** a small tool-calling agent that uses your Content and Graph services as tools. An MCP server exposing the same API. An evaluation harness: a fixed question set with expected results and a score you can compare across changes.
- **Week 15 (Mar 1 to 6):** an n8n workflow triggered by a Content Service webhook on new posts (moderation or tagging via the Claude API, writing the result back). Deploy it. Write it up.
- **Week 16 (Mar 8 to 13):** buffer, merge everything, final deploy. Stage 5 (Dockerfiles, images pushed to a registry from CI). Career checkpoint: count deployed services, applications sent, interviews, then decide the next move. Start planning Phase 2: data science and ML fundamentals.

## 11. Reviews

**Saturday review (45 min):**
1. Run every test suite.
2. Tick `ROADMAP.md`.
3. Update the `LEARNED.md` draft: bugs found, decisions made and why.
4. Compare plan with actual hours and tasks, and note the gap.
5. Do the weekly teach-back out loud, without notes.
6. Adjust next week using the slip rules in section 4.

**Monthly review (Dec 19, Jan 23, Feb 6, Mar 13):** count services deployed, tests passing, PRs merged, applications sent, interviews, and what you can now explain from first principles. Compare against section 5.

## 12. Risks to check early

- **Free tiers:** hosts that sleep when idle, Aura pausing, Upstash command limits (BullMQ polls Redis often, so do the 2,000-follower measurement on local Redis), GitHub Actions minutes. Read current terms the day each becomes relevant. These are not verified here.
- **TypeScript is new in Week 2.** If it costs more than 2 days, keep `strict: true` and postpone the OpenAPI file and extra E2E for that service rather than dropping TypeScript.
- **Neo4j test isolation:** you have one free instance, so tests must clean up only `test-` data.
- **Polling instead of server-sent events:** deliberate, to save time. Revisit after the core if you want the extra learning.
- **Holiday weeks (Dec 21 to Jan 2):** planned light. Any work in them is a bonus.

## 13. Plan vs actual log

| Week | Planned milestone | Hours (actual) | Done? | What slipped, and why |
|---|---|---|---|---|
| 1 | Live stable, CI, Cypher, TS ports | | | |
| 2 | Graph core | | | |
| 3 | Gateway and follow UI | | | |
| 4 | Stage 3 closed | | | |
