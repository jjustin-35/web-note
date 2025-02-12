<script lang="ts">
  import { onMount } from 'svelte';
  import type { Note } from '$lib/types';
  import { getNotes, postNote, putNote, deleteNote } from '$lib/apis/notes';
  import NoteCard from '$lib/components/NoteCard.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import NoteForm from '$lib/components/NoteForm.svelte';
  import { debounce } from '$lib/helpers/debounce';

  let notes: Note[] = [];
  let searchQuery = '';
  let websiteFilter = '';
  let isNoteFormOpen = false;
  let editingNote: Note | null = null;

  async function fetchNotes() {
    try {
      notes = await getNotes({
        search: searchQuery,
        website: websiteFilter
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  async function handleSaveNote(event: CustomEvent<Note>) {
    try {
      await postNote(event.detail);
      await fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  async function handleUpdateNote(event: CustomEvent<{ id: string; note: Partial<Note> }>) {
    try {
      const { note } = event.detail;
      await putNote(note);
      await fetchNotes();
      editingNote = null;
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  async function handleDeleteNote(event: CustomEvent<string>) {
    try {
      await deleteNote(event.detail);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  function handleEditNote(event: CustomEvent<Note>) {
    editingNote = event.detail;
    isNoteFormOpen = true;
  }

  const handleSearch = debounce(fetchNotes, 300);

  onMount(fetchNotes);

  $: {
    searchQuery; // reactive dependency
    websiteFilter; // reactive dependency
    handleSearch();
  }
</script>

<div class="w-full min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
  <nav class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
    <h1 class="text-2xl font-bold">Note Papers</h1>
    <SearchBar 
      bind:searchQuery
      bind:websiteFilter
    />
  </nav>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
    {#each notes as note (note.id)}
      <NoteCard 
        {note}
        on:edit={handleEditNote}
        on:delete={handleDeleteNote}
      />
    {/each}
  </div>

  <div class="fixed bottom-6 right-6 flex justify-end">
    <button 
      on:click={() => {
        editingNote = null;
        isNoteFormOpen = true;
      }}
      class="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all w-14 h-14"
    >
      <span class="material-symbols-outlined">add</span>
    </button>
  </div>

  <NoteForm 
    bind:isOpen={isNoteFormOpen}
    bind:editingNote
    on:save={handleSaveNote}
    on:update={handleUpdateNote}
  />
</div>