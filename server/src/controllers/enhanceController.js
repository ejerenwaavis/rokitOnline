// ────────────────────────────────────────────────────────────────
// AI Photo Enhancer controller
// Flow: client uploads image → we stream it to Replicate → Replicate
// runs Real-ESRGAN (+ GFPGAN face restoration via face_enhance: true)
// → we return the hosted output URL → we delete our local temp copy.
//
// The Replicate API key NEVER touches the client. This is the only
// file in the whole codebase that talks to Replicate.
// ────────────────────────────────────────────────────────────────
const fs = require('fs');
const { replicate, MODELS } = require('../config/replicate');

// How long we're willing to wait for a prediction before giving up.
// clarity-upscaler is diffusion-based (18+ denoising steps per tile), so
// it typically runs 10-30s — noticeably longer than a pure super-resolution
// model like real-esrgan, and cold starts add more on top. Give it real headroom.
const PREDICTION_TIMEOUT_MS = 90 * 1000;

// Wraps a promise so a hung Replicate call can never hang our server/UX forever.
const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label}_TIMEOUT`)), ms)
    ),
  ]);

// Always attempt to remove the temp file, whether we succeeded or failed.
// Fire-and-log rather than throw — a failed cleanup should never mask
// the real response we're about to send the user.
const cleanupTempFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`[enhance-photo] Failed to delete temp file ${filePath}:`, err.message);
    }
  });
};

const enhancePhoto = async (req, res) => {
  const tempFilePath = req.file?.path;

  try {
    // ── 1. Guard: missing API key (misconfigured server) ─────────
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(500).json({
        message: 'Photo enhancement is temporarily unavailable (server misconfiguration). Please try again later.',
      });
    }

    // ── 2. Guard: no file actually arrived ────────────────────────
    if (!req.file) {
      return res.status(400).json({ message: 'No image file was uploaded.' });
    }

    // ── 3. Read the upload and convert to base64 data URI.
    //     Newer Replicate SDKs expect a string (URL or data URI) rather than a stream.
    const fileData = await fs.promises.readFile(tempFilePath);
    const ext = require('path').extname(req.file.originalname).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    const dataUri = `data:${mimeType};base64,${fileData.toString('base64')}`;

    const scale = Number(req.body.scale) === 4 ? 4 : 2; // 2x default, 4x optional

    // "restore" (default) = GFPGAN, identity-safe, correct choice for photos
    // of real people. "dramatic" = clarity-upscaler, opt-in only — trades
    // identity accuracy for a bigger visual "pop" (see MODELS comment).
    const mode = req.body.mode === 'dramatic' ? 'dramatic' : 'restore';

    let output;
    if (mode === 'dramatic') {
      // Deliberately conservative defaults even in "dramatic" mode: low
      // creativity + high resemblance keeps the diffusion process anchored
      // to the real face instead of re-imagining it. Callers can still push
      // creativity higher via req.body for non-portrait images.
      output = await withTimeout(
        replicate.run(MODELS.CLARITY_UPSCALER, {
          input: {
            image: dataUri,
            scale_factor: scale,
            creativity: Number(req.body.creativity) || 0.15,
            resemblance: Number(req.body.resemblance) || 1.4,
            dynamic: Number(req.body.dynamic) || 6,
            sharpen: Number(req.body.sharpen) || 2,
            num_inference_steps: 18,
          },
        }),
        PREDICTION_TIMEOUT_MS,
        'REPLICATE_PREDICTION'
      );
    } else {
      // GFPGAN — note the field is "img", not "image", and version is a
      // string like "v1.3" / "v1.4", not a number. Output is a single URI
      // string (no array unwrapping needed, unlike clarity-upscaler).
      output = await withTimeout(
        replicate.run(MODELS.GFPGAN, {
          input: {
            img: dataUri,
            version: 'v1.4',
            scale,
          },
        }),
        PREDICTION_TIMEOUT_MS,
        'REPLICATE_PREDICTION'
      );
    }

    // clarity-upscaler's output schema is an array of image URIs. Depending
    // on the installed `replicate` package version, each item can arrive as:
    //   (a) a plain string URL,
    //   (b) a FileOutput object with a .url() method that returns either a
    //       string or a URL object, or
    //   (c) (rare) a bare URL object.
    // Handle all three so a minor SDK version bump can't silently break this
    // the way it just did — this is the actual bug that caused the blank panel.
    const normalizeToUrlString = (value) => {
      if (!value) return null;
      if (typeof value === 'string') return value;
      if (typeof value.url === 'function') {
        const resolved = value.url();
        return typeof resolved === 'string' ? resolved : resolved?.toString?.() ?? null;
      }
      if (typeof value.toString === 'function' && value.toString() !== '[object Object]') {
        return value.toString();
      }
      return null;
    };

    const rawOutput = Array.isArray(output) ? output[0] : output;
    const enhancedUrl = normalizeToUrlString(rawOutput);

    if (!enhancedUrl) {
      console.error('[enhance-photo] Could not extract a URL from Replicate output:', JSON.stringify(output));
      throw new Error('EMPTY_PREDICTION_OUTPUT');
    }

    return res.status(200).json({
      success: true,
      original: req.file.originalname,
      enhancedUrl,
      scale,
      mode,
    });
  } catch (err) {
    console.error('[enhance-photo] Error:', err.message);

    // ── Specific, user-friendly error mapping ─────────────────────
    if (err.message === 'REPLICATE_PREDICTION_TIMEOUT') {
      return res.status(504).json({
        message: 'Enhancement is taking longer than expected. Please try again in a moment.',
      });
    }
    if (err.message === 'UNSUPPORTED_FILE_TYPE') {
      return res.status(415).json({
        message: 'Unsupported file type. Please upload a JPEG, PNG, or WEBP image.',
      });
    }
    if (err.message === 'EMPTY_PREDICTION_OUTPUT') {
      return res.status(502).json({
        message: 'The enhancement model returned no result. Please try a different photo.',
      });
    }
    if (err.name === 'ReplicateError' || err.status) {
      return res.status(err.status === 401 ? 500 : 502).json({
        message: err.status === 401
          ? 'Photo enhancement is temporarily unavailable (invalid API credentials).'
          : 'The AI enhancement service returned an error. Please try again.',
      });
    }

    return res.status(500).json({ message: 'Something went wrong while enhancing your photo.' });
  } finally {
    // ── ALWAYS clean up the local temp file — success or failure ──
    cleanupTempFile(tempFilePath);
  }
};

module.exports = { enhancePhoto };
