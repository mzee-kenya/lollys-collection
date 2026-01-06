# Lolly's Collection - Multi-vendor Platform (Scaffold)

This repository contains a minimal scaffold for a Kilimall-style multi-vendor platform using React + Vite + TypeScript + Tailwind CSS.

## Features included
- Vite + React + TypeScript scaffold
- Tailwind CSS with Kilimall orange theme
- Cloudinary unsigned upload service using the Fetch API (`src/services/cloudinaryService.ts`)
- `ImageUploader` component with loading spinner and secure_url preview
- Seller "Add Product" page (`src/pages/Seller/AddProduct.tsx`)
- Zustand stores for session (`src/store/useSessionStore.ts`) and cart (`src/store/useCartStore.ts`)

## Environment
Copy `.env.example` to `.env` and fill in your Cloudinary details:

VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET

## Run
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` (builds into `dist` which is deployed to GitHub Pages)

## Deployment
This repo includes a GitHub Actions workflow that builds and deploys the frontend to GitHub Pages on every push to `main`.

**Expected site URL:** https://mzee-kenya.github.io/lollys-collection/  (the workflow will publish the built `dist` directory to GitHub Pages)

If you want the signing server deployed as well, I can help deploy it to Render/Vercel/Heroku and add secrets to this repo.

## Notes
- The Cloudinary service uses unsigned uploads (upload preset must be configured in your Cloudinary dashboard).
- This is a scaffold focused on the upload flow and example seller page; extend as needed.

## Testing the Upload Flow ✅
1. Fill `.env` with your `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.
2. Run `npm install` then `npm run dev`.
3. Visit `http://localhost:5173/seller/add-product`.
4. Use the "Product Image" uploader to pick an image; you should see an "Uploading..." spinner and then a preview + `secure_url` when the upload succeeds.

If the upload fails, check the console for Cloudinary error details and confirm your preset is set to unsigned.

### Optional: Signed uploads (secure)
You can optionally use *signed* uploads to avoid using unsigned presets. To do this safely:

1. Run the signing server in `/server` which reads your server-side `CLOUDINARY_URL` environment variable (format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`).
2. Set `VITE_USE_SIGNED_UPLOADS=true` and `VITE_CLOUDINARY_SIGN_URL` to point to your signing endpoint (e.g., `http://localhost:4000/api/sign`).
3. The client requests a signature from the signing server and then performs a signed upload to Cloudinary using the returned `api_key`, `timestamp`, and `signature`.

Security note: **Never** commit your `CLOUDINARY_URL`, API key, or API secret to your repository. Use environment variables in your deployment platform instead.

Server instructions are in `/server/README.md`.