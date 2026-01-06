export type CloudinaryUploadResponse = {
  asset_id: string
  public_id: string
  version: number
  version_id?: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag?: string
  placeholder?: boolean
  url?: string
  secure_url: string
  original_filename?: string
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
const SIGN_URL = import.meta.env.VITE_CLOUDINARY_SIGN_URL as string
const USE_SIGNED = import.meta.env.VITE_USE_SIGNED_UPLOADS === 'true'

if (!CLOUD_NAME && !USE_SIGNED) {
  console.warn('VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET is not set. Cloudinary unsigned uploads will fail until these are provided in .env')
}

if (USE_SIGNED && !SIGN_URL) {
  console.warn('VITE_USE_SIGNED_UPLOADS is true but VITE_CLOUDINARY_SIGN_URL is not set. Signed uploads will fail.')
}

export async function uploadImage(file: File): Promise<CloudinaryUploadResponse> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Cloudinary env vars not set')

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(url, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary upload failed: ${res.status} - ${text}`)
  }

  const data = (await res.json()) as CloudinaryUploadResponse
  return data
}

// Signed uploads support (requires a server-side signing endpoint)
export async function getSignature(): Promise<{ signature: string; timestamp: number; api_key: string; cloud_name: string }> {
  if (!SIGN_URL) throw new Error('Signing URL not configured')
  const res = await fetch(SIGN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ params: {} }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Signing request failed: ${res.status} - ${text}`)
  }
  return (await res.json()) as { signature: string; timestamp: number; api_key: string; cloud_name: string }
}

export async function uploadImageSigned(file: File): Promise<CloudinaryUploadResponse> {
  const sig = await getSignature()
  const url = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', sig.api_key)
  form.append('timestamp', `${sig.timestamp}`)
  form.append('signature', sig.signature)

  const res = await fetch(url, { method: 'POST', body: form })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary signed upload failed: ${res.status} - ${text}`)
  }
  return (await res.json()) as CloudinaryUploadResponse
}

export async function uploadImageAuto(file: File) {
  if (USE_SIGNED) return uploadImageSigned(file)
  return uploadImage(file)
}