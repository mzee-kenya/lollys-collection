import React, { useRef, useState } from 'react'
import { uploadImageAuto } from '../services/cloudinaryService'
import Spinner from './Spinner'

type Props = {
  onUploadComplete?: (secureUrl: string) => void
}

export default function ImageUploader({ onUploadComplete }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const data = await uploadImageAuto(file)
      setUrl(data.secure_url)
      onUploadComplete?.(data.secure_url)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-md p-4">
      <label className="block mb-2 font-medium">Product Image</label>
      <div className="flex items-center gap-4">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} />
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size={1.25} />
            <span>Uploading...</span>
          </div>
        )}
      </div>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {url && (
        <div className="mt-3">
          <div className="text-sm text-green-700 mb-2">Upload successful</div>
          <img src={url} alt="Uploaded" className="max-w-xs border rounded" />
          <div className="mt-2 text-xs text-gray-600 break-words">{url}</div>
        </div>
      )}
    </div>
  )
}
