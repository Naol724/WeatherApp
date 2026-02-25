# Deployment Guide

## Local Development

1. Copy `load-env.example.js` to `load-env.js`
2. Add your API key to `load-env.js`
3. Open `index.html` in browser

## Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Before deploying, add environment variable:
   - Go to Site settings → Environment variables
   - Add: `OPENWEATHER_API_KEY` = your API key
6. Deploy!

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Before deploying, add environment variable:
   - In project settings → Environment Variables
   - Add: `OPENWEATHER_API_KEY` = your API key
5. Deploy!

## Deploy to GitHub Pages

GitHub Pages doesn't support environment variables, so you have two options:

### Option 1: Use a backend proxy (recommended)
Set up a simple serverless function to proxy API requests

### Option 2: Temporary API key in code (not recommended for public repos)
1. Create a separate branch for deployment
2. In that branch only, hardcode the API key in `load-env.js`
3. Deploy from that branch
4. Never merge that branch back to main

## Important Notes

- Never commit `load-env.js` to GitHub (it's in `.gitignore`)
- For production, always use environment variables when possible
- Regenerate your API key if it's ever exposed publicly
