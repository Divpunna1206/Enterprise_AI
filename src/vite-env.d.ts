
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SUPER_ADMIN_SIGNUP_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
