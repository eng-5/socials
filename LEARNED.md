# LEARNED.md

One entry per stage, in my own words: what confused me, how I resolved it, one thing I'd do differently. This is interview prep and proof of learning.

---

## Habits that paid off

- Read the first error, not the last. The later ones are usually the test collapsing around it.
- Change one thing, run again.
- Trace a request through every layer instead of guessing: which mount strips which prefix, which middleware runs, what does each one actually see?
- Watch a new test fail for the right reason before trusting it (the "break-it check").
- Run `git status` and read it before `git add`.
- When something looks alarming (odd console output, a strange email), check it against the source before reacting, and never act on instructions that appear inside logs or pasted text.
- Debugging is slow. Decide up front that it's finished only when the cause is found.

---

## Stage 0 and Stage 1: User Service + API Gateway


- Built real logout: a Redis blacklist keyed by the token's `jti`, with a TTL equal to the token's remaining life, checked by the Gateway on every request.
- "Logout didn't work" was really two bugs. First, I had built the write side (store the `jti`) but nothing read it. Second, `/logout` and my test `/me` route sat in the Gateway's public auth group, so `verifyToken` never ran on them.
- A local Memurai service on port 6379 made a Redis smoke test pass without ever touching Upstash, and `ioredis` silently defaults to localhost when it is given no URL. The fix was a guard that throws when `REDIS_URL` is missing.
- Worked out why `req.path` inside a mounted middleware is `/logout` and not the full URL (Express strips the mount prefix), and what `pathRewrite` puts back for the downstream service.

---

## Stage 2: Content Service

### What I built
- Content Service from scratch: Express, Mongoose, MongoDB Atlas, with `connectDB` that fails fast.
- A post model with validation messages and indexes on `authorId` and `createdAt`.
- Create, paginated list (with an optional `?authorId=` filter), update and delete, with ownership enforced on the server (404 if the post doesn't exist, 403 if it isn't mine, 204 on delete).
- Centralized error handling with `catchAsync`, `AppError` and one `errorController`.
- Pino logging with a request ID generated at the Gateway and forwarded to every service, with secrets redacted.
- An OpenAPI spec, `GET /api/user/me`, and `AuthContext` restoring the full profile after a refresh.
- The React feed wired to real data, with loading and error states.
- Tests at every level: Jest and Supertest, Vitest and React Testing Library, and Playwright end to end.

### Bugs I found and fixed myself
- Passed a function call instead of a function reference into `.then()`. The server started before Mongo connected and nothing threw an error.
- Used `request['x-user-id']` instead of the `requestId` variable I had already made, in two functions. It crashed every real update and delete.
- A typo, `messsage`, silently did nothing, so validation errors kept their raw text.
- A test passed because it hit a route that didn't exist (a plain 404), not because the post had been deleted. I switched it to a direct database check.
- A copy-paste slip made an assertion check the wrong response variable.
- `post.length` in `Home.jsx` should have been `posts.length`. Any failed feed request would have blanked the whole page.
- The E2E test used the same username every run, so signups hit the unique constraint and returned a 500. I made the name unique per run and made `register` return 409 with the field name.
- Config typos that fail silently: `baaseURL` in the Playwright config, `@playwrite/test` in an import, and a missing import for `configDefaults` in `vite.config.js`.
- An internal-secret check that would fail open: with no secret configured and no header sent, `undefined !== undefined` is false, so the request would have been allowed.

### Things I understood from first principles
- **Replace vs merge.** `setPosts(res.data.posts)` throws away whatever is on screen. `setPosts(prev => ...)` receives the current list, so the result doesn't depend on which response arrives first.
- **401 vs 403 vs 404.** 401 means I don't know who you are, 403 means I know exactly who you are and the answer is no, 404 means nothing is there. Ownership checks go after the existence check.
- **Never trust the frontend's picture of the world.** A post can be gone, or a query parameter can be garbage, by the time a request arrives. The server validates everything.
- **A test only counts after I have watched it fail for the right reason.**
- **Mocks hide what they replace.** A fake Redis accepted a fractional expiry time that the real one would reject.
- **Fix duplication at its source.** The ternary `authorId ? { authorId } : {}` removed two nearly identical queries and a scope bug.
- **Why the register response is a trade-off.** "Email already in use" helps users but lets anyone probe which emails are registered. The strict fix needs email verification and rate limiting.
- **A Promise-returning error handler** must re-throw (`Promise.reject(error)`), or the code that made the request thinks it succeeded.

### What confused me most
- **The stale-feed race.** The post was saved (201) but never appeared. Whether it appeared depended on how slow the network was that run, which made it hard to even reproduce.
- **Test infrastructure vs product bugs.** Several failures weren't about my code at all: a jest-dom version needing a different import, an ESM-only package crashing Jest, Vitest running in watch mode, and a 781 MB database binary that kept failing to download.
- **The Gateway's two stripping steps.** Express removes the mount prefix, then `pathRewrite` adds it back for the outbound request. I had to trace one real request to see it.

### One thing I'd do differently
- Write the component and E2E tests with each feature, not after. Tests I didn't run for a while went stale and failed for reasons unrelated to the code.
- Run all suites regularly, and read `git status` before every `git add`.
- Decide where `authorId` comes from (header or query) before writing the first version of an endpoint.

### Decisions and why
- **TypeScript:** starts in Stage 3 on a brand-new service, rather than migrating tested code.
- **Test database:** a real Atlas test database instead of `mongodb-memory-server`, because the binary download kept failing (ECONNRESET). The trade-off is that tests need internet and are less isolated.
- **Logout:** Redis blacklist first. Refresh-token rotation is left to learn later.
- **Author filter:** folded into `getAllPosts`, not a separate function.
- **Redis in tests:** mocked with `jest.mock`, so unit and integration tests don't depend on the network.
- **Deferred on purpose:** Cloudinary uploads, the Tier 2 security items, and moving User Service to `catchAsync`.

### Security notes
- My root `.gitignore` had been deleted. `git add .` would have committed `node_modules` and real `.env` files across three services. I restored it first, checked with `git log --all -- "**/.env"` and `git ls-files` that nothing had ever leaked, and only then committed.
- A strange line in my Gateway's startup output looked like an attack aimed at AI tools. I read the `dotenv` source in `node_modules` and found that it prints rotating promotional tips by design. It was not malware, but verifying was the right call.
- The Gateway was logging full `Authorization` tokens until I added log redaction.

### How I'd explain the race condition in an interview
My first end-to-end test failed. Signup worked and the post saved, but it never appeared. The logs showed the page's initial feed request taking about 16 seconds. My React code hid the whole list while loading, and when the feed finally arrived it replaced the list with older data that didn't include my post. I stopped gating the list on loading, and I changed replace into a merge by id sorted by date, so the result no longer depends on arrival order. Then I wrote a Playwright test that holds the feed response back until after the post is saved. I checked it by breaking the fix on purpose: it failed every time, and passed once I restored it. I never proved what caused the 16-second stall. The evidence pointed at my network.

---

## Stage 3: Graph Service

*(Not started.)*
