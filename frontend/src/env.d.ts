/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // ajoute ici d’autres variables si nécessaire
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
