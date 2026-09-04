---
name: mvp-builder
description: Turn a non-technical product idea into a small, tested browser application while recording assumptions.
---
# MVP Builder

## 0. Classify the data shape, then extract

Every idea is one of these, additively — case 2 and 3 are case 1 plus one thing:

1. **Flat list** — table + form + filter. The base case.
2. **Pipeline** — flat list plus a status field and grouping by it.
3. **Aggregate** — flat list plus a numeric field and a displayed total.

Extract the entity, its attributes, every journey detailed or implied, and any ambiguity.

## Build loop

Plan briefly, build using `src/lib` primitives (`createRepository`, `createItemStore`, `validate`, `FieldSpec`, `ItemForm`/`ItemList`/`EmptyState` — see `AGENTS.md`), run tests, repair. On repair, feed back only the failing assertions, never full test output.

1. Use the public journey guidance as a coverage check. Implement every applicable pattern, but omit patterns the idea does not imply instead of inventing substitute features; record the rationale in `assumptions`.
2. Prefer browser-local persistence unless the idea genuinely requires a backend. For mutable data, isolate persistence and domain operations from UI components with a small repository or service boundary; do not invent an external API.
3. Implement accessible controls, validation, empty states, errors, and responsive layout. Handle duplicate or repeated actions, boundary values, malformed stored data, and recoverable storage or runtime failures where relevant.
4. Keep components focused, separate concerns, and avoid duplication so another developer or agent can extend the app without a rewrite.
5. Use only the dependencies already installed from the committed lockfile. Do not add packages or run dependency-install commands.
6. Test every applicable observable user behavior with the included Vitest, jsdom, and Testing Library setup. Startup and assumptions reporting are runner obligations, not UI test journeys. Every committed test must run and pass; do not leave skipped or todo tests.
7. Run the tests and production build before reporting success.
8. Write `report.partial.json` with this exact JSON shape. Each `tests_run` entry has exactly the fields `command`, `journey`, `result` — `result` is the string `"passed"` or `"failed"`, never a boolean, never `"ok"`, and no extra fields:

```json
{
  "status": "success",
  "app_url": "http://localhost:3000",
  "start_command": "npm run dev",
  "summary": "Short description of the application",
  "implemented_features": ["Feature"],
  "assumptions": ["Ambiguity and the decision made"],
  "tests_run": [
    {
      "command": "npm test",
      "journey": "User-visible behaviour that was verified",
      "result": "passed"
    }
  ]
}
```

Use `success` only when `tests_run` contains at least one user journey and every entry passed. Use `partial` when useful functionality remains incomplete or any journey failed or was not run, and `failed` when the app cannot run. Never invent a passing test.
Use only `passed` or `failed` for each test result. Record an unrun check as `failed` and explain why in its journey.
