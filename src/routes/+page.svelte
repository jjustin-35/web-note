<script lang="ts">
  import { onMount } from 'svelte';
  import type { Note } from '$lib/types';
  import NoteCard from '$lib/components/NoteCard.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';

  let notes: Note[] = [];
  let filteredNotes: Note[] = [];
  let searchQuery = '';
  let websiteFilter = '';

  onMount(async () => {
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      notes = await response.json();
      filteredNotes = notes;
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  });

  function filterNotes() {
    filteredNotes = notes.filter(note => {
      const matchesSearch = searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWebsite = websiteFilter === '' || 
        note?.website?.toLowerCase().includes(websiteFilter.toLowerCase());
      return matchesSearch && matchesWebsite;
    });
  }

  $: {
    searchQuery;
    websiteFilter;
    filterNotes();
  }
</script>

<div class="w-full min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
  <nav class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <h1 class="text-2xl font-bold">Note Papers</h1>
    <SearchBar 
      bind:searchQuery
      bind:websiteFilter
    />
  </nav>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
    {#each filteredNotes as note (note.id)}
      <NoteCard {note} />
    {/each}
  </div>

  <div class="sticky bottom-6 right-6 flex justify-end">
    <button class="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all">
      <span class="material-symbols-outlined">add</span>
    </button>
  </div>
</div>