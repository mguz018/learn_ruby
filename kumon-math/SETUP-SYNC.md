# Turning on cloud sync (step by step)

This makes each family's progress sync across devices and back up to the cloud.
It's free. You'll do this once. Kids never log in — a parent sets it up, and the
app uses a **family sync code** to share data between devices.

The app works fine **without** this — it just stays on one device until you do it.

---

## Part A — Create the free database (Supabase) · ~5 min

1. Go to **https://supabase.com** and click **Start your project** → sign in with
   GitHub or email (free).
2. Click **New project**. Give it a name (e.g. `exponential-go`), pick a database
   password (save it somewhere), choose a region near you, and create it. Wait
   ~1 minute for it to finish setting up.
3. In the left sidebar open **SQL Editor** → **New query**.
4. Open the file **`supabase/schema.sql`** from this project, copy **all** of it,
   paste it into the editor, and click **Run**. You should see "Success".
5. In the sidebar open **Settings → API**. Copy these two values (keep this tab
   open):
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

> The `anon` key is safe to ship in a web app — the database is locked down so it
> can only be reached with a family's sync code.

---

## Part B — Deploy from GitHub with the keys (Netlify) · ~5 min

This also upgrades you from drag-and-drop to automatic deploys.

1. Go to **https://app.netlify.com** → **Add new site → Import an existing
   project → GitHub**, and pick the repo **`mguz018/learn_ruby`**.
2. When it asks for build settings, enter:
   - **Base directory:** `kumon-math`
   - **Build command:** `npm run build`
   - **Publish directory:** `kumon-math/dist`
3. Click **Add environment variables** (or do it after, under **Site settings →
   Environment variables**) and add these two, using the values from Part A step 5:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
4. Click **Deploy**. When it finishes you get a `*.netlify.app` link.

> If you already have a Netlify site connected to this repo, just add the two
> environment variables (step 3) and trigger a redeploy (**Deploys → Trigger
> deploy → Deploy site**).

---

## Part C — Turn on sync in the app · ~1 min

1. Open the site, go to **⚙︎ Grown-ups** (PIN **1234**) → **Backup** tab.
2. Under **☁️ Sync across devices**, tap **Turn on sync**. The app shows a
   **family code** like `K7QM-2XPN-9RJT`. Write it down.
3. On any other device (another iPad, a laptop), open the same site → Grown-ups →
   Backup → paste the code into **"Already have a family code?"** → **Connect**.
   That device now shares the same progress, and changes sync both ways.

That's it. From now on, progress is saved to the cloud automatically and follows
your family across devices.

---

### Notes
- **Lost the code?** As long as one device still has sync on, open its Backup tab
  to see the code again. (Keep a copy somewhere safe — with sync codes there's no
  password reset.)
- **Cost:** Supabase's free tier is far more than a family app needs.
- **Privacy:** data lives only in your own Supabase project. You can delete it any
  time from the Supabase dashboard.
- **Offline:** the app keeps working with no internet and syncs next time it's
  online.
