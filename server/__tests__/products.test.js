const request = require('supertest')
const fs = require('fs')
const path = require('path')

// Use an in-memory DB for tests
process.env.DB_PATH = ':memory:'
const app = require('../index')
const db = require('../db')

describe('Products ownership', () => {
  beforeEach(() => {
    // Ensure fresh DB schema
    // db.init is private; recreate tables by requiring module which does init on load
  })

  test('create product with seller_id from x-user-id header', async () => {
    const product = { id: 't1', name: 'Test', price: 1000, category: 'test', image: null }
    const res = await request(app).post('/api/products').set('x-user-id', 'sellerA').send(product)
    expect(res.status).toBe(200)

    const list = db.listProducts()
    const p = list.find((x) => x.id === 't1')
    expect(p).toBeDefined()
    expect(p.seller_id).toBe('sellerA')
  })

  test('delete forbidden for non-owner', async () => {
    // create as sellerA
    const product = { id: 't2', name: 'ToDelete', price: 500, category: 'test' }
    await request(app).post('/api/products').set('x-user-id', 'sellerA').send(product)

    // attempt delete as sellerB
    const res = await request(app).delete('/api/products/t2').set('x-user-id', 'sellerB')
    expect(res.status).toBe(403)
  })

  test('delete allowed for owner', async () => {
    // create as sellerC
    const product = { id: 't3', name: 'ToDelete2', price: 700, category: 'test' }
    await request(app).post('/api/products').set('x-user-id', 'sellerC').send(product)

    const res = await request(app).delete('/api/products/t3').set('x-user-id', 'sellerC')
    expect(res.status).toBe(200)

    const list = db.listProducts()
    expect(list.find((x) => x.id === 't3')).toBeUndefined()
  })

  test('put update allowed only for owner', async () => {
    const product = { id: 't4', name: 'ToUpdate', price: 900, category: 'test' }
    await request(app).post('/api/products').set('x-user-id', 'owner1').send(product)

    const resForbidden = await request(app).put('/api/products/t4').set('x-user-id', 'other').send({ price: 1000 })
    expect(resForbidden.status).toBe(403)

    const resOk = await request(app).put('/api/products/t4').set('x-user-id', 'owner1').send({ price: 1000 })
    expect(resOk.status).toBe(200)

    const p = db.getProduct('t4')
    expect(p.price).toBe(1000)
  })
})
