# Sam Henry · Content Engine


Your personal content extraction tool. Paste an essay, get LinkedIn posts, Substack Notes, carousel copy, and short posts — all in your voice.

---

## Deploy to Vercel (3 steps)

### Step 1 — Push to GitHub
1. Create a new repo on GitHub (name it `content-engine` or whatever you like)
2. Upload all these files to it (drag and drop works fine on GitHub)

### Step 2 — Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and log in
2. Click **Add New → Project**
3. Import your GitHub repo
4. Vercel will auto-detect the settings (they match `vercel.json`)
5. Click **Deploy** — but don't open it yet

### Step 3 — Add your API key
1. In your Vercel project, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (starts with `sk-ant-...`)
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** (so the key takes effect)

That's it. Your app is live at `your-project-name.vercel.app`

---

## Adding a new essay

Open `src/App.jsx` and find the `ESSAYS` array near the top. You can:
- Add another preset essay (copy the Auntie Bemi pattern)
- Or just use the "Paste your essay" option in the app — no code needed

---

## Project structure

```
content-engine/
├── api/
│   └── generate.js       ← Secure serverless function (API key lives here)
├── src/
│   ├── App.jsx            ← Main app
│   ├── main.jsx           ← Entry point
│   └── index.html         ← HTML shell
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## Security

Your Anthropic API key is stored in Vercel's environment variables — never in the frontend code. The browser calls `/api/generate`, which is a serverless function on Vercel's servers. The key is never visible to anyone viewing the page.
