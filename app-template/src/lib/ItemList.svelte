<script lang="ts">
  import type { FieldSpec } from "./validate";
  import EmptyState from "./EmptyState.svelte";

  let {
    items,
    spec,
    onDelete,
  }: {
    items: Record<string, unknown>[];
    spec: FieldSpec[];
    onDelete: (item: Record<string, unknown>) => void;
  } = $props();
</script>

{#if items.length === 0}
  <EmptyState message="Nothing here yet." />
{:else}
  <table>
    <thead>
      <tr>
        {#each spec as field (field.name)}
          <th>{field.label}</th>
        {/each}
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each items as item (item.id)}
        <tr>
          {#each spec as field (field.name)}
            <td>{item[field.name] ?? ""}</td>
          {/each}
          <td>
            <button type="button" onclick={() => onDelete(item)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
</style>
