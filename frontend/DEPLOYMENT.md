# Netlify Deployment Guide

## Prerequisites
- A Netlify account
- Your Supabase project credentials

## Deployment Steps

### 1. Environment Variables
In your Netlify site settings, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### 2. Build Settings
The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Node version: 18
- Next.js plugin enabled

### 3. Deploy
Simply push to your connected Git repository, and Netlify will automatically deploy.

## Troubleshooting

### 404 Errors
The app includes proper redirects in:
- `netlify.toml` - Main redirect configuration
- `public/_redirects` - Fallback redirects

### Build Failures
- Ensure Node version is set to 18 or higher
- Check that all environment variables are set
- Verify the build succeeds locally with `npm run build`

### Images Not Loading
- External images from Pexels are configured in `next.config.js`
- Images are set to unoptimized for Netlify compatibility
