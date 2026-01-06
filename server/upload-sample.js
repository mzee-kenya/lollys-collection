require('dotenv').config()
const cloudinary = require('cloudinary').v2

if (process.env.CLOUDINARY_URL) cloudinary.config({ url: process.env.CLOUDINARY_URL })

async function run() {
  try {
    console.log('Uploading sample image to Cloudinary...')
    const res = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
      public_id: `sample_${Date.now()}`,
    })
    console.log('Upload result:', res)
    console.log('Secure URL:', res.secure_url)
  } catch (err) {
    console.error('Upload failed', err)
    process.exit(1)
  }
}

run()
