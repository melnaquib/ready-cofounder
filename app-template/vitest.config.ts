import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: "jsdom",
    passWithNoTests: false,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    conditions: ["browser"],
  },
});
