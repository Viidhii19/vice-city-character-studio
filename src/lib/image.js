/**
 * Image processing and data URL conversion utilities
 */

/**
 * Ensures an image URL or path is converted to a base64 Data URL.
 * This guarantees the image can be safely manipulated in canvas / iframes
 * without CORS errors or relative path resolution issues.
 */
export async function ensureDataUrl(imageSource) {
  if (!imageSource || typeof imageSource !== 'string') {
    return null;
  }

  // Already a data URL
  if (imageSource.startsWith('data:')) {
    return imageSource;
  }

  try {
    const response = await fetch(imageSource);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to convert blob to Data URL'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('[ensureDataUrl] Fallback to raw source due to error:', error);
    return imageSource;
  }
}

/**
 * 2D Canvas context filters matching each Vibe ID from src/data/presets.js
 */
const VIBE_FILTERS = {
  'neon-nights': 'contrast(1.25) saturate(1.6) hue-rotate(-25deg)',
  'ocean-drive': 'sepia(0.35) saturate(1.45) brightness(1.1) contrast(1.05)',
  'downtown-heat': 'contrast(1.35) sepia(0.4) saturate(0.85) brightness(0.95)',
  'after-dark': 'brightness(0.75) contrast(1.4) hue-rotate(180deg) saturate(1.2)',
  'sunset-boulevard': 'saturate(1.7) brightness(1.05) hue-rotate(15deg) contrast(1.1)',
  'backstreet': 'grayscale(0.75) contrast(1.5) brightness(0.9)',
};

/**
 * Converts imageSource to Base64 Data URL, applies vibe-specific 2D canvas grading,
 * vignette, and scanline overlays on an off-screen 1200x1600 canvas (object-fit: cover),
 * and returns the mutated PNG Base64 Data URL.
 */
export async function ensureDataUrlWithVibe(imageSource, vibeId) {
  if (!imageSource) return null;

  // Step 1: Resolve imageSource into Base64 Data URL to bypass CORS and tainted canvas issues
  const base64DataUrl = await ensureDataUrl(imageSource);
  if (!base64DataUrl) return null;

  // Guard for non-browser environments
  if (typeof document === 'undefined') {
    return base64DataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    if (!base64DataUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Use image's natural dimensions to preserve 100% of the image without cropping
        const imgWidth = img.naturalWidth || img.width || 1200;
        const imgHeight = img.naturalHeight || img.height || 1600;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(base64DataUrl);
          return;
        }

        // Apply custom 2D canvas context filter matching Vibe ID
        const filterStr = VIBE_FILTERS[vibeId] || 'none';
        ctx.filter = filterStr;

        // Draw base image onto canvas preserving full image bounds
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        ctx.filter = 'none';

        // Add subtle vignette and scanline overlays via Canvas 2D blend modes
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';

        // Vignette overlay
        const maxRadius = Math.sqrt(Math.pow(imgWidth / 2, 2) + Math.pow(imgHeight / 2, 2));
        const vignette = ctx.createRadialGradient(
          imgWidth / 2, imgHeight / 2, Math.min(imgWidth, imgHeight) * 0.35,
          imgWidth / 2, imgHeight / 2, maxRadius
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(0.65, 'rgba(0, 0, 0, 0.25)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, imgWidth, imgHeight);

        // Scanlines overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        for (let y = 0; y < imgHeight; y += 4) {
          ctx.fillRect(0, y, imgWidth, 1.5);
        }

        ctx.restore();

        // Resolve and return mutated base64 Data URL (image/png)
        const mutatedDataUrl = canvas.toDataURL('image/png');
        resolve(mutatedDataUrl);
      } catch (err) {
        console.warn('[ensureDataUrlWithVibe] Canvas grading error, falling back:', err);
        resolve(base64DataUrl);
      }
    };

    img.onerror = (err) => {
      console.warn('[ensureDataUrlWithVibe] Image element failed to load:', err);
      resolve(base64DataUrl);
    };

    img.src = base64DataUrl;
  });
}

/**
 * Validates an uploaded image file
 */
export function validateImageFile(file, maxSizeBytes = 15 * 1024 * 1024) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Invalid file format. Please upload PNG, JPG, or WEBP.' };
  }

  if (file.size > maxSizeBytes) {
    const mbLimit = Math.round(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `Image exceeds the ${mbLimit}MB size limit.` };
  }

  return { valid: true, error: null };
}

/**
 * Random Vice City character identity generator
 */
const RANDOM_FIRST_NAMES = ['Lucia', 'Jason', 'Tommy', 'Mercedes', 'Tony', 'Vic', 'Lance', 'Avery', 'Ricardo', 'Ken', 'Valeria', 'Dante', 'Sonny', 'Camila'];
const RANDOM_LAST_NAMES = ['Vance', 'Montana', 'Diaz', 'Cortez', 'Rosenberg', 'Carrington', 'Torres', 'Mendez', 'Morales', 'Vega', 'Delgado', 'Reyes'];
const RANDOM_ALIASES = ['Apex', 'Ghost', 'Nitro', 'NeonBlade', 'Midnight', 'Cashflow', 'ZeroCool', 'Phantom', 'Cipher', 'Viper', 'Silver', 'Specter', 'Voodoo'];

export function generateRandomIdentity() {
  const first = RANDOM_FIRST_NAMES[Math.floor(Math.random() * RANDOM_FIRST_NAMES.length)];
  const last = RANDOM_LAST_NAMES[Math.floor(Math.random() * RANDOM_LAST_NAMES.length)];
  const alias = RANDOM_ALIASES[Math.floor(Math.random() * RANDOM_ALIASES.length)];
  
  return {
    name: `${first} ${last}`,
    alias: alias,
    heat: Math.floor(Math.random() * 4) + 2, // 2 to 5
    cred: Math.floor(Math.random() * 25) + 75, // 75 to 99
    cash: (Math.floor(Math.random() * 60) + 15) * 10000, // $150k - $750k
  };
}
