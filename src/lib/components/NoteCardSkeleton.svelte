<script>
  import Skeleton from './Skeleton.svelte';
</script>

<div class="bg-white rounded-lg shadow-md p-4 space-y-4">
  <!-- Title skeleton -->
  <Skeleton className="h-6 w-3/4" />
  
  <!-- Content skeleton -->
  <div class="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/6" />
  </div>
  
  <!-- Footer skeleton -->
  <div class="flex justify-between items-center pt-4">
    <Skeleton className="h-4 w-24" />
    <div class="flex gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
</div>
