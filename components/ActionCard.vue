<template>
  <a
    :href="`https://bible.com/bible/${bibleVersionCode}/${action?.name
      ?.replaceAll(' ', '')
      ?.substring(0, 3)}.${action?.bibleChapterAndVerse?.replace(/:/g, '.')}`"
    target="_blank"
    rel="noopener noreferrer"
    class="action-card flex gap-3 p-2 py-4 border-t first:border-t-0 border-gray-100 dark:border-primary-950 hover:rounded-md hover:bg-primary-50 dark:hover:bg-primary-800 transition-all cursor-pointer text-left w-[100%]"
    :class="{ 'pointer-events-none opacity-30': action?.unreleased }"
    @click="
      useGlobalEmit(
        `${action?.action}${actionSuffix ? `-${actionSuffix}` : ''}`,
        emitParameter
      )
    "
  >
    <IconWrapper
      :name="action?.icon"
      class="mt-1 text-primary dark:text-primary-300"
      rounded-bg
    />
    <div class="texts">
      <h4 v-if="action?.searchableOnly">
        <span class="font-light italic pr-1 capitalize">
          {{ action?.type || "Action" }}:
        </span>
        <span class="font-semibold">
          {{ action?.name || "" }}
          {{ action?.bibleChapterAndVerse || "" }}
        </span>
      </h4>
      <h4 v-else class="font-semibold">
        {{ action?.name || "" }}
      </h4>
      <p class="font-light text-xs mt-1">{{ action?.desc || "" }}</p>
    </div>
  </a>
</template>
<script setup lang="ts">
import { computed } from "vue"
import type { QuickAction } from "~/types"
import useGlobalEmit from "../composables/useGlobalEmit"

const bibleVersion = ref<string>("NKJV")
const bibleVersionCode = ref<string>("114")

const props = defineProps<{
  action: QuickAction
  actionSuffix: String
}>()

const emitParameter = computed(() => {
  return props.action?.bibleChapterAndVerse
    ? `${props.action?.bibleBookIndex}:${props.action?.bibleChapterAndVerse}`
    : ""
})
</script>

<style scoped></style>
