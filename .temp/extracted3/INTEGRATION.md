# AI Photo Enhancer — Integration Guide for rokitOnline

Every file in this folder mirrors your repo's exact path. Drop them in, then make the small edits below to wire it up.

## 1. Copy files in

```
server/src/config/replicate.js               → rokitOnline/server/src/config/replicate.js
server/src/middleware/enhanceUpload.js        → rokitOnline/server/src/middleware/enhanceUpload.js
server/src/controllers/enhanceController.js   → rokitOnline/server/src/controllers/enhanceController.js
server/src/routes/enhance.js                  → rokitOnline/server/src/routes/enhance.js
server/tmp/enhance-uploads/.gitkeep           → rokitOnline/server/tmp/enhance-uploads/.gitkeep

client/src/components/sections/PhotoEnhancer/ → rokitOnline/client/src/components/sections/PhotoEnhancer/
client/src/pages/PhotoEnhancer.jsx            → rokitOnline/client/src/pages/PhotoEnhancer.jsx
```

## 2. Install dependencies

```bash
cd server
npm install replicate

cd ../client
# no new npm packages needed — the slider and dropzone are hand-built
# on top of libraries you already have (react, lucide-react, react-hot-toast, axios)
```

## 3. Environment variables (`server/.env`)

Add:
```
REPLICATE_API_TOKEN=r8_your_token_here
```
Get a token at https://replicate.com/account/api-tokens (free account, pay-per-use after that — see cost notes below). Add the same line to `server/.env.example` (masked) so future setups know it's required.

## 4. Wire the route into `server/src/app.js`

Add this line next to your other route mounts:
```js
app.use('/api/enhance-photo', require('./routes/enhance'));
```
Full block should look like:
```js
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/services',       require('./routes/services'));
app.use('/api/portfolio',      require('./routes/portfolio'));
app.use('/api/tutorials',      require('./routes/tutorials'));
app.use('/api/orders',         require('./routes/orders'));
app.use('/api/quotes',         require('./routes/quotes'));
app.use('/api/designs',        require('./routes/designs'));
app.use('/api/contact',        require('./routes/contact'));
app.use('/api/clients',        require('./routes/clients'));
app.use('/api/admin',          require('./routes/admin'));
app.use('/api/enhance-photo',  require('./routes/enhance'));   // ← new
```

## 5. Add `server/.gitignore` entry (so temp uploads never get committed)

```
tmp/enhance-uploads/*
!tmp/enhance-uploads/.gitkeep
```

## 6. Add the page route in `client/src/App.jsx`

```jsx
import PhotoEnhancer from './pages/PhotoEnhancer';
// ...inside your public <Routes> (same nesting level as <Route path="/gallery" element={<Gallery />} />):
<Route path="/photo-enhancer" element={<PhotoEnhancer />} />
```

## 7. Add the nav tab in `client/src/components/layout/Navbar.jsx`

```js
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services', children: [...] },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Photo Enhancer', to: '/photo-enhancer' },   // ← new
  { label: 'Tutorials', to: '/tutorials' },
  { label: 'Solutions', to: '/solutions', children: [...] },
  { label: 'Contact', to: '/contact' },
];
```

## 8. Verify the axios import path

`PhotoEnhancer.jsx` imports your existing shared axios instance:
```js
import api from '../../../utils/api';
```
That matches `client/src/utils/api.js` in your current repo — no change needed, just double-check the relative path if you move the folder.

---

## Re-skinning for a different site (the adaptability piece)

Everything visual reads from CSS custom properties defined in `enhancerTheme.js`. To plug this widget into a *different* site with a different look:

1. Open `enhancerTheme.js`.
2. Either hand-edit the `rokitTheme` object's values (colors/fonts/radius), **or**
3. Call `deriveFromCSSVars({...})` once at app startup to auto-pull the new site's own CSS variables (if it exposes design tokens like `--color-primary`) — zero JSX edits required either way.

No component file needs to change. The dropzone, spinner, slider, and buttons all just re-paint.

---

## How it works end-to-end

1. User drags/drops or selects a photo → client-side validation (type/size) → `POST /api/enhance-photo` as `multipart/form-data`.
2. `multer` (disk storage) saves it briefly to `server/tmp/enhance-uploads/`.
3. The controller streams that file straight into Replicate's `nightmareai/real-esrgan` model (`face_enhance: true` runs a GFPGAN pass on any detected faces as part of the same call — no separate model chain needed).
4. Replicate returns a hosted URL for the upscaled/restored image.
5. We respond with `{ enhancedUrl }` and **delete the local temp file** in a `finally` block, whether the call succeeded or failed.
6. The client renders the before/after slider (original = local object URL, after = Replicate's URL) and offers a one-click download (fetched as a blob so the browser actually saves it instead of navigating to it).

## Why the person looked unrecognizable (and what changed)

`clarity-upscaler` is diffusion-based — it doesn't just recover detail that exists in the photo, it *invents* plausible new detail. On backgrounds and objects that's a great trick. On a real person's face, that same mechanism can drift skin tone, bone structure, and features into someone who looks like a different person entirely. This is a well-documented limitation of every diffusion "creative upscaler" (Magnific, ClarityAI, etc.) — not a bug specific to your setup.

The controller now defaults to **`tencentarc/gfpgan`** for every request — a purpose-built face-restoration model (GAN-based, not diffusion) that works from the face that's actually in the photo instead of generating a new one. It corrects blur, noise, and compression while keeping the person recognizable. It's also faster (~3s vs. ~10-30s) and far cheaper (~$0.002/run vs. $0.02+/run).

`clarity-upscaler` is still wired in, but now only runs when the request explicitly sets `mode: 'dramatic'` in the form body, and even then with much more conservative defaults (`creativity: 0.15`, `resemblance: 1.4` — anchored hard to the source face). Use "restore" (default) for anything with people in it; reach for "dramatic" only on landscapes, objects, or backgrounds where identity drift doesn't matter.

**On CodeFormer, in case you research it further:** it's another strong face-restoration option and shows up constantly in comparisons with GFPGAN — but it ships under the **NTU S-Lab License 1.0**, which restricts commercial use and redistribution. Since rokitOnline is a commercial product, I deliberately did not use it. GFPGAN is Apache-2.0 licensed with no such restriction.

## Cost & scaling notes (dig-deep research summary)

- Replicate bills **per second of GPU time actually used**, not a flat per-image fee. GFPGAN (the new default) runs about $0.002/image — roughly 500 runs per dollar. `clarity-upscaler` (opt-in "dramatic" mode) costs more, around $0.02+ per run depending on resolution/steps. Check https://replicate.com/pricing and each model's own page for live rates, since GPU pricing changes.
- The `enhanceLimiter` in `routes/enhance.js` (20 requests / 15 min per IP) exists specifically to cap runaway cost from abuse — tune it once you see real traffic.
- If volume grows, consider: (a) caching repeated requests by file hash, (b) queuing via a job system instead of a synchronous `await`, so the HTTP request doesn't hold a connection open for the full 5–15s, and (c) moving to Replicate's async `predictions.create` + webhook pattern instead of the blocking `replicate.run()` used here, once you want to decouple the request from the result.
