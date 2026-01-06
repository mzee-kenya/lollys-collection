const path = require('path')
const fs = require('fs')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.db')

if (process.env.NODE_ENV === 'test') {
  // Simple in-memory store for tests to avoid native sqlite builds
  const products = []
  const orders = []
  module.exports = {
    db: null,
    createProduct: (product) => {
      products.push({ ...product, created_at: Date.now() })
      return true
    },
    getProduct: (id) => products.find((p) => p.id === id),
    listProducts: (limit = 100) => products.slice().sort((a, b) => b.created_at - a.created_at).slice(0, limit),
    deleteProduct: (id) => {
      const idx = products.findIndex((p) => p.id === id)
      if (idx >= 0) products.splice(idx, 1)
      return true
    },
    updateProduct: (id, patch) => {
      const p = products.find((x) => x.id === id)
      if (!p) return
      Object.assign(p, patch)
      return true
    },
    createOrder: (order) => {
      orders.push({ ...order, created_at: Date.now() })
      return true
    },
    listOrders: (limit = 100) => orders.slice().sort((a, b) => b.created_at - a.created_at).slice(0, limit),
  }
} else {
  const init = () => {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const db = new Database(DB_PATH)

    // products table
    db.prepare(
      `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT,
      image TEXT,
      description TEXT,
      seller_id TEXT,
      created_at INTEGER NOT NULL
    )`
    ).run()

    // orders table
    db.prepare(
      `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      customer_info TEXT,
      status TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`
    ).run()

    return db
  }

  const db = init()

  module.exports = {
    db,
    createProduct: (product) => {
      const stmt = db.prepare('INSERT INTO products (id, name, price, category, image, description, seller_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      return stmt.run(product.id, product.name, product.price, product.category || null, product.image || null, product.description || null, product.seller_id || null, Date.now())
    },
    getProduct: (id) => {
      const stmt = db.prepare('SELECT * FROM products WHERE id = ?')
      return stmt.get(id)
    },
    listProducts: (limit = 100) => {
      const stmt = db.prepare('SELECT * FROM products ORDER BY created_at DESC LIMIT ?')
      return stmt.all(limit)
    },
    deleteProduct: (id) => {
      const stmt = db.prepare('DELETE FROM products WHERE id = ?')
      return stmt.run(id)
    },
    updateProduct: (id, patch) => {
      const keys = Object.keys(patch).filter(k => patch[k] !== undefined)
      if (keys.length === 0) return
      const set = keys.map(k => `${k} = ?`).join(', ')
      const stmt = db.prepare(`UPDATE products SET ${set} WHERE id = ?`)
      const values = keys.map(k => patch[k]).concat(id)
      return stmt.run(...values)
    },
    createOrder: (order) => {
      const stmt = db.prepare('INSERT INTO orders (id, items, total, customer_info, status, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      return stmt.run(order.id, JSON.stringify(order.items), order.total, JSON.stringify(order.customer_info || {}), order.status || 'pending', Date.now())
    },
    listOrders: (limit = 100) => {
      const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?')
      return stmt.all(limit).map((r) => ({ ...r, items: JSON.parse(r.items), customer_info: JSON.parse(r.customer_info || '{}') }))
    },
  }
}
