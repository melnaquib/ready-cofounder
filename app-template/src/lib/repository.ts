export interface Repository<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(input: Omit<T, "id">): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

function readAll<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function createRepository<T extends { id: string }>(key: string): Repository<T> {
  return {
    async list() {
      return readAll<T>(key);
    },

    async get(id) {
      const items = readAll<T>(key);
      return items.find((item) => item.id === id) ?? null;
    },

    async create(input) {
      const items = readAll<T>(key);
      const created = { ...input, id: crypto.randomUUID() } as T;
      writeAll(key, [...items, created]);
      return created;
    },

    async update(id, patch) {
      const items = readAll<T>(key);
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) throw new Error(`No item with id "${id}"`);

      const updated = { ...items[index], ...patch, id } as T;
      const next = [...items];
      next[index] = updated;
      writeAll(key, next);
      return updated;
    },

    async remove(id) {
      const items = readAll<T>(key);
      writeAll(
        key,
        items.filter((item) => item.id !== id),
      );
    },
  };
}
