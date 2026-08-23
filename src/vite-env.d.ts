/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UMAMI_WEBSITE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Cypress?: unknown;
  umami?: {
    track: (eventName: string, data?: Record<string, unknown>) => void;
  };
}
