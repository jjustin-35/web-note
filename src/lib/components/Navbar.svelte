<script lang="ts">
  import SearchBar from "./SearchBar.svelte";
  import LoginButton from "./LoginButton.svelte";
  import Avatar from "./Avatar.svelte";
  import { page } from "$app/stores";
  import { viewport } from "$lib/stores/viewport";

  export let searchQuery: string;
  export let websiteFilter: string;
</script>

<nav
  class="flex {$viewport.isMobile
    ? 'flex-col'
    : 'flex-row'} items-center justify-between gap-4 mb-8"
>
  <div class="flex items-center justify-between w-full md:w-auto">
    <h1 class="text-2xl font-bold">Note Papers</h1>
    {#if $viewport.isMobile}
      {#if $page.data.session}
        <Avatar />
      {:else}
        <LoginButton />
      {/if}
    {/if}
  </div>
  <div class="flex items-center gap-6">
    {#if !$viewport.isMobile}
      {#if $page.data.session}
        <SearchBar bind:searchQuery bind:websiteFilter />
        <Avatar />
      {:else}
        <LoginButton />
      {/if}
    {/if}
  </div>
</nav>

{#if $viewport.isMobile && $page.data.session}
  <div class="mb-4">
    <SearchBar bind:searchQuery bind:websiteFilter />
  </div>
{/if}
