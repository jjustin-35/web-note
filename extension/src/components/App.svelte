<script lang="ts">
  import { onMount } from 'svelte';
  import Note from './Note.svelte';
  import Sidebar from './Sidebar.svelte';
  import type { NoteData } from '../types';

  let notes: NoteData[] = [];
  let sidebarVisible = false;
  let toggleButton: HTMLButtonElement;

  const API_URL = 'http://localhost:3000/api';

  onMount(async () => {
    await loadNotes();
    createToggleButton();
  });

  async function loadNotes() {
    try {
      const response = await fetch(`${API_URL}/notes?website=${window.location.href}`);
      if (!response.ok) throw new Error('Failed to load notes');
      notes = await response.json();
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  async function createNote() {
    const newNote: NoteData = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: 'Click to edit',
      color: 'yellow',
      position: { x: 100, y: 100 },
      website: window.location.href,
      tags: [],
    };

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) throw new Error('Failed to create note');
      const savedNote = await response.json();
      notes = [...notes, savedNote];
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  async function updateNote(note: NoteData) {
    try {
      const response = await fetch(`${API_URL}/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });

      if (!response.ok) throw new Error('Failed to update note');
      const updatedNote = await response.json();
      notes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  async function deleteNote({ detail: { id } }: CustomEvent<{ id: string }>) {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');
      notes = notes.filter(n => n.id !== id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  function createToggleButton() {
    toggleButton = document.createElement('button');
    toggleButton.className = 'web-note-toggle';
    toggleButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    toggleButton.onclick = () => sidebarVisible = !sidebarVisible;
    document.body.appendChild(toggleButton);
  }

  function handleNoteSelect(event: CustomEvent<NoteData>) {
    const note = event.detail;
    const element = document.querySelector(`[data-note-id="${note.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
</script>

{#each notes as note (note.id)}
  <Note 
    {note}
    on:update={({ detail }) => updateNote(detail)}
    on:delete={deleteNote}
  />
{/each}

<Sidebar
  {notes}
  bind:visible={sidebarVisible}
  on:add={createNote}
  on:select={handleNoteSelect}
/>

<style>
  :global(.web-note-toggle) {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: white;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 999998;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: transform 0.2s;
  }

  :global(.web-note-toggle:hover) {
    transform: scale(1.1);
  }
</style>
