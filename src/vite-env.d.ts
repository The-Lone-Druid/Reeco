/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRIDLY_API_KEY: string;
  readonly VITE_GRIDLY_VIEW_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
