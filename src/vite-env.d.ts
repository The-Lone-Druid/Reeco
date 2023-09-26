/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_apiUrl: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
