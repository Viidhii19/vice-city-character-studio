import { toPng } from 'html-to-image';

/**
 * Sanitizes a string for use in a file name
 */
export function sanitizeFilename(name) {
  if (!name) return 'character';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Downloads a DOM node as a PNG image.
 *
 * If the element has an explicit inline width/height style (e.g. the ExportProfileCard
 * which is 1200×1600), those values are passed to html-to-image so the output image
 * exactly matches the fixed design rather than the browser-computed layout.
 *
 * Falls back to skipFonts=true if the first attempt fails (common with custom fonts).
 */
export async function downloadElementAsPng(element, filename = 'vice-city-profile.png') {
  if (!element) {
    throw new Error('Element not provided for download');
  }

  // If the element declares explicit inline px dimensions, use them.
  // This ensures the exported PNG matches the fixed ExportProfileCard dimensions
  // regardless of scroll position or viewport size.
  const inlineWidth  = element.style?.width  ? parseInt(element.style.width,  10) : null;
  const inlineHeight = element.style?.height ? parseInt(element.style.height, 10) : null;

  const exportOptions = {
    quality: 0.98,
    pixelRatio: 1, // Card is natively 1200x1600 high-res
    cacheBust: false,
    skipFonts: true, // Prevents SecurityError on cross-origin stylesheet rules
    ...(inlineWidth  ? { width:  inlineWidth  } : {}),
    ...(inlineHeight ? { height: inlineHeight } : {}),
    filter: (node) => {
      // Exclude elements with 'no-export' class
      if (node.classList && node.classList.contains('no-export')) {
        return false;
      }
      return true;
    },
  };

  try {
    const dataUrl = await toPng(element, exportOptions);
    triggerDownload(dataUrl, filename);
    return dataUrl;
  } catch (error) {
    console.error('Export attempt failed:', error);
    throw error;
  }
}

function triggerDownload(dataUrl, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
