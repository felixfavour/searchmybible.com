<template>
  <div class="dark:bg-gray-900">
    <NuxtPwaAssets />
    <NuxtLoadingIndicator />
    <NuxtLayout :app-version="appVersion">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import mitt from "mitt"
import { useAppStore } from "./store/app"

const nuxtApp = useNuxtApp()
const emitter = mitt()
const appStore = useAppStore()
nuxtApp.provide("emitter", emitter)
appStore.setEmitter(emitter)

const appVersion = ref<string>("1.0.0")
</script>

<style>
.text-2xs {
  font-size: 0.7rem;
  line-height: 0.9rem;
}

button:focus-visible {
  /* background: #faf5ff;
  border-radius: 0.375rem; */
  outline: none;
}

/* PAGE AND LAYOUT TRANSITIONS */
.layout-enter-active,
.layout-leave-active {
  transition: all 1s;
  -webkit-transition: all 1s;
  -moz-transition: all 1s;
  -ms-transition: all 1s;
  -o-transition: all 1s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
