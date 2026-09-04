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
2. Isolate persistence and domain operations from UI components with a small repository or service boundary (see `AGENTS.md`); do not invent an external API.
3. Keep components focused, separate concerns, and avoid duplication so another developer or agent can extend the app without a rewrite.
4. Test every applicable observable user behavior with the included Vitest, jsdom, and Testing Library setup. Startup and assumptions reporting are runner obligations, not UI test journeys.
5. Write `report.partial.json` with this exact JSON shape. Each `tests_run` entry has exactly the fields `command`, `journey`, `result` — `result` is the string `"passed"` or `"failed"`, never a boolean, never `"ok"`, and no extra fields:

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

Wrong — never do this: `{"journey": "...", "passed": true}`. There is no `passed` field; the field is `result`, and its value is the string `"passed"` or `"failed"`, never a boolean.

The full success/partial/failed criteria, test and build requirements, and every other outcome the app must meet are in the system prompt — this skill only adds the data-shape classification, the available primitives, and the exact report shape.
