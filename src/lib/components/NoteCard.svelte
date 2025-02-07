<script lang="ts">
  import type { Note, Color } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  export let note: Note;
  let isDeleteModalOpen = false;

  const dispatch = createEventDispatcher<{
    edit: Note;
    delete: string;
  }>();

  const colorClasses = {
    yellow: 'bg-yellow-100',
    pink: 'bg-pink-100',
    blue: 'bg-blue-100'
  };

  function handleDelete() {
    isDeleteModalOpen = true;
  }

  function confirmDelete() {
    dispatch('delete', note.id);
    isDeleteModalOpen = false;
  }
</script>

<div class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer">
  <div class="flex justify-between items-start mb-3">
    <h3 class="font-semibold truncate">{note.title}</h3>
    <div class="flex justify-between items-start">
      <button 
        on:click={() => dispatch('edit', note)}
        class="text-gray-500 hover:text-gray-700"
      >
        <span class="material-symbols-outlined">edit</span>
      </button>
      <button 
        on:click={handleDelete}
        class="text-gray-500 hover:text-red-500"
      >
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  </div>
  <p class="text-gray-600 text-sm line-clamp-3">{note.content}</p>
  <div class="flex flex-wrap gap-2 mt-4">
    <span class="px-2 py-1 rounded text-xs {colorClasses[note?.color || 'yellow']}">{note.color}</span>
    <span class="px-2 py-1 rounded text-xs bg-blue-100">Website: {note.website}</span>
  </div>
</div>

{#if isDeleteModalOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full">
      <h3 class="text-lg font-semibold mb-4">Delete Note</h3>
      <p class="text-gray-600 mb-6">Are you sure you want to delete "{note.title}"? This action cannot be undone.</p>
      <div class="flex justify-end gap-3">
        <button
          on:click={() => isDeleteModalOpen = false}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          on:click={confirmDelete}
          class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}