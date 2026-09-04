<script lang="ts">
  import { validate, type FieldSpec } from "./validate";

  let {
    spec,
    onSubmit,
    submitLabel = "Add",
  }: {
    spec: FieldSpec[];
    onSubmit: (values: Record<string, unknown>) => void;
    submitLabel?: string;
  } = $props();

  let values = $state<Record<string, unknown>>({});
  let errors = $state<Record<string, string>>({});

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const result = validate(values, spec);
    errors = result;
    if (Object.keys(result).length > 0) return;

    onSubmit(values);
    values = {};
  }
</script>

<form onsubmit={handleSubmit} novalidate>
  {#each spec as field (field.name)}
    <div class="field">
      <label for={field.name}>{field.label}</label>
      {#if field.type === "select"}
        <select id={field.name} bind:value={values[field.name]}>
          <option value="">Select {field.label}</option>
          {#each field.options ?? [] as option (option)}
            <option value={option}>{option}</option>
          {/each}
        </select>
      {:else}
        <input
          id={field.name}
          type={field.type}
          bind:value={values[field.name]}
        />
      {/if}
      {#if errors[field.name]}
        <p class="error" role="alert">{errors[field.name]}</p>
      {/if}
    </div>
  {/each}
  <button type="submit">{submitLabel}</button>
</form>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
  .error {
    color: #b00020;
    font-size: 0.85rem;
    margin: 0;
  }
</style>
