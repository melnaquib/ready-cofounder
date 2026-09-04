# Generated application contract

## Stack

Svelte 5 + Vite + Vitest. Components are `.svelte` files using runes (`$state`, `$derived`, `$effect`, `$props`), never the Svelte 4 options API. Tests use Vitest, jsdom, and `@testing-library/svelte`, in `src/**/*.test.ts`.

## Available primitives (`src/lib/`) — import directly, do not read the source first

```ts
// repository.ts — durable storage seam
interface Repository<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(input: Omit<T, "id">): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}
function createRepository<T extends { id: string }>(key: string): Repository<T>;

// store.ts — reactive wrapper over a Repository
function createItemStore<T extends { id: string }>(repo: Repository<T>): {
  subscribe: Readable<T[]>["subscribe"];
  load(): Promise<void>;
  add(input: Omit<T, "id">): Promise<void>;
  patch(id: string, patch: Partial<T>): Promise<void>;
  remove(id: string): Promise<void>;
};

// validate.ts — generic field validation
type FieldSpec = { name: string; label: string; type: "text" | "number" | "date" | "select"; required?: boolean; options?: string[] };
function validate(values: Record<string, unknown>, spec: FieldSpec[]): Record<string, string>;

// ItemForm.svelte:  { spec: FieldSpec[]; onSubmit: (values) => void; submitLabel?: string }
// ItemList.svelte:  { items: Record<string, unknown>[]; spec: FieldSpec[]; onDelete: (item) => void }
// EmptyState.svelte: { message: string }
```

## Scope

Single page only: no router, no navigation, no admin view, no auth, no backend. A second view is a modal or panel, never a route. If the idea implies scale, multi-tenancy, or roles, record that as out of scope in `assumptions` and build single-user local.

## Edit discipline & persistence

Prefer targeted edits over rewriting files; when fixing a failure, change only the lines involved. All state goes through `createRepository` — never call `localStorage` directly from a component. `Repository`'s async signatures are the swap seam for a future remote backend: components and stores only ever see `Repository`/`createItemStore`, never the storage detail, so a fetch-backed implementation can replace `createRepository` without touching UI code. State this seam explicitly in `implemented_features` or `assumptions`.

If the idea has persisted data, add one test that seeds corrupted or missing storage and asserts the app still renders with an empty/recovered state (`createRepository` already guarantees this — it never throws).

## Reporting

- `report.partial.json` contains only `status`, `app_url`, `start_command`, `summary`, `implemented_features`, `assumptions`, and `tests_run`.
- Every ambiguity in the idea must be resolved explicitly and recorded in `assumptions`, with the interpretation chosen.
- `success` needs at least one `tests_run` entry, all `passed`. Record a failed or unrun journey as `failed` with the reason in `journey`.
- The runner owns `app_url`, `start_command`, `harness_checks`, and telemetry. Never create or edit `result.json`.

## Constraints

- Use only dependencies already in the committed lockfile. Never add packages or run installs.
- Add at least one passing `src/**/*.test.ts` test; zero-test, skipped, or todo reports are rejected.
