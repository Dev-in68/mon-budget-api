/// <reference types="vite/client" />

declare module '@env' {
  export const VITE_API_URL: string;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
