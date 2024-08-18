import type * as monaco from 'monaco-editor'

export interface EditorConfig {
  options: monaco.editor.IStandaloneEditorConstructionOptions
  theme: string
  language: string
}
