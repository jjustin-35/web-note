<script lang="ts">
  import { IconType } from '../types';
  
  export let type: IconType;
  export let size: number = 16;
  export let stroke: string = 'currentColor';
  export let strokeWidth: number = 2;

  const icons = {
    [IconType.EDIT]: {
      viewBox: '0 0 24 24',
      paths: [
        'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
        'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
      ]
    },
    [IconType.DELETE]: {
      viewBox: '0 0 24 24',
      paths: [
        'M3 6 5 6 21 6',
        'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
      ]
    }
  };

  $: icon = icons[type];
</script>

<svg
  width={size}
  height={size}
  viewBox={icon.viewBox}
  fill="none"
  {stroke}
  stroke-width={strokeWidth}
>
  {#each icon.paths as path}
    <path d={path}></path>
  {/each}
</svg>

<style>
  svg {
    display: inline-block;
    vertical-align: middle;
  }
</style>
