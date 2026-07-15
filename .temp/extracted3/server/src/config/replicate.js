// ────────────────────────────────────────────────────────────────
// Replicate API client
// Docs: https://replicate.com/docs/reference/http
// ────────────────────────────────────────────────────────────────
const Replicate = require('replicate');

if (!process.env.REPLICATE_API_TOKEN) {
  // We don't throw here — app.js should still boot so other routes work.
  // The controller checks for this again before every request and fails loud.
  console.warn('[replicate] ⚠️  REPLICATE_API_TOKEN is not set in .env — /api/enhance-photo will not function.');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ── Model registry ──────────────────────────────────────────────
// Centralizing model versions here means a model upgrade is a one-line change,
// not a hunt-through-the-codebase change. Pin versions (not just "latest")
// so behavior never silently changes underneath you.
//
// tencentarc/gfpgan: purpose-built FACE RESTORATION model (GAN-based, not
//   diffusion). It works from the actual detected face rather than
//   free-form generation, so it corrects blur/noise/compression without
//   inventing a different bone structure, skin tone, or ethnicity. This is
//   your DEFAULT for any photo containing people — identity stays intact.
//   Apache-2.0 licensed, so it's safe for a commercial site. Also fast
//   (~3s) and cheap (~$0.002/run).
//
// philz1337x/clarity-upscaler: diffusion-based "creative" upscaler (the
//   engine behind ClarityAI.co/Magnific-style tools). It re-synthesizes
//   plausible new detail rather than recovering existing detail, which is
//   what makes the "wow" transformation possible — but that same mechanism
//   is *why* it can drift a real person's face into looking like someone
//   else. Keep this as an OPT-IN "dramatic" mode for landscapes/objects/
//   backgrounds, not the default for portraits.
//
// nightmareai/real-esrgan: general super-resolution, no face-specific
//   logic. Left in as a lightweight fallback/A-B option.
//
// NOTE ON LICENSING: sczhou/codeformer is another strong face-restoration
//   option, but it ships under the NTU S-Lab License 1.0, which restricts
//   commercial use/redistribution — deliberately NOT used here since
//   rokitOnline is a commercial product. GFPGAN (Apache-2.0) has no such
//   restriction.
const MODELS = {
  GFPGAN:
    'tencentarc/gfpgan:ae80bbe1adce7d616b8a96ba88a91d3556838d4f2f4da76327638b8e95ea4694',
  REAL_ESRGAN:
    'nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46a',
  CLARITY_UPSCALER:
    'philz1337x/clarity-upscaler:eba39f520856d5e61a8ad56fd57f97be2fa30de65e29d8e94db5209a1827cd59',
};

module.exports = { replicate, MODELS };
