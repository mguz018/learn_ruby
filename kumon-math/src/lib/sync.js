// Family cloud-sync using a no-password "sync code". All data for one family
// lives in a single row keyed by a long, unguessable code. Access goes through
// two SECURITY DEFINER RPCs (get_family / save_family) so the code IS the key —
// see supabase/schema.sql. The code is stored on the device only.

import { getClient, isConfigured } from './supabase.js'

export { isConfigured }

const CODE_KEY = 'expo.synccode'
// No I/O/0/1 to avoid confusion when typing.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function normalizeCode(code) {
  return (code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

// Display form: K7QM-2XPN-9RJT
export function formatCode(code) {
  const n = normalizeCode(code)
  return n.match(/.{1,4}/g)?.join('-') || n
}

function genCode() {
  let s = ''
  for (let i = 0; i < 12; i += 1) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  return s
}

export function getStoredCode() {
  try {
    return localStorage.getItem(CODE_KEY) || null
  } catch {
    return null
  }
}
export function setStoredCode(code) {
  try {
    if (code) localStorage.setItem(CODE_KEY, normalizeCode(code))
    else localStorage.removeItem(CODE_KEY)
  } catch {
    /* ignore */
  }
}

// Create a brand-new family from the current local state. Returns the code.
export async function createFamily(state) {
  const code = genCode()
  const client = await getClient()
  const { error } = await client.rpc('save_family', { p_code: code, p_state: state })
  if (error) throw error
  return code
}

// Fetch a family's state by code (or null if not found).
export async function pullFamily(code) {
  const client = await getClient()
  const { data, error } = await client.rpc('get_family', { p_code: normalizeCode(code) })
  if (error) throw error
  return data || null
}

// Save the current state to the family's row (last write wins).
export async function pushFamily(code, state) {
  const client = await getClient()
  const { error } = await client.rpc('save_family', { p_code: normalizeCode(code), p_state: state })
  if (error) throw error
}
