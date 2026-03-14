# Managed ChatKit starter

Vite + React UI that talks to a FastAPI session backend for creating ChatKit
workflow sessions.

## Quick start

### 1. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add:
- **OPENAI_API_KEY**: Get from [OpenAI API Keys](https://platform.openai.com/account/api-keys)
  - ⚠️ Ensure your API key has ChatKit API access
  - ⚠️ Never commit `.env.local` to git (it's in `.gitignore`)
- **VITE_CHATKIT_WORKFLOW_ID**: Get from OpenAI Agent Builder
  - Must start with `wf_`
  - Use a workflow from the same project/organization as your API key

### 2. Install and run

```bash
npm install           # installs root deps (concurrently)
npm run dev           # runs FastAPI on :8000 and Vite on :3000
```

What happens:

- `npm run dev` runs the backend via `backend/scripts/run.sh` (FastAPI + uvicorn on port 8000)
- The frontend runs via Vite dev server on port 3000
- The backend exposes `/api/create-session`, exchanging your workflow id and `OPENAI_API_KEY` for a ChatKit client secret
- The Vite dev server proxies `/api/*` requests to `127.0.0.1:8000`

## Environment Variables

### Required

- `OPENAI_API_KEY`: Your OpenAI API key for ChatKit operations
- `VITE_CHATKIT_WORKFLOW_ID`: Your ChatKit workflow ID from Agent Builder

### Optional

- `CHATKIT_API_BASE` / `VITE_CHATKIT_API_BASE`: Override ChatKit API endpoint (defaults to `https://api.openai.com`)
- `VITE_API_URL`: Override backend API target in frontend (defaults to `http://127.0.0.1:8000`)
- `ENVIRONMENT` / `NODE_ENV`: Set to `production` for secure cookies

## Security Best Practices

1. **Never commit `.env.local`** - API keys are sensitive credentials
2. **Rotate exposed keys** - If accidentally committed, revoke the key immediately
3. **Use strong, unique keys** - Generate new keys for different environments
4. **Check `.gitignore`** - Ensure env files are excluded before committing

## Customize

- UI: `frontend/src/components/ChatKitPanel.tsx`
- Session logic: `backend/app/main.py`
