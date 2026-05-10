# Deployment Guide - Netlify

This guide explains how to deploy the SwapFlow currency exchange application to Netlify.

## 🚀 Quick Deploy

### Option 1: Netlify UI (Recommended)

1. **Sign in to Netlify** at [netlify.com](https://netlify.com)

2. **Click "Add new site" → "Import an existing project"**

3. **Connect your Git repository**
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select this repository

4. **Configure build settings:**
   ```
   Base directory: problem2
   Build command: npm run build
   Publish directory: problem2/dist
   ```

5. **Deploy!**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app
   - You'll get a unique URL like: `https://your-site-name.netlify.app`

### Option 2: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Navigate to problem2 directory:**
   ```bash
   cd src/problem2
   ```

4. **Build the project:**
   ```bash
   npm install
   npm run build
   ```

5. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

## 📋 Configuration Details

### Netlify Configuration File

The project includes a `netlify.toml` file that automatically configures:

- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ SPA redirect rules (for client-side routing)
- ✅ Security headers (XSS protection, frame options, etc.)
- ✅ Cache headers for optimal performance
- ✅ Node.js version: 18

### Manual Settings (if not using netlify.toml)

If you prefer to configure through Netlify UI:

1. **Site settings → Build & deploy → Build settings:**
   - Base directory: `problem2`
   - Build command: `npm run build`
   - Publish directory: `problem2/dist`
   - Node version: `18` (set in Environment variables)

2. **Environment variables** (if needed):
   - Go to Site settings → Build & deploy → Environment
   - Add any required environment variables

## 🔧 Build Process

The build process:
1. Installs dependencies with `npm install`
2. Runs `npm run build` which executes Vite build
3. Generates optimized production files in `dist/` directory:
   - `index.html` - Main HTML file
   - `assets/` - Minified JavaScript and CSS files
   - Source maps for debugging

## 🌐 Post-Deployment

After deployment:

1. **Test your site:**
   - Visit the provided Netlify URL
   - Test token selection, swapping, and all features
   - Check responsiveness on mobile devices

2. **Custom domain (optional):**
   - Go to Site settings → Domain management
   - Add your custom domain

3. **HTTPS:**
   - Netlify automatically provisions SSL certificates
   - Your site will be available via HTTPS

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [x] All dependencies are listed in `package.json`
- [x] Build succeeds locally: `npm run build`
- [x] No hardcoded development URLs
- [x] Environment variables are properly configured
- [x] `.gitignore` excludes `node_modules/` and `dist/`
- [x] Code is committed and pushed to Git repository

## 🐛 Troubleshooting

### Build Fails

**Issue:** "Build failed" error on Netlify

**Solutions:**
- Check Node.js version matches local (18+)
- Verify all dependencies are in `package.json`
- Review build logs in Netlify dashboard
- Test build locally: `npm run build`

### 404 on Refresh

**Issue:** Page refreshes show 404 error

**Solution:**
- Ensure `netlify.toml` includes redirect rules
- Or manually add redirect: `/* /index.html 200` in Netlify UI

### Assets Not Loading

**Issue:** CSS/JS files return 404

**Solutions:**
- Verify publish directory is set to `dist` not root
- Check base directory is set to `problem2`
- Ensure build completed successfully

## 📊 Performance Optimization

The deployed app includes:
- Minified JavaScript and CSS
- Optimized images (SVG icons)
- Gzip compression (automatic by Netlify)
- CDN distribution (automatic by Netlify)
- Cache headers for static assets
- Source maps for debugging

## 🔒 Security

The deployment includes security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `X-Content-Type-Options: nosniff` - MIME type sniffing prevention
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy protection

## 📝 Continuous Deployment

Netlify automatically:
- Rebuilds on every Git push to main branch
- Shows deploy previews for pull requests
- Maintains deploy history and rollback capability
- Provides unique URLs for each deploy

## 🎉 Success!

Your SwapFlow application is now live and accessible worldwide!

**Next steps:**
- Share your deployment URL
- Monitor analytics in Netlify dashboard
- Set up custom domain (optional)
- Configure form handling or serverless functions (if needed)

---

**Need help?** Check [Netlify documentation](https://docs.netlify.com/) or open an issue in the repository.
