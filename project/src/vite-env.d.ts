/// <reference types="vite/client" />

// Runtime environment variables injected via index.html
interface Window {
  __ENV__?: {
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
  };
}
