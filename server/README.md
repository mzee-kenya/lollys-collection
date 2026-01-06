# Signing server for Cloudinary (optional)

This small Express server provides a safe way to sign Cloudinary upload requests without exposing your API secret in the browser.

1. Copy `.env.example` → `.env` and fill in `CLOUDINARY_URL` (format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`).
2. Install dependencies: `cd server && npm install`
3. Run in dev: `npm run dev` (uses `nodemon`) or `npm start` to run normally.
4. The server exposes `POST /api/sign` which returns `{ signature, timestamp, api_key, cloud_name }`.

Security notes:
- **Do not** commit `.env` with real secrets to git.
- Keep this server behind your infrastructure (only accessible to your frontend origin via CORS or your backend).

Usage (client):
- POST to the signing endpoint to obtain `signature` and `timestamp`, then include those values with `file`, `api_key`, `timestamp`, and `signature` when POSTing to Cloudinary's `/image/upload` endpoint.
