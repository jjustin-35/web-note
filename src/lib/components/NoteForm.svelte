<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Note, Color } from '$lib/types';

  export let isOpen = false;
  export let editingNote: Note | null = null;
  
  const colors: Color[] = ['yellow', 'pink', 'blue'];

  const dispatch = createEventDispatcher<{
    close: void;
    save: Note;
    update: { id: string; note: Partial<Note> };
  }>();

  $: note = editingNote ? {
    title: editingNote.title,
    content: editingNote.content,
    website: editingNote.website || '',
    tags: editingNote.tags || [],
    color: editingNote.color || 'yellow',
    position: editingNote.position || { x: 0, y: 0 }
  } : {
    title: '',
    content: '',
    website: '',
    tags: [],
    color: 'yellow' as Color,
    position: { x: 0, y: 0 }
  };

  $: tagsInput = note.tags.join(', ');

  function handleSubmit() {
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const updatedNote = {
      ...note,
      tags
    };

    if (editingNote) {
      dispatch('update', { 
        id: editingNote.id, 
        note: updatedNote 
      });
    } else {
      dispatch('save', updatedNote as Note);
    }
    resetForm();
  }

  function resetForm() {
    if (!editingNote) {
      note = {
        title: '',
        content: '',
        website: '',
        tags: [],
        color: 'yellow',
        position: { x: 0, y: 0 }
      };
      tagsInput = '';
    }
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{editingNote ? 'Edit' : 'Add New'} Note</h2>
        <button on:click={() => isOpen = false} class="text-gray-500 hover:text-gray-700">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            id="title"
            bind:value={note.title}
            class="form-input p-2"
            required
          />
        </div>

        <div>
          <label for="content" class="form-label">Content</label>
          <textarea
            id="content"
            bind:value={note.content}
            rows="4"
            class="form-input p-2"
            required
          ></textarea>
        </div>

        <div>
          <label for="website" class="form-label">Website</label>
          <input
            type="text"
            id="website"
            bind:value={note.website}
            class="form-input p-2"
          />
        </div>

        <div>
          <label for="tags" class="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            bind:value={tagsInput}
            class="form-input p-2"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div>
          <div class="form-label mb-2">Color</div>
          <div class="flex gap-4">
            {#each colors as color}
              <button
                type="button"
                class="w-8 h-8 rounded-full border-2 {note.color === color ? 'border-blue-500' : 'border-transparent'}"
                style="background-color: {color};"
                on:click={() => note.color = color}
              ></button>
            {/each}
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            on:click={() => isOpen = false}
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
          >
            {editingNote ? 'Update' : 'Save'} Note
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Add these styles to your global CSS or keep them scoped */
  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }
  .form-input {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
  }
  .btn {
    @apply px-4 py-2 text-sm font-medium rounded-md;
  }
  .btn-secondary {
    @apply text-gray-700 bg-gray-100 hover:bg-gray-200;
  }
  .btn-primary {
    @apply text-white bg-blue-500 hover:bg-blue-600;
  }
</style>