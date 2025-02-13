<script lang="ts">
  export let className = '';
</script>

<div class="{className} animate-pulse bg-gray-200 rounded-md"></div>

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
