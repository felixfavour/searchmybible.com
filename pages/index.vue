<template #default="{ defaultProps }">
  <div class="flex mt-4 gap-2 px-4">
    <SearchBibleList />
  </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: "manifest",
      href: "/manifest.json",
    },
  ],
})
</script>
