import { openDB } from 'idb'

const database = openDB('signa-local', 1, { upgrade(db) { db.createObjectStore('preferences') } })

export async function saveFavoriteSignature(dataUrl: string) {
  const db = await database
  await db.put('preferences', dataUrl, 'favorite-signature')
}

export async function getFavoriteSignature() {
  const db = await database
  return db.get('preferences', 'favorite-signature') as Promise<string | undefined>
}
