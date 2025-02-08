<script lang="ts">
  import type { NoteData } from '../types';
  import Tailwind from './Tailwind.svelte';
  
  export let notes: NoteData[] = [];

  async function loadNotes() {
    try {
      const response = await fetch('http://localhost:5173/api/notes');
      const data = await response.json();
      notes = data;
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }

  async function handleAdd() {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    // Send message to content script to create a note
    chrome.tabs.sendMessage(tab.id, { 
      type: 'CREATE_NOTE',
      data: {
        title: 'New Note',
        content: '',
        website: tab.url || '',
        color: 'yellow',
        position: { x: 100, y: 100 }
      }
    });
  }

  function handleSelect(note: NoteData) {
    // Send message to content script to focus the note
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'FOCUS_NOTE', 
          noteId: note.id 
        });
      }
    });
  }

  // Load notes when component mounts
  loadNotes();
</script>

<Tailwind />
<div class="w-full min-h-screen bg-slate-50">
  <nav class="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center">
    <h1 class="text-2xl font-bold">Note Papers</h1>
    <div class="flex gap-2">
      <a 
        href="http://localhost:5173" 
        target="_blank" 
        class="p-2 text-gray-500 hover:text-gray-700"
        aria-label="Open dashboard in new tab"
      >
        <span class="material-symbols-outlined">dashboard</span>
      </a>
      <button 
        class="p-2 text-gray-500 hover:text-gray-700" 
        on:click={handleAdd}
        aria-label="Add new note"
      >
        <span class="material-symbols-outlined">add</span>
      </button>
    </div>
  </nav>

  <div class="p-4">
    {#if notes.length === 0}
      <div class="flex flex-col items-center justify-center gap-4 mt-8 text-gray-500">
        <span class="material-symbols-outlined text-4xl">note_add</span>
        <p>No notes yet</p>
        <button 
          on:click={handleAdd}
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
        >
          Create your first note
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-4">
        {#each notes as note}
          <div 
            role="button"
            tabindex="0"
            class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer"
            on:click={() => handleSelect(note)}
            on:keydown={(e) => e.key === 'Enter' && handleSelect(note)}
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="font-semibold truncate">{note.title || 'Untitled Note'}</h3>
            </div>
            <p class="text-gray-600 text-sm line-clamp-3">{note.content || 'No content'}</p>
            <div class="flex flex-wrap gap-2 mt-4">
              <span class="px-2 py-1 rounded text-xs {note.color === 'yellow' ? 'bg-yellow-100' : note.color === 'pink' ? 'bg-pink-100' : 'bg-blue-100'}">{note.color}</span>
              <span class="px-2 py-1 rounded text-xs bg-blue-100">Website: {note.website}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
