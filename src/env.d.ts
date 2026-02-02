/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_ADSENSE_SUPPORT_SLOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    googlefc?: {
      showRevocationMessage?: () => void;
      getGoogleConsentModeValues?: () => unknown;
      ConsentModePurposeStatusEnum?: Record<string, number>;
      callbackQueue?: unknown[];
    };
    adsbygoogle?: unknown[];
  }
}

export {};
