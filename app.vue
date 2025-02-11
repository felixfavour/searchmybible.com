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
import useDetailedFetch from "./composables/useDetailedFetch"
import useIndexedDB from "./composables/useIndexedDB"
import { useAppStore } from "./store/app"

const nuxtApp = useNuxtApp()
const emitter = mitt()
const appStore = useAppStore()
nuxtApp.provide("emitter", emitter)
appStore.setEmitter(emitter)

const appVersion = ref<string>("1.0.0")
const loadingResources = ref<boolean>(true)
const downloadResource = ref<string>("")
const downloadStep = ref<number>(0)
const downloadProgress = ref()

const tempBibleVersion = (version: string, data: any) => ({
  id: version,
  data,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const downloadEssentialResources = async () => {
  const db = useIndexedDB()
  loadingResources.value = true

  // DOWNLOAD KJV
  let tempBible = await db.bibleAndHymns.get("KJV")
  if (!tempBible) {
    downloadResource.value = "KJV Bible"
    downloadStep.value = 3

    let kjvBible = await useDetailedFetch(
      `https://d37gopmfkl2m2z.cloudfront.net/open/bible-versions/kjv.json`,
      downloadProgress
    )
    kjvBible = await kjvBible.json()
    db.bibleAndHymns.add(tempBibleVersion("KJV", kjvBible))
  }

  loadingResources.value = false
}

downloadEssentialResources()
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
