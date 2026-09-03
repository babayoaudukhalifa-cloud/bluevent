# Blumen Technologies — Event Planner

Staff Care Platform. Cards sent to staff always include:

1. Blumen logo  
2. CEO photo (Dr. Yunusa Garba Muhammed)  
3. Then the message  

## Stack

- **App:** Vite + React  
- **Database / Auth:** Supabase (Postgres)  
- **Hosting / email function:** Netlify  

Until Supabase keys are added, the app runs as a **local demo** in the browser.

## 1. Create the Supabase project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a project named `blumen-event-planner`.
2. SQL Editor → paste and run `supabase/schema.sql`.
3. Authentication → Users → Add user (email + password) for the CEO or HR manager. A `profiles` row is created automatically.
4. Authentication → Providers → Email: turn on Email signups if you will add more managers.

Copy **Project URL** and **anon public** key from Settings → API.

## 2. Put the keys in the app

Create `.env.local` from `.env.example`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Also paste the same values into `public/supabase-config.js`.

Restart `npm run dev`. The top bar should show **LIVE · SUPABASE**.

## 3. Host on Netlify

1. Push this folder to GitHub (or drag-drop the folder in Netlify).
2. Build command: `npm run build`  
   Publish directory: `dist`
3. Site settings → Environment variables:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
RESEND_API_KEY=
SMTP_FROM=Blumen Technologies <office@blumentechnologies.com>
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

4. In Supabase → Authentication → URL configuration, add the Netlify URL to Redirect URLs.

Without SMTP, Send Card still records history and opens Email/WhatsApp. With SMTP, the Netlify function sends the branded HTML email (logo + CEO photo + message).

## Local run

```bash
cd blumen-event-planner
npm install
npm run dev
```

Open http://localhost:5173
