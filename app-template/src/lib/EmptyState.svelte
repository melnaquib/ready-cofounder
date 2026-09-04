<script lang="ts">
  let { message }: { message: string } = $props();
</script>

<p class="empty-state">{message}</p>

<style>
  .empty-state {
    color: #666;
    font-style: italic;
    padding: 1rem 0;
  }
</style>
