# ChatKit Setup Guide

This guide walks you through setting up the Managed ChatKit starter project with proper environment configuration.

## Prerequisites

- Node.js 18+ 
- Python 3.11+
- OpenAI API key with ChatKit access
- ChatKit workflow ID from OpenAI Agent Builder

## Step 1: Get Your Credentials

### OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/account/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-proj-`)
4. ⚠️ **IMPORTANT**: Store this securely. Don't commit it to git!

**Troubleshooting**:
- If you get a 401 error, your key may not have ChatKit API access enabled
- Contact OpenAI support to enable ChatKit for your organization
- If the key is exposed, delete it immediately from the API Keys page

### ChatKit Workflow ID

1. Go to [OpenAI Agent Builder](https://platform.openai.com/account/agents)
2. Select a workflow you want to use
3. Copy the workflow ID (starts with `wf_`)
4. Ensure it's from the same organization as your API key

## Step 2: Configure Environment Variables

### Create `.env.local`

```bash
cp .env.local .env.example
```

Edit `.env.local` and add your credentials:

```dotenv
# Your OpenAI API key from platform.openai.com/account/api-keys
OPENAI_API_KEY=sk-proj-...

# Your ChatKit workflow ID from Agent Builder (starts with wf_)
VITE_CHATKIT_WORKFLOW_ID=wf_...
```

### Important Security Notes

- **Never commit `.env.local`** - It's in `.gitignore` for a reason
- Never share your API keys in Slack, GitHub issues, or anywhere public
- If accidentally exposed:
  1. Go to OpenAI API Keys page
  2. Delete the exposed key immediately
  3. Generate a new one
  4. Update `.env.local`

### Optional Configuration

```dotenv
# Override ChatKit API endpoint (defaults to api.openai.com)
# CHATKIT_API_BASE=https://api.openai.com
# VITE_CHATKIT_API_BASE=https://api.openai.com

# Override backend API URL in frontend (for custom deployments)
# VITE_API_URL=http://your-api-server:8000

# Set to 'production' for secure cookies in production deployments
# ENVIRONMENT=production
```

## Step 3: Install Dependencies

```bash
npm install
```

This installs root dependencies and sets up both backend and frontend.

## Step 4: Run the Application

```bash
npm run dev
```

This starts:
- **Backend**: FastAPI server on http://localhost:8000
- **Frontend**: Vite dev server on http://localhost:3000

### What to expect:

1. Terminal shows backend startup with configuration validation
2. Browser opens to http://localhost:3000
3. Console shows "✓ ChatKit Frontend Configuration"
4. ChatKit panel loads and you can start chatting!

## Troubleshooting

### 500 Error: `/api/create-session`

**Cause**: Backend failed to create a session  
**Solutions**:
1. Check `.env.local` has `OPENAI_API_KEY` set
2. Verify API key is valid (not expired or revoked)
3. Check backend logs for the exact error
4. Ensure API key has ChatKit access enabled

### 401 Error: `api.openai.com/v1/chatkit/conversation`

**Cause**: API authentication failed  
**Solutions**:
1. Verify `OPENAI_API_KEY` in `.env.local`
2. Check key isn't expired
3. Confirm key is from the organization with ChatKit enabled
4. Try rotating the key:
   - Delete old key from [API Keys page](https://platform.openai.com/account/api-keys)
   - Create new key
   - Update `.env.local`

### Configuration Error on Startup

**Cause**: Missing or invalid environment variables  
**Solutions**:
1. Copy `.env.example`: `cp .env.example .env.local`
2. Fill in actual values (not placeholder text)
3. Remove any quotes around values
4. Save file and restart

### ChatKit panel not loading

**Cause**: Frontend configuration issues  
**Solutions**:
1. Check browser console for errors
2. Verify `VITE_CHATKIT_WORKFLOW_ID` starts with `wf_`
3. Ensure workflow is from same organization as API key
4. Try clearing browser cache

## Architecture

### Backend (`/backend`)
- **Framework**: FastAPI
- **Purpose**: Exchange workflow ID for ChatKit client secret
- **Key endpoint**: `POST /api/create-session`
- **Environment**: Reads from `.env.local`

### Frontend (`/frontend`)
- **Framework**: React + TypeScript + Vite
- **Purpose**: Display ChatKit interface
- **Proxy**: `/api/*` routes to backend
- **Environment**: Reads from `.env.local` via Vite

## Environment Variable Reference

| Variable | Required | Source | Used By |
|----------|----------|--------|---------|
| `OPENAI_API_KEY` | Yes | OpenAI API Keys | Backend |
| `VITE_CHATKIT_WORKFLOW_ID` | Yes | Agent Builder | Frontend + Backend |
| `CHATKIT_API_BASE` | No | Custom | Backend |
| `VITE_CHATKIT_API_BASE` | No | Custom | Backend |
| `VITE_API_URL` | No | Custom | Frontend |
| `ENVIRONMENT` / `NODE_ENV` | No | Custom | Backend (cookie security) |

## Next Steps

- Customize the ChatKit theme in [ChatKitPanel.tsx](frontend/src/components/ChatKitPanel.tsx)
- Add more workflows by creating additional sessions
- Deploy to production (set `ENVIRONMENT=production` for secure cookies)
- Read [ChatKit API docs](https://platform.openai.com/docs/guides/chatkit)

## Getting Help

- Check the main [README.md](README.md) for quick start
- Review error messages in browser console and backend logs
- Verify environment variables with `npm run dev` startup output
- Contact OpenAI support for ChatKit-specific issues
