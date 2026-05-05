# Deployment Guide (Free Tier)

This guide walks you through deploying LangLing for free using **Vercel** (frontend) and **Render** (backend).

---

## Prerequisites

- A [GitHub](https://github.com) account (to push your code)
- A [Vercel](https://vercel.com) account (sign up with GitHub — free)
- A [Render](https://render.com) account (sign up with GitHub — free)
- At least one AI API key (Gemini or Groq)

---

## Step 1: Push Code to GitHub

If you haven't already, push the project to a GitHub repository:

```bash
# From the project root (langling/)
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/langling.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Render (Free Tier)

### 2.1. Go to Render Dashboard

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**

### 2.2. Connect Repository

1. Select **"Build and deploy from a Git repository"**
2. Connect your GitHub account if not connected
3. Select your `langling` repository

### 2.3. Configure the Service

| Setting | Value |
|---------|-------|
| **Name** | `langling-api` |
| **Region** | Choose the closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### 2.4. Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Google AI Studio API key |
| `GROQ_API_KEY` | Your Groq console API key |
| `HF_API_TOKEN` | (optional) Your HuggingFace token |
| `CORS_ORIGINS` | `["https://YOUR_APP.vercel.app"]` |

> **Important:** You'll update `CORS_ORIGINS` after you get your Vercel URL in Step 3.

### 2.5. Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://langling-api.onrender.com`
4. Verify by visiting: `https://langling-api.onrender.com/health`
   - Should return: `{"status": "healthy"}`

> **Note:** Free tier on Render spins down after 15 minutes of inactivity. The first request after sleep takes ~30-60 seconds to wake up.

---

## Step 3: Deploy Frontend on Vercel (Free Tier)

### 3.1. Go to Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**

### 3.2. Import Repository

1. Select your `langling` repository from the list
2. Vercel will auto-detect it as a monorepo

### 3.3. Configure the Project

| Setting | Value |
|---------|-------|
| **Project Name** | `langling` (or whatever you prefer) |
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | Click "Edit" → set to `frontend` |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |

### 3.4. Set Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://langling-api.onrender.com` (your Render URL from Step 2) |
| `NEXT_PUBLIC_SUPABASE_URL` | (optional) Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (optional) Your Supabase anon key |

### 3.5. Deploy

1. Click **"Deploy"**
2. Wait for the build (1-3 minutes)
3. Once done, you'll get a URL like: `https://langling.vercel.app`

### 3.6. Update Backend CORS

Now go back to **Render Dashboard** → your `langling-api` service → **Environment**:

1. Update `CORS_ORIGINS` to: `["https://langling.vercel.app"]`
   - Replace `langling.vercel.app` with your actual Vercel URL
2. Click **"Save Changes"** — the service will redeploy automatically

---

## Step 4: Verify Everything Works

1. Open your Vercel URL (e.g., `https://langling.vercel.app`)
2. Try the Chat Tutor or generate a Quiz
3. If you see an error, check:
   - Backend health: visit `https://langling-api.onrender.com/health`
   - Browser console for CORS errors (update `CORS_ORIGINS` if needed)
   - Render logs for API key issues

---

## Alternative: Deploy Backend on HuggingFace Spaces (Free)

If Render's cold start (30-60s wake-up time) is too slow, you can use HuggingFace Spaces:

### Steps:

1. Go to [https://huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Settings:
   - **Space name:** `langling-api`
   - **SDK:** Docker
   - **Hardware:** Free (CPU basic)
4. Upload your `backend/` folder contents (or connect your GitHub repo)
5. Make sure the `Dockerfile` is in the root of the Space
6. Set Secrets (equivalent to env vars):
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `CORS_ORIGINS` = `["https://langling.vercel.app"]`
7. The Space URL will be: `https://YOUR_USERNAME-langling-api.hf.space`
8. Update your Vercel env `NEXT_PUBLIC_API_URL` to point to this URL

> The existing `Dockerfile` in your project already exposes port 7860 (HuggingFace standard).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error in browser | Update `CORS_ORIGINS` on backend to include your Vercel URL (with `https://`) |
| Backend returns 500 | Check Render logs — likely an API key issue |
| "Failed to fetch" | Backend may be sleeping (free tier). Wait 30-60s and retry |
| Build fails on Vercel | Make sure Root Directory is set to `frontend` |
| Build fails on Render | Make sure Root Directory is set to `backend` |
| Vercel 404 on routes | The `vercel.json` and `next.config.ts` handle this — ensure they're committed |

---

## Cost Summary

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Vercel** (Frontend) | Hobby | Free | 100GB bandwidth/month, serverless |
| **Render** (Backend) | Free | Free | 750 hours/month, sleeps after 15min inactivity |
| **HuggingFace Spaces** (Alt Backend) | Free | Free | CPU basic, always-on option paid |
| **Gemini API** | Free tier | Free | 15 RPM, 1M tokens/day |
| **Groq API** | Free tier | Free | 30 RPM, 14,400 req/day |
| **Supabase** (optional) | Free | Free | 500MB DB, 50K auth users |

---

## Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `langling.yourdomain.com`)
3. Update DNS as instructed

### Render:
1. Go to Service Settings → Custom Domains
2. Add your domain (e.g., `api.langling.yourdomain.com`)
3. Update DNS as instructed
4. Update `CORS_ORIGINS` to include the new frontend domain
