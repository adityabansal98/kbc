# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your Gemini API key

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository

3. **Configure Project**:
   - **Project Name**: `kbc` (or your preferred name)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_GEMINI_API_KEY` = `your_api_key_here`
   - Make sure to add it for **Production**, **Preview**, and **Development**

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add `VITE_GEMINI_API_KEY`

4. **Add Environment Variable** (if not added during deploy):
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```
   - Enter your API key when prompted
   - Select all environments (Production, Preview, Development)

5. **Redeploy** (to apply environment variable):
   ```bash
   vercel --prod
   ```

## Environment Variables

Make sure to add your Gemini API key in Vercel:

- **Variable Name**: `VITE_GEMINI_API_KEY`
- **Value**: Your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Environments**: Production, Preview, Development (select all)

## Vercel Analytics

Vercel Analytics is already integrated! Once deployed, you can view analytics in your Vercel dashboard under the "Analytics" tab.

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally
- Check build logs in Vercel dashboard

### API Key Not Working
- Verify environment variable is set correctly
- Make sure it's added to all environments
- Redeploy after adding environment variables

### Analytics Not Showing
- Analytics appear after first deployment
- Check Vercel dashboard → Analytics tab
- May take a few minutes to populate

## Updating Your Deployment

After making changes:

1. **Via GitHub** (if connected):
   - Push changes to your repository
   - Vercel will automatically redeploy

2. **Via CLI**:
   ```bash
   vercel --prod
   ```

