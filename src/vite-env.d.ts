/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_AZURE_SUBDOMAIN: string;
  readonly VITE_AZURE_CLIENT_ID: string;
  readonly VITE_AZURE_REDIRECT_URI: string;
  readonly VITE_AZURE_POST_LOGOUT_REDIRECT_URI: string;
  readonly VITE_AZURE_SCOPES: string;
  readonly VITE_IDENTITY_HOST: string;
  readonly VITE_MSAL_ENABLE_GRAPH_FALLBACK: string;
  readonly VITE_SAS_TOKEN: string;
  readonly VITE_STORAGE_ACCOUNT_NAME: string;
  readonly VITE_CONTAINER_NAME: string;
  readonly VITE_AZURE_STORAGE_ACCOUNT_KEY: string;
  readonly VITE_CONNECTION_STRING: string;
  readonly VITE_SUPABASE_URL_KH?: string;
  readonly VITE_SUPABASE_ANON_KEY_KH?: string;
  readonly VITE_SUPABASE_KH_BUCKET_THUMBNAILS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
