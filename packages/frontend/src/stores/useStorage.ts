import { shallowRef } from 'vue'
import { defineStore } from 'pinia'
import localforage from 'localforage'

export const useStorageStore = defineStore('storage', () => {
  const editorDB = shallowRef(
    localforage.createInstance({
      name: 'editor'
    })
  )

  return { editorDB }
})
