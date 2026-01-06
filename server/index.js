require('dotenv').config()
const express = require('express')
const cors = require('cors')
const crypto = require('crypto')

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

const CLOUDINARY_URL = process.env.CLOUDINARY_URL
let api_key, api_secret, cloud_name
if (CLOUDINARY_URL) {
  const m = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/.exec(CLOUDINARY_URL)
  if (m) {
    api_key = m[1]
    api_secret = m[2]
    cloud_name = m[3]
  } else {
    console.warn('CLOUDINARY_URL is invalid. Expected format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME')
  }
} else {
  console.warn('CLOUDINARY_URL not set. Set it in .env before using signed uploads.')
}

app.post('/api/sign', (req, res) => {
  if (!api_secret || !api_key || !cloud_name) return res.status(500).json({ error: 'Cloudinary credentials not configured on server' })

  const params = req.body.params || {}
  const timestamp = Math.floor(Date.now() / 1000)
  const toSign = { ...params, timestamp }
  const str = Object.keys(toSign).sort().map(k => `${k}=${toSign[k]}`).join('&')
  const signature = crypto.createHash('sha1').update(str + api_secret).digest('hex')
  res.json({ signature, timestamp, api_key, cloud_name })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Cloudinary signing server listening on port ${port}`))
