<script lang="ts">
  import type { Note } from '$lib/types';

  export let note: Note;

  const colorClasses = {
    yellow: 'bg-yellow-50',
    pink: 'bg-pink-50',
    blue: 'bg-blue-50'
  };

  function handleEdit() {
    // TODO: Implement edit functionality
  }

  function handleDelete() {
    // TODO: Implement delete functionality
  }
</script>

<div class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer">
  <div class="flex justify-between items-start mb-3">
    <h3 class="font-semibold truncate">{note.title}</h3>
    <details class="relative">
      <summary class="list-none">
        <span class="material-symbols-outlined p-1 rounded-full hover:bg-gray-100">more_vert</span>
      </summary>
      <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
        <button 
          on:click={handleEdit}
          class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
        >
          <span class="material-symbols-outlined">edit</span> Edit
        </button>
        <button 
          on:click={handleDelete}
          class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500"
        >
          <span class="material-symbols-outlined">delete</span> Delete
        </button>
      </div>
    </details>
  </div>
  <p class="text-gray-600 text-sm line-clamp-3">{note.content}</p>
  <div class="flex flex-wrap gap-2 mt-4">
    <span class="px-2 py-1 rounded text-xs {colorClasses[note.color]}">{note.color}</span>
    <span class="px-2 py-1 rounded text-xs bg-blue-100">Website: {note.website}</span>
  </div>
</div>