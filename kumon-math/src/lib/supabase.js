// Thin Supabase wrapper. The client is loaded lazily (dynamic import) so it is
// only pulled in when a family actually turns on cloud sync — the app stays
// fully functional (local-only) when Supabase isn't configured.

const URL = import.meta.env.VITE_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

let clientPromise = null

// True when the two env vars are present at build time (set in Netlify).
export function isConfigured() {
  return !!(URL && ANON)
}

export function getClient() {
  if (!isConfigured()) throw new Error('Cloud sync is not set up (missing Supabase keys).')
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(URL, ANON, { auth: { persistSession: false } }),
    )
  }
  return clientPromise
}
