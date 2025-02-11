import { defineStore } from 'pinia'
import type { Alert, AppSettings, BackgroundVideo, Schedule, Slide, SlideStyle } from '~/types/index'
import type { Emitter } from 'mitt'
import { bibleVersionObjects } from '~/utils/constants';
import { useThrottleFn } from '@vueuse/core';
import posthog from 'posthog-js'

// console.log(usePinia())
function ensureUniqueIds(arr: Slide[]): Slide[] {
  const seenIds = new Set();
  return arr.filter(obj => {
    if (seenIds.has(obj.id)) {
      return false;
    } else {
      seenIds.add(obj.id);
      return true;
    }
  });
}

/**
 * This function is used to throttle the amount of times the app state is updated
 * in relation to the past states (undo/redo stack)
 * The key/value approach for updating is used to ensure reactivity of the app state
 * @param pastStates
 * @param currentState
 * @param key
 * @param value
 */
const onAppStateChange = useThrottleFn((pastStates: [], currentState: any, key: string, value: any) => {
  // console.log('added to Stack')
  const tempCurrentState = { ...currentState }
  if (key) {
    tempCurrentState[key] = value
  }
  pastStates.push({ ...tempCurrentState })
}, 1500)

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      currentState: {
        emitter: null,
        settings: {
          defaultBibleVersion: 'KJV',
        },
      },
      // Undo/Redo stacks
      pastStates: [],
      futureStates: [],
    }
  },
  getters: {},
  actions: {
    setEmitter(emitter: Emitter) {
      this.currentState.emitter = emitter
    },
    signOut() {
      posthog.reset()
    },
    setAppSettings(settings: { defaultBibleVersion: string }) {
      this.currentState.settings = settings
    },
    // Undo/Redo Actions
    setCurrentState(state: any) {
      this.currentState = { ...state }
      console.log('updated current state', this.currentState)
    },
    undo() {
      console.log('undo action')
      if (this.pastStates.length) {
        this.futureStates.push(this.currentState)
        this.setCurrentState(this.pastStates.pop())
      }
    },
    redo() {
      console.log('redo action')
      if (this.futureStates.length) {
        this.pastStates.push(this.currentState)
        this.setCurrentState(this.futureStates.pop())
      }
    },
    refreshAppActionsStack() {
      this.pastStates = []
      this.futureStates = []
    }
  },
  share: {
    enable: true,
  }
}) 