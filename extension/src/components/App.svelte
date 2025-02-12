<script lang="ts">
  import { onMount } from 'svelte';
  import Note from './Note.svelte';
  import { MessageType, type NoteData } from '../types';
  import { getNotes, postNote, putNote, deleteNote } from '../apis/notes';

  let notes: NoteData[] = [];

  onMount(() => {
    (async () => {
    try {
      notes = await getNotes();
    } catch (error) {
      console.error('Failed to load notes:', error);
    }})()

    const messageListener = (message: any, _: any, sendResponse: (response: any) => void) => {
      if (message.type === MessageType.CREATE_NOTE) {
        createNewNote();
      } else if (message.type === MessageType.FOCUS_NOTE) {
        handleNoteSelect({ detail: notes.find((n) => n.id === message.noteId) } as CustomEvent<NoteData>);
      }
      sendResponse({ success: true });
      return true;
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  });

  async function createNewNote() {
    const note: Partial<NoteData> = {
      title: 'New Note',
      content: '',
      website: window.location.href,
      color: 'yellow',
      position: { x: 100, y: 100 }
    };

    try {
      const newNote = await postNote(note);
      notes = [...notes, newNote];
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  }

  async function handleUpdateNote(note: NoteData) {
    try {
      const updatedNote = await putNote(note.id, note);
      notes = notes.map((n) => n.id === updatedNote.id ? updatedNote : n);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      await deleteNote(id);
      notes = notes.filter((n) => n.id !== id);
    } catch (error) {
      console.error('Failed to delete note:', error);
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
</script>

{#each notes as note (note.id)}
  <Note 
    {note}
    on:update={async (event) => handleUpdateNote(event.detail)}
    on:delete={async () => handleDeleteNote(note.id)}
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
