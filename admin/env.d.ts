/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STAGE: 'dev' | 'test' | 'prod'
}

declare global {
  interface Window {
    __APP_VERSION__: string
  }
}
