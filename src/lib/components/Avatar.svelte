<script lang="ts">
  import { page } from "$app/stores";
  import { signOut } from "@auth/sveltekit/client";

  let isOpen = false;

  function toggleDropdown() {
    isOpen = !isOpen;
  }
</script>

<div class="flex items-center gap-1">
  <img
    src={$page.data.session?.user?.image}
    alt="User avatar"
    class="w-8 h-8 rounded-full"
  />
  <div class="relative">
    <button
      class="p-1 rounded-full hover:bg-gray-100"
      on:click={toggleDropdown}
      on:blur={() => {
        // 使用 setTimeout 確保點擊下拉選單項目的事件能夠先觸發
        setTimeout(() => {
          isOpen = false;
        }, 200);
      }}
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    {#if isOpen}
      <div
        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10"
        role="menu"
        aria-orientation="vertical"
      >
        <p class="block px-4 py-2 text-sm text-gray-700 font-bold">{$page.data.session?.user?.name}</p>
        <button
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          on:click={() => {
            signOut();
            isOpen = false;
          }}
        >
          登出
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .relative {
    position: relative;
  }

  .absolute {
    position: absolute;
  }
</style>
