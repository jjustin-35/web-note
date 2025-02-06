<script lang="ts">
  export let searchQuery = '';
  export let websiteFilter = '';
</script>

<div class="bg-white p-4 rounded-lg shadow-md">
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="relative w-full sm:w-[300px]">
      <span class="material-symbols-outlined absolute left-3 top-2.5">search</span>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search notes..."
        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
      />
    </div>
    <div class="w-full sm:w-auto">
      <input
        type="text"
        bind:value={websiteFilter}
        placeholder="Filter by website..."
        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
      />
    </div>
  </div>
</div>