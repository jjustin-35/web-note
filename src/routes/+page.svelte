<script lang="ts">
  import { onMount } from 'svelte';
  import type { Note } from '$lib/types';
  import { getNotes, postNote, putNote, deleteNote } from '$lib/apis/notes';
  import NoteCard from '$lib/components/NoteCard.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import NoteForm from '$lib/components/NoteForm.svelte';
  import NoteCardSkeleton from '$lib/components/NoteCardSkeleton.svelte';
  import { page } from '$app/stores';
  import { debounce } from '$lib/helpers/debounce';
  import { fade } from 'svelte/transition';

  let notes: Note[] = [];
  let searchQuery = '';
  let websiteFilter = '';
  let isNoteFormOpen = false;
  let editingNote: Note | null = null;
  let isLoading = true;
  let mounted = false;

  $: isAuthenticated = !!$page.data.session;

  onMount(() => {
    mounted = true;
    fetchNotes();
  });

  async function fetchNotes() {
    if (!isAuthenticated) return;
    
    try {
      isLoading = true;
      const newNotes = await getNotes({
        search: searchQuery,
        website: websiteFilter
      });
      // 添加小延遲以確保動畫順暢
      await new Promise(resolve => setTimeout(resolve, 300));
      notes = newNotes;
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      isLoading = false;
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

  $: {
    searchQuery; // reactive dependency
    websiteFilter; // reactive dependency
    handleSearch();
  }
</script>

<div class="w-full min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
  <Navbar bind:searchQuery bind:websiteFilter />

  {#if isAuthenticated}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {#if mounted}
        {#if isLoading}
          {#each Array(6) as _, i (i)}
            <div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
              <NoteCardSkeleton />
            </div>
          {/each}
        {:else}
          {#each notes as note (note.id)}
            <div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
              <NoteCard 
                {note}
                on:edit={handleEditNote}
                on:delete={handleDeleteNote}
              />
            </div>
          {/each}
        {/if}
      {/if}
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
  {:else}
    <div class="text-center py-12 flex flex-col items-center">
      <h2 class="text-2xl font-semibold mb-4">歡迎使用 Web Notes</h2>
      <p class="text-gray-600 mb-8">請登入以開始使用筆記功能</p>
    </div>
  {/if}

  <NoteForm 
    bind:isOpen={isNoteFormOpen}
    bind:editingNote
    on:save={handleSaveNote}
    on:update={handleUpdateNote}
  />
</div>