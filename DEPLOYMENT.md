# Deployment Instructions for Alex's Portfolio

## Quick Deploy to Vercel

1. **Push your code to GitHub** (if not already done)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository

3. **Deploy:**
   - Vercel will automatically detect it's a static site
   - Click "Deploy"
   - Your site will be live at `your-project-name.vercel.app`

## Guest Book Functionality

The guest book is now fully functional! It will:
- ✅ Accept new entries via the form
- ✅ Store entries in memory (resets on redeploy)
- ✅ Display all entries in real-time
- ✅ Show proper loading states and error handling

### For Persistent Storage (Optional)

If you want guest book entries to persist between deployments:

1. **Add Vercel Postgres:**
   - In your Vercel dashboard, go to your project
   - Click "Storage" tab
   - Click "Create Database" → "Postgres"
   - Copy the environment variables

2. **Add Environment Variables:**
   - In your Vercel dashboard, go to "Settings" → "Environment Variables"
   - Add the Postgres connection variables
   - Redeploy your site

3. **Switch API endpoint:**
   - Change `/api/guestbook` to `/api/guestbook-entries` in script.js
   - This will use the Postgres-backed API instead of in-memory storage

## What Works Now

- ✅ Fully functional guest book with real-time updates
- ✅ Form validation and error handling
- ✅ Retro-style popup notifications
- ✅ All existing animations and effects
- ✅ Mobile responsive design
- ✅ Working on Vercel's free tier

The guest book will now actually save and display real entries from visitors!