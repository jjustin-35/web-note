<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Color, NoteData } from "../types";
  import { IconType } from "../types";
  import Icon from "./Icon.svelte";

  export let note: NoteData;

  const dispatch = createEventDispatcher<{
    update: NoteData;
    delete: { id: string };
  }>();

  let isEdit = false;
  let dragOffset: { x: number; y: number } | null = null;
  let contentEl: HTMLDivElement;
  let saveTimeout: number | null = null;

  const colors: Color[] = ["yellow", "pink", "blue"];

  function handleDragStart(e: MouseEvent) {
    if (isEdit) return;
    const target = e.target as HTMLElement;

    dragOffset = {
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y,
    };

    target.style.cursor = "grabbing";
  }

  function handleDragMove(e: MouseEvent) {
    if (isEdit) return;
    if (!dragOffset) return;

    note.position = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
  }

  function handleDragEnd(e: MouseEvent) {
    if (isEdit) return;
    if (!dragOffset) return;

    dragOffset = null;
    const target = e.target as HTMLElement;
    target.style.cursor = "move";
    dispatch("update", note);
  }

  function handleContentChange() {
    if (!isEdit) return;
    note.content = contentEl.innerHTML;
    note.title = note.content.split("\n")[0].trim() || "Untitled Note";

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = window.setTimeout(() => {
      dispatch("update", note);
    }, 500);
  }

  function handleColorChange(color: Color) {
    note.color = color;
    dispatch("update", note);
  }

  function handleDelete() {
    dispatch("delete", { id: note.id });
  }
</script>

<div
  class="note {note.color} drag-handle {isEdit ? 'drag-disable' : ''}"
  style="left: {note.position.x}px; top: {note.position.y}px;"
  role="button"
  tabindex="0"
  on:mousedown={handleDragStart}
  on:mousemove={handleDragMove}
  on:mouseup={handleDragEnd}
  aria-label="Draggable note"
>
  <div class="controls">
    <button class="button edit" aria-label="{isEdit ? 'finish' : ''} edit note" on:click={() => isEdit = !isEdit}>
      <Icon type={IconType.EDIT} />
    </button>
    <button
      class="button delete"
      on:click={handleDelete}
      aria-label="Delete note"
    >
      <Icon type={IconType.DELETE} />
    </button>
  </div>

  {#if isEdit}
  <div
    class="content"
    contenteditable="true"
    bind:this={contentEl}
    role="textbox"
    on:input={handleContentChange}
    aria-multiline="true"
  >
    {note.content}
  </div>
  {:else}
  <p class="content">{note.content}</p>
  {/if}

  {#if isEdit}
  <div class="color-picker" role="toolbar" aria-label="Note color options">
    {#each colors as color}
      <button
        class="color-option {color} {color === note.color ? 'selected' : ''}"
        on:click={() => handleColorChange(color)}
        on:keydown={(e) => e.key === "Enter" && handleColorChange(color)}
        aria-label="Set note color to {color}"
        aria-pressed={color === note.color}
      />
    {/each}
  </div>
  {/if}
</div>

<style>
  .note {
    position: absolute;
    width: 200px;
    min-height: 120px;
    padding: 8px 16px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999999;
  }

  .drag-handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 24px;
    cursor: move;
  }

  .drag-disable {
    cursor: unset;
  }

  .note.yellow {
    background-color: #fff9c4;
  }
  .note.pink {
    background-color: #f8bbd0;
  }
  .note.blue {
    background-color: #bbdefb;
  }

  .controls {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .note:hover .controls {
    opacity: 1;
  }

  .button {
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    border-radius: 4px;
  }

  .button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .content {
    margin-top: 8px;
    outline: none;
  }

  .color-picker {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .note:hover .color-picker {
    opacity: 1;
  }

  .color-option {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    padding: 0;
    background: none;
  }

  .color-option.selected {
    border-color: rgba(0, 0, 0, 0.3);
  }

  .color-option.yellow {
    background-color: #fff9c4;
  }
  .color-option.pink {
    background-color: #f8bbd0;
  }
  .color-option.blue {
    background-color: #bbdefb;
  }
</style>
