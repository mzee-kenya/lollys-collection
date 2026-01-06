/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string
  readonly VITE_CLOUDINARY_SIGN_URL?: string
  readonly VITE_USE_SIGNED_UPLOADS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
