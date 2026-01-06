import React from 'react'

export default function Spinner({ size = 6 }: { size?: number }) {
  const s = `${size}rem`
  return (
    <svg
      className="animate-spin text-kilimall"
      style={{ width: s, height: s }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
