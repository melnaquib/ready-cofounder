import { writable, type Readable } from "svelte/store";
import type { Repository } from "./repository";

export function createItemStore<T extends { id: string }>(
  repo: Repository<T>,
): {
  subscribe: Readable<T[]>["subscribe"];
  load(): Promise<void>;
  add(input: Omit<T, "id">): Promise<void>;
  patch(id: string, patch: Partial<T>): Promise<void>;
  remove(id: string): Promise<void>;
} {
  const { subscribe, set } = writable<T[]>([]);

  async function load() {
    set(await repo.list());
  }

  async function add(input: Omit<T, "id">) {
    await repo.create(input);
    await load();
  }

  async function patch(id: string, patch: Partial<T>) {
    await repo.update(id, patch);
    await load();
  }

  async function remove(id: string) {
    await repo.remove(id);
    await load();
  }

  return { subscribe, load, add, patch, remove };
}
