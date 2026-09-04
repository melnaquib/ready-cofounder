import { beforeEach, describe, expect, it } from "vitest";
import { createRepository } from "./repository";

type Item = { id: string; name: string };

const KEY = "test-items";

beforeEach(() => {
  localStorage.clear();
});

describe("createRepository", () => {
  it("returns an empty list when nothing is stored", async () => {
    const repo = createRepository<Item>(KEY);
    expect(await repo.list()).toEqual([]);
  });

  it("creates an item and lists it", async () => {
    const repo = createRepository<Item>(KEY);
    const created = await repo.create({ name: "First" });

    expect(created.id).toBeTruthy();
    expect(created.name).toBe("First");
    expect(await repo.list()).toEqual([created]);
  });

  it("updates an existing item", async () => {
    const repo = createRepository<Item>(KEY);
    const created = await repo.create({ name: "First" });

    const updated = await repo.update(created.id, { name: "Renamed" });

    expect(updated).toEqual({ id: created.id, name: "Renamed" });
    expect(await repo.list()).toEqual([updated]);
  });

  it("removes an item", async () => {
    const repo = createRepository<Item>(KEY);
    const created = await repo.create({ name: "First" });

    await repo.remove(created.id);

    expect(await repo.list()).toEqual([]);
  });

  it("recovers from corrupt stored JSON by returning an empty list", async () => {
    localStorage.setItem(KEY, "{not valid json");
    const repo = createRepository<Item>(KEY);

    expect(await repo.list()).toEqual([]);

    const created = await repo.create({ name: "Recovered" });
    expect(await repo.list()).toEqual([created]);
  });
});
