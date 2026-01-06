export async function fetchJSON<T = any>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return (await res.json()) as T
}

export async function getProducts() {
  return fetchJSON<{ ok: boolean; products: any[] }>('/api/products')
}

export async function getProduct(id: string) {
  return fetchJSON<{ ok: boolean; product: any }>(`/api/products/${id}`)
}

export async function createProduct(payload: any, userId?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (userId) headers['x-user-id'] = userId
  return fetchJSON('/api/products', { method: 'POST', headers, body: JSON.stringify(payload) })
}

export async function createOrder(payload: any) {
  return fetchJSON('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
}
