<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { NoteData } from '../types';

  export let notes: NoteData[] = [];
  export let visible = false;

  const dispatch = createEventDispatcher<{
    add: void;
    select: NoteData;
  }>();

  function handleAdd() {
    dispatch('add');
  }

  function handleSelect(note: NoteData) {
    dispatch('select', note);
  }
</script>

<div class="sidebar" class:visible role="complementary" aria-label="Notes sidebar">
  <div class="header">
    <h2>Web Notes</h2>
    <button class="add-button" on:click={handleAdd} aria-label="Add new note">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>

  <div class="notes-list" role="list" aria-label="List of notes">
    {#if notes.length === 0}
      <div class="empty-state">
        No notes yet. Click the + button to create one.
      </div>
    {:else}
      {#each notes as note}
        <div role="listitem">
          <button 
            class="note-item {note.color}"
            on:click={() => handleSelect(note)}
            on:keydown={(e) => e.key === 'Enter' && handleSelect(note)}
            aria-label="Note: {note.title}"
          >
            <div class="note-title">{note.title}</div>
            <div class="note-content">{note.content}</div>
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .sidebar {
    position: fixed;
    top: 0;
    right: -320px;
    width: 320px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 999999;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .sidebar.visible {
    right: 0;
  }

  .header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }

  .add-button {
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    border-radius: 4px;
  }

  .add-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .notes-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .empty-state {
    text-align: center;
    color: #666;
    margin-top: 32px;
  }

  .note-item {
    width: 100%;
    text-align: left;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: transform 0.2s;
    border: none;
    background: none;
  }

  .note-item:hover {
    transform: translateX(-4px);
  }

  .note-item.yellow { background-color: #fff9c4; }
  .note-item.pink { background-color: #f8bbd0; }
  .note-item.blue { background-color: #bbdefb; }

  .note-title {
    font-weight: bold;
    margin-bottom: 4px;
    color: #333;
  }

  .note-content {
    font-size: 14px;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
