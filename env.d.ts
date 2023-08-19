/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SSO: string
  readonly VITE_API: string
  readonly VITE_SSO_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
