# The Automotivist — Tools Site
## tools.automotivist.com

---

## What this is

A Next.js site that generates 238+ programmatic SEO pages from salary/payment combinations,
plus a standalone calculator at /calculator.

Each page at `/car-payment/[payment]-per-month-[salary]-salary` answers the exact query:
"Is a $X car payment too high on a $Y salary?" — with a direct verdict above the fold,
full math breakdown, embedded calculator pre-loaded with those values, FAQs with schema markup,
and related pages. This is optimized for both Google and AI assistants (AEO).

---

## Deploying to Vercel (one-time setup, ~15 minutes)

### Step 1 — Push to GitHub

1. Create a new repo on github.com (call it `automotivist-tools`)
2. In this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial build"
   git remote add origin https://github.com/YOUR_USERNAME/automotivist-tools.git
   git push -u origin main
   ```

### Step 2 — Connect to Vercel

1. Go to vercel.com, sign in with GitHub
2. Click "New Project" → Import your `automotivist-tools` repo
3. Framework preset: **Next.js** (auto-detected)
4. No environment variables needed
5. Click **Deploy**

Vercel will build and deploy. Takes ~3 minutes for 238 pages.

### Step 3 — Add custom domain

1. In Vercel project → Settings → Domains
2. Add `tools.automotivist.com`
3. Vercel gives you a CNAME record to add in Cloudflare:
   ```
   Type:  CNAME
   Name:  tools
   Value: cname.vercel-dns.com
   ```
4. In Cloudflare, add that CNAME record. Set proxy to **DNS only** (grey cloud).
5. Wait ~5 minutes for DNS propagation.
6. tools.automotivist.com is live.

---

## How pages are generated

**Payment range:** $200–$1,500 in $100 increments (14 values)
**Salary range:** $40,000–$200,000 in $10,000 increments (17 values)
**Total pages:** 238

To add more pages (e.g., $50 increments for payments):
Edit `lib/calculations.js` → `getAllPagePaths()` function → change the step from 100 to 50.
Commit and push. Vercel rebuilds automatically.

---

## Expanding to $50 increments (891 pages)

Change `getAllPagePaths()` in `lib/calculations.js`:

```js
// Current: $100 increments
for (let p = 200; p <= 1500; p += 100) payments.push(p);

// Expanded: $50 increments (27 values)  
for (let p = 200; p <= 1500; p += 50) payments.push(p);
```

Commit, push, Vercel redeploys. No other changes needed.

---

## Adding vehicle true-cost pages (Type 2)

Create `pages/true-cost/[slug].js` following the same pattern as `car-payment/[slug].js`.
Add a `lib/vehicles-data.js` file with the top 50 vehicles by sales volume.
Each slug: `2025-honda-crv`, `2025-ford-f150`, etc.

---

## Content update process

All content is generated from `lib/calculations.js`. To update assumptions (e.g., new
insurance estimates, updated APR averages, new AAA data):

1. Edit the relevant function in `lib/calculations.js`
2. Commit and push
3. Vercel rebuilds all pages with new data automatically
