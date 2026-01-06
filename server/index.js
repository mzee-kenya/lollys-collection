require('dotenv').config({ path: __dirname + '/.env' })
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

// Cloudinary SDK integration for server-side operations
const cloudinary = require('cloudinary').v2
if (CLOUDINARY_URL) {
  cloudinary.config({ url: CLOUDINARY_URL })
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

// Upload test endpoint - uploads a remote image to your Cloudinary account using server credentials
const db = require('./db')

app.post('/api/upload-test', async (req, res) => {
  const { imageUrl } = req.body || {}
  const toUpload = imageUrl || 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg'
  try {
    const result = await cloudinary.uploader.upload(toUpload, { public_id: `test_${Date.now()}` })
    return res.json({ ok: true, result })
  } catch (err) {
    console.error('Upload test failed', err)
    return res.status(500).json({ ok: false, error: err.message || String(err) })
  }
})

// Products API
app.get('/api/products', (req, res) => {
  try {
    const products = db.listProducts(100)
    res.json({ ok: true, products })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProduct(req.params.id)
    if (!product) return res.status(404).json({ ok: false, error: 'Not found' })
    res.json({ ok: true, product })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

app.post('/api/products', (req, res) => {
  try {
    const { id, name, price, category, image, description } = req.body
    const userId = req.header('x-user-id') || null
    if (!id || !name || !price) return res.status(400).json({ ok: false, error: 'Missing fields' })
    db.createProduct({ id, name, price, category, image, description, seller_id: userId })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

// Update product (only owner)
app.put('/api/products/:id', (req, res) => {
  try {
    const userId = req.header('x-user-id')
    const product = db.getProduct(req.params.id)
    if (!product) return res.status(404).json({ ok: false, error: 'Not found' })
    if (product.seller_id && product.seller_id !== userId) return res.status(403).json({ ok: false, error: 'Forbidden' })
    const { name, price, category, image, description } = req.body
    db.updateProduct(req.params.id, { name, price, category, image, description })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

app.delete('/api/products/:id', (req, res) => {
  try {
    const userId = req.header('x-user-id')
    const product = db.getProduct(req.params.id)
    if (!product) return res.status(404).json({ ok: false, error: 'Not found' })
    if (product.seller_id && product.seller_id !== userId) return res.status(403).json({ ok: false, error: 'Forbidden' })
    db.deleteProduct(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

// Orders API
app.post('/api/orders', (req, res) => {
  try {
    const { id, items, total, customer_info } = req.body
    if (!id || !items || !total) return res.status(400).json({ ok: false, error: 'Missing fields' })
    db.createOrder({ id, items, total, customer_info, status: 'pending' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

app.get('/api/orders', (req, res) => {
  try {
    const orders = db.listOrders(100)
    res.json({ ok: true, orders })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

const port = process.env.PORT || 4000
if (require.main === module) {
  app.listen(port, () => console.log(`Cloudinary signing server listening on port ${port}`))
}

module.exports = app
