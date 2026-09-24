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
