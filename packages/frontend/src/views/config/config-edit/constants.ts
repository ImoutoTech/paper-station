import type { EditorConfig } from '@/types'
import { array2options } from '@/utils'

export const LANGUAGES = ['json', 'yaml']

export const LANGUAGE_OPTIONS = array2options(LANGUAGES, String)

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  options: {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    folding: true,
    fontSize: 14,
    tabSize: 2
  },
  theme: 'vs-dark',
  language: 'json'
}

export const EDITOR_TAB_SIZES = [2, 4]

export const EDITOR_TAB_SIZE_OPTIONS = array2options(EDITOR_TAB_SIZES, Number)

export const EDITOR_FONT_SIZES = [14, 16, 18, 20]

export const EDITOR_FONT_SIZE_OPTIONS = array2options(EDITOR_FONT_SIZES, Number)

export const EDITOR_THEMES = ['vs', 'vs-dark', 'hc-black']

export const EDITOR_THEME_OPTIONS = array2options(EDITOR_THEMES, String)

export const EDITOR_OPTIONS = {
  TAB_SIZE: EDITOR_TAB_SIZE_OPTIONS,
  THEME: EDITOR_THEME_OPTIONS,
  FONT_SIZE: EDITOR_FONT_SIZE_OPTIONS
}
