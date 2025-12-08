# 🚀 PRODUCTION DEPLOYMENT GUIDE

**Sana:** 2024-12-09  
**Versiya:** 1.0.0

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- ✅ All tests passing (198/198)
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Build successful (`pnpm build`)
- ✅ Environment variables documented
- ✅ Supabase configured
- ✅ Manual QA completed

---

## 🌐 VERCEL DEPLOYMENT

### Option 1: Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login
```bash
vercel login
```

#### 3. Deploy
```bash
# Test deployment (preview)
vercel

# Production deployment
vercel --prod
```

#### 4. Environment Variables
Vercel Dashboard → Settings → Environment Variables'ga quyidagilarni qo'shing:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Boshqaruv.uz
VITE_APP_VERSION=1.0.0
```

---

### Option 2: Vercel Dashboard (GitHub Integration)

#### 1. GitHub'ga Push
```bash
git add .
git commit -m "Production ready - MVP 1.0.0"
git push origin main
```

#### 2. Vercel'da Import
1. https://vercel.com/new oching
2. "Import Git Repository" → GitHub'dan repository tanlang
3. Framework Preset: **Vite** (auto-detect qiladi)
4. Build Command: `pnpm build`
5. Output Directory: `dist`
6. Install Command: `pnpm install`

#### 3. Environment Variables
Settings → Environment Variables:
```
VITE_SUPABASE_URL → Production URL
VITE_SUPABASE_ANON_KEY → Production Key
```

#### 4. Deploy
**Deploy** tugmasini bosing!

---

### Vercel Configuration

`vercel.json` fayli allaqachon mavjud:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🌐 NETLIFY DEPLOYMENT

### Option 1: Netlify CLI

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Login
```bash
netlify login
```

#### 3. Deploy
```bash
# Test deployment
netlify deploy

# Production deployment
netlify deploy --prod
```

---

### Option 2: Netlify Dashboard (GitHub Integration)

#### 1. GitHub'ga Push
```bash
git add .
git commit -m "Production ready - MVP 1.0.0"
git push origin main
```

#### 2. Netlify'da Import
1. https://app.netlify.com/start oching
2. "Import from Git" → GitHub repository tanlang
3. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
   - Base directory: (bo'sh qoldiring)

#### 3. Environment Variables
Site settings → Environment variables:
```
VITE_SUPABASE_URL → Production URL
VITE_SUPABASE_ANON_KEY → Production Key
```

#### 4. Deploy
Automatic deploy boshlanadi!

---

### Netlify Configuration

`netlify.toml` yarating:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

---

## 🔒 ENVIRONMENT VARIABLES

### Development (.env.local)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_ENV=development
```

### Production (Vercel/Netlify)
```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_ENV=production
VITE_ANALYTICS_ID=your_analytics_id
```

---

## 🎯 CUSTOM DOMAIN

### Vercel
1. Vercel Dashboard → Settings → Domains
2. Add domain: `boshqaruv.uz`
3. DNS'da quyidagi recordlarni qo'shing:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

### Netlify
1. Netlify Dashboard → Domain settings
2. Add custom domain: `boshqaruv.uz`
3. DNS'da quyidagi recordlarni qo'shing:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   
   Type: A (IPv4)
   Name: @
   Value: 75.2.60.5
   ```

---

## 📊 POST-DEPLOYMENT

### 1. SSL Certificate
- ✅ Vercel: Auto SSL (Let's Encrypt)
- ✅ Netlify: Auto SSL (Let's Encrypt)

### 2. Performance Check
```bash
# Lighthouse audit
npx lighthouse https://boshqaruv.uz --view

# Expected scores:
# Performance: >90
# Accessibility: >95
# Best Practices: >90
# SEO: >95
```

### 3. Monitoring
- [ ] Vercel Analytics (built-in)
- [ ] Netlify Analytics (optional)
- [ ] Google Analytics (see ANALYTICS.md)
- [ ] Sentry error tracking (optional)

### 4. Testing
- [ ] Test production URL
- [ ] Test all features
- [ ] Test mobile responsiveness
- [ ] Test different browsers

---

## 🔄 CONTINUOUS DEPLOYMENT

### Automatic Deploys (GitHub)

Vercel/Netlify ham GitHub'ga push qilinganda avtomatik deploy qiladi:

```bash
# Feature branch → Preview deployment
git checkout -b feature/new-feature
git push origin feature/new-feature

# Main branch → Production deployment
git checkout main
git merge feature/new-feature
git push origin main
```

---

## 🐛 ROLLBACK

### Vercel
1. Dashboard → Deployments
2. Previous deployment'ni tanlang
3. "Promote to Production" bosing

### Netlify
1. Dashboard → Deploys
2. Previous deploy'ni tanlang
3. "Publish deploy" bosing

---

## 📝 DEPLOYMENT SCRIPT

`deploy.sh` yarating:
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Run tests
echo "Running tests..."
pnpm test --run

# Type check
echo "Type checking..."
pnpm typecheck

# Lint
echo "Linting..."
pnpm lint

# Build
echo "Building..."
pnpm build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
```

Ishga tushirish:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🎉 DEPLOYMENT URLS

### Production
- **Vercel:** https://boshqaruv.vercel.app
- **Netlify:** https://boshqaruv.netlify.app
- **Custom:** https://boshqaruv.uz

### Preview (for PRs)
- **Vercel:** https://boshqaruv-pr-123.vercel.app
- **Netlify:** https://deploy-preview-123--boshqaruv.netlify.app

---

## 📞 SUPPORT

### Vercel
- Docs: https://vercel.com/docs
- Dashboard: https://vercel.com/dashboard
- Support: support@vercel.com

### Netlify
- Docs: https://docs.netlify.com
- Dashboard: https://app.netlify.com
- Support: support@netlify.com

---

**Status:** ✅ Deployment guide tayyor!  
**Next:** Deploy qiling va production'ni test qiling!
