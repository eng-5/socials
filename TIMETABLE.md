# Timetable: 6 hours a day (Sat Oct 24, 2026 to Fri Jan 29, 2027)

How to use this file: open it at the start of each day, do that day's block, tick the boxes, and compare plan to actual at the Saturday review. Keep `ROADMAP.md` as the checklist of *what*, and this file as the plan for *when*.

## Assumptions (change these and the dates move)

- 6 focused hours a day, six days a week (Monday to Saturday). **Sunday is fully off.** That is 36 hours a week, on top of any paid work.
- Week 1 starts **Monday Oct 26**. Today (Saturday Oct 24) is Day 0: closing Stage 2.
- Time scaling: if your real hours are H a day instead of 6, multiply every duration by 6 / H.
- Estimates come from your measured pace so far plus the original roadmap. Treat Weeks 1 to 8 as reliable and Weeks 9 to 14 as a sketch. Expect real slippage of 20 to 40 percent. The buffers below are there for that.
- I have not verified any free-tier terms (host sleep rules, Aura pausing, Upstash command quotas, GitHub Actions minutes). Check each one on Day 1 of the week that depends on it.

## How a day works (6 hours)

| Time | Block |
|---|---|
| 0:00 to 0:20 | Warm-up: read yesterday's "first task for today" note, `git pull`, run the test suite for the service you'll touch |
| 0:20 to 2:50 | **Block A**: the hardest build task, test first |
| 2:50 to 3:10 | Break, away from the screen |
| 3:10 to 5:10 | **Block B**: wiring, integration and tests. On DSA days (Tue, Thu, Sat) the first hour is DSA |
| 5:10 to 5:40 | Close: commit and push, add bullets to the `LEARNED.md` draft (bug found, how fixed), write tomorrow's first task |
| 5:40 to 6:00 | Overflow for debugging that ran long |

Daily rule: read the first error, change one thing, run again. Run `git status` before every `git add`.

## Weekly rhythm and slip rules

- **Mon to Fri:** build. **Saturday:** finish anything that slipped, then the weekly review. **Sunday:** off.
- **Saturday review (45 minutes):** run every suite, tick `ROADMAP.md`, update the `LEARNED.md` draft, compare plan with actual, plan next week.
- **If you are 1 day behind:** absorb it on Saturday.
- **If you are more than 2 days behind at a review, cut in this order:** optional items (Cloudinary, extra dashboards), extra E2E tests (keep the happy path), two of the four OWASP exercises instead of all four. **Never cut:** tests for new endpoints, anything that fails open, the PR description, the `LEARNED.md` entry.
- **If you are a week behind:** re-plan the remaining weeks. Don't compress sleep.

## Weekly milestones

| Week | Dates | Theme | Done when |
|---|---|---|---|
| 0 | Sat Oct 24 | Close Stage 2 | PR merged, all suites green |
| 1 | Oct 26 to 31 | Live link, CI, Neo4j and TypeScript foundations | Public URL works, CI goes red then green, 8 Cypher queries written, first TS module tested |
| 2 | Nov 2 to 7 | Graph Service core | Follow, unfollow, lists, counts, tested, reachable through the Gateway |
| 3 | Nov 9 to 14 | Follow in the UI, close Stage 3 | Follow button works end to end, real usernames shown, E2E green, PR merged |
| 4 | Nov 16 to 21 | Feed foundations | Post by A reaches B's feed by curl, synchronous fan-out |
| 5 | Nov 23 to 28 | BullMQ | Post latency no longer grows with follower count, retries and dead-letter proven |
| 6 | Nov 30 to Dec 5 | Resilience, live updates, close Stage 4 | Feed survives a dead service, new posts appear without reload, PR merged |
| 7 | Dec 7 to 12 | Security hardening | All Tier 2 items done, four OWASP write-ups, reset and verification flows |
| 8 | Dec 14 to 19 | Deploy, README, demo | **Employable core**: live demo, green CI, README, video. Start applying |
| 9 | Dec 21 to 26 | Buffer and cleanup (holiday week) | Leftovers done, Stage 5 Docker and registry in CI |
| 10 | Dec 28 to Jan 2 | Stage 6 polish | Accessibility and performance pass, README final |
| 11 | Jan 4 to 9 | Stage 7: embeddings and semantic search | Posts embedded on creation, similarity endpoint |
| 12 | Jan 11 to 16 | Stage 7: search UI and RAG | Search bar uses semantic search, RAG answer on the AI page |
| 13 | Jan 18 to 23 | Stage 7: agent and evaluation | Tool-calling agent plus an evaluation harness with scores |
| 14 | Jan 25 to 29 | Buffer and checkpoint | Everything merged, career checkpoint review |

---

## Day 0: Saturday Oct 24 (about 4 hours): close Stage 2

- [ ] Confirm `internalAuth` (fail-closed version) is in both `user-service` and `content-service`. Run its test against the old code first and watch "fails closed" fail
- [ ] Content Service `package.json` cleanup (dev dependencies, remove `mongodb-memory-server`, rename)
- [ ] Run all five suites: Gateway, User Service, Content Service, Vitest, Playwright. Fix only real failures
- [ ] Push, open the PR with the description we wrote, merge
- [ ] Paste the Stage 2 entry into `LEARNED.md` and rewrite any line that isn't true to you; replace `ROADMAP.md`
- [ ] Decide on the "(proposed)" roadmap adjustments: this timetable assumes you keep them (early deploy, thin CI, live feed updates, early semantic search, accessibility pass)

---

## Week 1: Oct 26 to 31. Live link, CI, foundations

- [ ] **Mon Oct 26: Deploy the backend**
  Do: choose a free Node host (Render, Railway or Fly.io; read the current free-tier terms first, since many free services sleep when idle). Deploy User Service, Content Service and the Gateway, one root directory per service, with env vars in the dashboard, never in git. Point them at Neon, Atlas and Upstash.
  Done when: each `/health` answers on its public URL, and register plus login works by curl through the deployed Gateway.
- [ ] **Tue Oct 27: Deploy the frontend**
  Do: deploy `frontend/frontend` to Vercel or Netlify with `VITE_API_URL` set. The Gateway's CORS origin is hard-coded to localhost, so move it to an env var and allow the deployed origin. Make Playwright's `baseURL` read an env var.
  Done when: you can sign up, post and log out on the live site, and `npm run e2e` passes against it.
- [ ] **Wed Oct 28: Thin CI**
  Do: a GitHub Actions workflow that runs `npm ci && npm test` for the Gateway, User Service and Content Service, and `vitest run` for the frontend, with test database URLs in GitHub secrets.
  Done when: a pushed commit shows a green check, and a deliberately broken test on a branch turns it red.
- [ ] **Thu Oct 29: Neo4j and Cypher**
  Do: check your Aura instance is running (free instances can pause when idle). Connect from a throwaway script with `neo4j-driver`. In Neo4j Browser practice `MATCH`, `CREATE`, `MERGE`, `DELETE`.
  Done when: eight queries are written, run and saved in `docs/cypher.md`: follow, unfollow, is-following, followers, following, counts, mutual follows, friends-of-friends suggestions.
- [ ] **Fri Oct 30: TypeScript foundations**
  Do: a throwaway TS project with `strict: true`. Learn types vs interfaces, unions, generics basics, typing Express handlers, `unknown` vs `any`. Port `parsePositiveInt` and `AppError` to TypeScript with tests.
  Done when: both modules compile in strict mode and their tests pass.
- [ ] **Sat Oct 31: Review and flex**
  Do: catch up, run the weekly review, plan Week 2.

---

## Week 2: Nov 2 to 7. Graph Service core (TypeScript)

- [ ] **Mon Nov 2: Scaffold**
  Do: `services/graph-service` in TypeScript with the `app` / `server` split, a Neo4j driver config that fails fast, `/health`, internal-secret middleware (fails closed) with tests, Pino logging with request IDs and redaction. Decide test isolation for Neo4j: you have one free instance, so give every test node an id starting with `test-` and delete only those after each test.
  Done when: the service starts, middleware tests pass, and one test proves cleanup removes only `test-` data.
- [ ] **Tue Nov 3: Follow, idempotent** (DSA hour first: 2 array or hash-map problems)
  Do: tests first. `POST /api/graph/follow/:userId`, with the caller taken from `x-user-id`. `MERGE` both user nodes and the relationship. Reject following yourself with 400.
  Done when: following twice leaves exactly one relationship, and the self-follow test passes.
- [ ] **Wed Nov 4: Unfollow and status**
  Do: idempotent unfollow, a relationship-status endpoint, `catchAsync` and `AppError` in TypeScript.
  Done when: tests cover unfollow-when-not-following and status in both directions.
- [ ] **Thu Nov 5: Lists and counts** (DSA hour first)
  Do: followers and following, paginated with a total, validated; a counts endpoint.
  Done when: pagination tests (limits, bad parameters, order) pass.
- [ ] **Fri Nov 6: Through the Gateway**
  Do: add `/api/graph` behind `verifyToken`, write the OpenAPI file, check the same request ID appears in both logs, and do a curl walkthrough with two real users. Security hour: start `verifyToken` hardening (check `Bearer ` with the space, require HS256) with tests.
  Done when: follow and unfollow work by curl through the Gateway.
- [ ] **Sat Nov 7: Review and flex** (DSA hour first)

---

## Week 3: Nov 9 to 14. Follow in the UI, close Stage 3

- [ ] **Mon Nov 9: API client and FollowButton**
  Do: `api/graph.js`, a `FollowButton` with an optimistic update and rollback, shown on other people's posts, with component tests.
  Done when: tests pass and the button toggles in the browser.
- [ ] **Tue Nov 10: Avoid N+1 requests** (DSA hour first)
  Do: one Graph endpoint that returns follow status for a list of ids; Home calls it once per page, not once per card.
  Done when: the network tab shows one status call per page, with tests for empty and large lists.
- [ ] **Wed Nov 11: Author names, part 1 (first service-to-service call)**
  Do: a User Service internal batch endpoint (ids to usernames), internal-secret protected, with tests. Content Service calls it with a timeout and returns posts with the author's username, falling back to the placeholder and logging if the call fails.
  Done when: tests cover success, timeout and failure fallback.
- [ ] **Thu Nov 12: Author names, part 2** (DSA hour first)
  Do: PostCard shows usernames; update the OpenAPI file and the component tests.
  Done when: real usernames appear in the feed and the Week 1 E2E still passes.
- [ ] **Fri Nov 13: E2E for follow**
  Do: Playwright with two browser contexts: user A posts, user B follows A, and the state survives a reload. Security hour: tight per-route rate limits on login and register, with tests.
  Done when: the E2E is green and the limiter returns 429 past the threshold in a test.
- [ ] **Sat Nov 14: Close Stage 3** (DSA hour first)
  Do: all suites green, deploy the Graph Service, PR with a real description, `LEARNED.md` draft, `ROADMAP.md` ticks, weekly review.
  Done when: the PR is merged.

---

## Week 4: Nov 16 to 21. Feed foundations

- [ ] **Mon Nov 16: Design before code**
  Do: study Redis lists vs sorted sets. Decide that `feed:{userId}` is a sorted set scored by post timestamp (ordering, trimming, harmless re-adds). Write a one-page `docs/feed-design.md`: fan-out on write, a cap per feed, what happens to authors with huge followings (note the hybrid "pull" idea as a known limitation), failure behavior.
  Done when: you can explain why a sorted set beats a list here.
- [ ] **Tue Nov 17: Scaffold the Feed Service (TypeScript)** (DSA hour first)
  Do: same skeleton as the Graph Service, Redis config with a guard, internal-secret middleware, logging. Test against local Redis (Memurai) on a separate database index, and against a Redis service container in CI.
  Done when: tests run both locally and in CI.
- [ ] **Wed Nov 18: Fan-out function and publish**
  Do: a pure `buildFanoutCommands(post, followerIds)` with unit tests, and an internal `POST /publish` that applies it synchronously.
  Done when: an integration test shows a post lands in every follower's sorted set.
- [ ] **Thu Nov 19: Connect the services** (DSA hour first)
  Do: Content Service tells the Feed Service after a post is created (with a timeout; a failure is logged and never fails the post). The Feed Service reads followers from the Graph Service, paginated.
  Done when: mocked-downstream tests cover success and failure, and by curl A posts and B's feed has it.
- [ ] **Fri Nov 20: Read the feed**
  Do: `GET /api/feed` with a cursor (the timestamp of the last item) instead of page numbers, and fetch full posts from Content Service in one batch call. Security hour.
  Done when: tests cover the first page, the next page, an empty feed, and a deleted post still sitting in a feed.
- [ ] **Sat Nov 21: Review and flex**

---

## Week 5: Nov 23 to 28. BullMQ

- [ ] **Mon Nov 23: Feel the problem**
  Do: seed one author with about 2,000 fake followers and measure `createPost` latency with synchronous fan-out. Use local Redis for this, because BullMQ and big seeds can use up a hosted free-tier quota quickly.
  Done when: you have a real number and a one-sentence reason it's a problem, recorded in `LEARNED.md`.
- [ ] **Tue Nov 24: BullMQ basics** (DSA hour first)
  Do: queue, worker, job options (attempts, backoff, remove on complete). A worker needs its own `ioredis` connection with `maxRetriesPerRequest: null`. Run a toy job end to end.
  Done when: the toy job succeeds and retries on failure.
- [ ] **Wed Nov 25: Move fan-out onto the queue**
  Do: `/publish` enqueues one job; the worker splits followers into chunks of about 500; fan-out stays idempotent.
  Done when: tests cover chunking, and processing the same job twice leaves the feed unchanged.
- [ ] **Thu Nov 26: Failure handling** (DSA hour first)
  Do: retries with exponential backoff, a dead-letter path (failed jobs kept and listable through an internal endpoint), graceful worker shutdown.
  Done when: a test makes the worker throw and the job is retried N times, then lands in the failed set.
- [ ] **Fri Nov 27: Measure again**
  Do: repeat Monday's measurement and write both numbers into `LEARNED.md`. Security hour.
  Done when: latency no longer grows with follower count.
- [ ] **Sat Nov 28: Review and flex** (DSA hour first)

---

## Week 6: Nov 30 to Dec 5. Resilience, live updates, close Stage 4

- [ ] **Mon Nov 30: Resilience drill 1: timeouts and retries**
  Do: kill Content Service in the middle of a feed request and watch what happens. Put a timeout on every outbound call, with retries and backoff only for safe GETs.
  Done when: the feed fails fast instead of hanging, and a test with a slow fake service proves it.
- [ ] **Tue Dec 1: Resilience drill 2: circuit breaker** (DSA hour first)
  Do: a circuit breaker around the Content call (for example `opossum`). When it's open, return what you can with `degraded: true`. The same request ID should show in three services' logs.
  Done when: tests show the breaker opening after repeated failures and recovering.
- [ ] **Wed Dec 2: Feed tabs and "Load more"**
  Do: Home gets "Following" (feed API) and "Everyone" (existing list). Wire "Load more" with the cursor, and show a degraded-feed notice.
  Done when: load-more works in the browser, with component tests.
- [ ] **Thu Dec 3: Live updates** (DSA hour first)
  Do: server-sent events from the Feed Service. Through the Gateway, streaming needs no buffering and sensible timeouts. The browser's `EventSource` can't send an `Authorization` header, so use a fetch-based SSE client.
  Done when: a new post from another user appears without a reload.
- [ ] **Fri Dec 4: E2E for the feed**
  Do: Playwright: A posts, B sees it live and again after a reload. Security hour.
  Done when: green locally and in CI.
- [ ] **Sat Dec 5: Close Stage 4**
  Do: deploy the Feed Service and worker, PR, `LEARNED.md` draft, `ROADMAP.md` ticks, weekly review.

---

## Week 7: Dec 7 to 12. Security hardening

- [ ] **Mon Dec 7: Gateway and tokens**
  Do: finish `verifyToken` hardening (separate bad-token from Redis-down, HS256 only), per-route limits for reads, Helmet.
  Done when: tests green and the headers show in `curl -I`.
- [ ] **Tue Dec 8: Secrets and dependencies** (DSA hour first)
  Do: rotate the JWT and internal secrets everywhere (hosts, CI, local). Run `npm audit` on every service, enable Dependabot, confirm no secrets in logs or git history.
  Done when: each audit finding is fixed or triaged in writing.
- [ ] **Wed Dec 9: OWASP: SQL injection and XSS**
  Do: on a throwaway branch, build one deliberately vulnerable endpoint for each. Exploit it, fix it (parameterized queries; output escaping and a CSP), and prove the fix with a test.
  Done when: each has its exploit, fix and test in `docs/security.md`.
- [ ] **Thu Dec 10: OWASP: CSRF and CORS** (DSA hour first)
  Do: same method.
  Done when: both written up.
- [ ] **Fri Dec 11: Password reset and email verification, part 1**
  Do: one-time, expiring tokens (store only a hash), a free-tier transactional email provider, responses that don't reveal whether an email exists.
  Done when: the reset flow works by curl, with tests for expiry and reuse.
- [ ] **Sat Dec 12: Part 2, indexing pass, review** (DSA hour first)
  Do: email verification flag; once it exists, make `register` respond generically. Run `EXPLAIN ANALYZE`, Mongo `explain()` and Cypher `PROFILE` on the slowest query in each store.
  Done when: the security checklist in `ROADMAP.md` is ticked.

---

## Week 8: Dec 14 to 19. Deploy, README, demo: the employable core

- [ ] **Mon Dec 14: Deploy everything**
  Do: Graph Service, Feed Service and the worker (as a background service type), env vars, health checks, and a check that Aura and Upstash usage fits the free limits.
  Done when: signup, follow, post and feed all work on the live URL.
- [ ] **Tue Dec 15: CI for every service**
  Do: a workflow matrix for all services with a Redis service container, and auto-deploy on merge to `main`.
  Done when: everything is green and a merge triggers a deploy.
- [ ] **Wed Dec 16: Production-only bugs**
  Do: run the E2E suite against the live site; fix CORS, cold-start and timeout problems; add an uptime ping.
  Done when: the E2E passes against the live URL three times in a row.
- [ ] **Thu Dec 17: README and diagrams**
  Do: an architecture diagram, "why four databases", a run-locally guide, a link to the OpenAPI files, screenshots, honest limitations.
  Done when: a stranger could run the project from the README.
- [ ] **Fri Dec 18: Demo video and profile**
  Do: script and record a 2 to 3 minute video narrating the architecture. Update your CV and GitHub profile from `LEARNED.md`.
  Done when: the video is uploaded and linked in the README and CV.
- [ ] **Sat Dec 19: Employable core checkpoint**
  Do: weekly review. **From Monday, reserve 1 hour a day for applications and networking** (aim for about 8 quality applications a week, tailored, plus a couple of messages to real people), taken from Block B.

---

## Weeks 9 to 14 (weekly level only: expand to daily plans at the end of Week 8, using your real pace)

**Week 9: Dec 21 to 26 (holiday week, plan 4 working days).** Buffer and cleanup. Move User Service to `catchAsync` / `AppError`. Finish anything that slipped. Stage 5: Dockerfiles per service, build and push images to the GitHub container registry from CI (Docker runs on GitHub's machines, not yours), a staging environment. Optional: Cloudinary uploads.

**Week 10: Dec 28 to Jan 2.** Stage 6 polish. Accessibility pass (keyboard navigation, color contrast, Lighthouse), performance pass, final README and screenshots, catch up `LEARNED.md` entries, fix the remaining frontend loose ends (Profile and Settings pages that still show mock data).

**Week 11: Jan 4 to 9. Stage 7, part 1.** Explain embeddings and cosine similarity in plain language first. Add `pgvector` on Neon, embed posts on creation through a BullMQ job, build the similarity-search endpoint with tests.

**Week 12: Jan 11 to 16. Stage 7, part 2.** Wire semantic search into the existing search bar. Build the minimal RAG flow on the AI page: question, retrieval, prompt, answer, with sources shown.

**Week 13: Jan 18 to 23. Stage 7, part 3.** A small tool-calling agent that uses your Content and Graph services as tools. An evaluation harness: a fixed question set with expected results and a score you can compare across changes. Update tests, README and `LEARNED.md`.

**Week 14: Jan 25 to 29.** Buffer, merge everything, final deploy. Career checkpoint: count deployed services, applications sent, interviews, paid outside work, and decide the next move from those numbers. Start planning Phase 2 (data science and ML fundamentals).

---

## Risks to check early

- **Free tiers:** hosts that sleep when idle, Aura pausing, Upstash command limits (BullMQ polls Redis often), GitHub Actions minutes on private repositories. Read current terms the day each becomes relevant.
- **TypeScript in Week 2** is your first time with it. If it costs more than 2 days, keep `strict: true` but postpone the OpenAPI file and extra E2E for that service rather than dropping TypeScript.
- **Server-sent events through the Gateway** may need streaming-specific proxy settings. If it burns a day, fall back to polling every 15 to 30 seconds and revisit later.
- **Applications start at Week 8, not after Stage 7.** The roadmap says the employable core is the line to start applying at.
