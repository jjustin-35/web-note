<script lang="ts">
  import { onMount } from 'svelte';
  import Note from './Note.svelte';
  import type { NoteData } from '../types';

  let notes: NoteData[] = [];
  // let sidebarVisible = false;
  // let toggleButton: HTMLButtonElement;

  const API_URL = 'http://localhost:5173/api';

  onMount(async () => {
    await loadNotes();
  });

  async function loadNotes() {
    try {
      const response = await fetch(`${API_URL}/notes`);
      const data = await response.json();
      notes = data;
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }

  async function createNote() {
    const note: Partial<NoteData> = {
      title: 'New Note',
      content: '',
      website: window.location.href,
      color: 'yellow',
      position: { x: 100, y: 100 }
    };

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      const newNote = await response.json();
      notes = [...notes, newNote];
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  }

  function handleNoteSelect(event: CustomEvent<NoteData>) {
    const note = event.detail;
    if (!note) return;
    const element = document.querySelector(`[data-note-id="${note.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Listen for messages from the sidebar
  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === 'CREATE_NOTE') {
      createNote();
    } else if (message.type === 'FOCUS_NOTE') {
      handleNoteSelect({ detail: notes.find(n => n.id === message.noteId) } as CustomEvent<NoteData>);
    }
    sendResponse({ success: true });
    return true;
  });
</script>

{#each notes as note (note.id)}
  <Note 
    {note}
    on:update={async (event) => {
      try {
        const response = await fetch(`${API_URL}/notes/${note.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event.detail)
        });
        if (!response.ok) throw new Error('Failed to update note');
        const updatedNote = await response.json();
        notes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
      } catch (error) {
        console.error('Failed to update note:', error);
      }
    }}
    on:delete={async () => {
      try {
        const response = await fetch(`${API_URL}/notes/${note.id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete note');
        notes = notes.filter(n => n.id !== note.id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }}
  />
{/each}

<style>
  :global(.web-note-toggle) {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  :global(.web-note-toggle:hover) {
    background-color: #f5f5f5;
  }

  :global(.web-note-toggle svg) {
    width: 24px;
    height: 24px;
  }
</style>
