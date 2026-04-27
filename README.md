# ScoutEdge Content Bot

Standalone HTML + Netlify Functions app for generating ScoutEdge social media drafts.

## What this is

This is a separate project from the main ScoutEdge app. It does not touch ScoutEdge production files, Netlify deployment, or `index.html`.

## Structure

```txt
index.html
app.js
netlify.toml
.env.example
netlify/functions/generate-content.js
```

## Required Netlify environment variables

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5
```

The OpenAI key must be configured in Netlify only. Do not put the key in `index.html` or `app.js`.

## How it works

1. User enters a ScoutEdge product update.
2. User selects audience, tone, and platforms.
3. Browser calls `/.netlify/functions/generate-content`.
4. Netlify Function calls OpenAI server-side.
5. Drafts return to the page.
6. Drafts are stored locally in browser `localStorage`.
7. User can approve, hold, reject, copy, or export drafts.

## Deployment

Use a separate Netlify project:

```txt
scoutedge-content-ops-agent
```

Build settings:

```txt
Build command: blank
Publish directory: .
Functions directory: netlify/functions
```

## V1 limits

- No auto-posting
- No scraping
- No DMs
- No replies
- No Supabase dependency
- Approval-first workflow only
