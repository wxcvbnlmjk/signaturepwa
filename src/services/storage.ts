import { openDB } from 'idb'

type PersistedSignature = {
  id: string
  page: number
  dataUrl: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

type PersistedDocument = {
  name: string
  type: string
  lastModified: number
  data: Blob
}

type PersistedSessionState = {
  document?: PersistedDocument
  signatures: PersistedSignature[]
  activePage: number
  scale: number
  rotation: number
}

const database = openDB('signa-local', 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('preferences')) {
      db.createObjectStore('preferences')
    }

    if (!db.objectStoreNames.contains('session')) {
      db.createObjectStore('session')
    }
  },
})

export async function saveFavoriteSignature(dataUrl: string) {
  const db = await database
  await db.put('preferences', dataUrl, 'favorite-signature')
}

export async function getFavoriteSignature() {
  const db = await database
  return db.get('preferences', 'favorite-signature') as Promise<string | undefined>
}

export async function saveCurrentSessionState(state: PersistedSessionState) {
  const db = await database
  await db.put('session', state, 'current-session')
}

export async function getCurrentSessionState() {
  const db = await database
  return db.get('session', 'current-session') as Promise<PersistedSessionState | undefined>
}

export async function clearCurrentSessionState() {
  const db = await database
  await db.delete('session', 'current-session')
}
