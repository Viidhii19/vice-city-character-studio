/**
 * Shareable Identity System
 *
 * Implements client-side, zero-backend shareable identity serialization,
 * platform share URLs (WhatsApp, X, LinkedIn, Instagram, Native Share),
 * and clipboard utilities with safe fallbacks.
 */

import { computeIdentityDNA } from './identity';
import { activities } from '../data/activities';

/**
 * Encodes a character object into a compact, URL-safe base64 string.
 * Strips huge binary data URLs if present to keep the link concise and browser-safe.
 */
export function encodeIdentityForUrl(character, serial) {
  try {
    const compactObj = {
      n: character.name || 'Anonymous',
      a: character.alias || '',
      r: character.role || 'Operative',
      p: character.preset || 'neon-nights',
      ac: character.activity || 'cruise-city',
      h: character.heat ?? 3,
      c: character.cred ?? 90,
      k: character.cash ?? 250000,
      s: serial || 'VC-9999',
      // If image is a local asset path, preserve it. If it's a huge dataUrl, omit from URL to prevent 2MB URLs
      img: typeof character.image === 'string' && character.image.startsWith('/assets/') ? character.image : null,
    };
    const jsonStr = JSON.stringify(compactObj);
    // Base64 encode in a URL-safe format
    if (typeof window !== 'undefined' && window.btoa) {
      return encodeURIComponent(window.btoa(unescape(encodeURIComponent(jsonStr))));
    }
    return encodeURIComponent(jsonStr);
  } catch (err) {
    console.warn('[share] encodeIdentityForUrl error:', err);
    return '';
  }
}

/**
 * Decodes a URL-encoded identity string back into a character object.
 */
export function decodeIdentityFromUrl(encodedString) {
  if (!encodedString || typeof encodedString !== 'string') return null;
  try {
    const decodedUri = decodeURIComponent(encodedString);
    let jsonStr = decodedUri;
    if (typeof window !== 'undefined' && window.atob) {
      try {
        jsonStr = decodeURIComponent(escape(window.atob(decodedUri)));
      } catch {
        // Fallback if not base64
        jsonStr = decodedUri;
      }
    }
    const data = JSON.parse(jsonStr);
    if (!data || !data.n) return null;

    return {
      name: data.n,
      alias: data.a || '',
      role: data.r || 'Operative',
      preset: data.p || 'neon-nights',
      activity: data.ac || 'cruise-city',
      heat: data.h ?? 3,
      cred: data.c ?? 90,
      cash: data.k ?? 250000,
      serial: data.s || 'VC-9999',
      image: data.img || '/assets/characters/mia.jpg',
      isSharedDossier: true,
    };
  } catch (err) {
    console.warn('[share] decodeIdentityFromUrl error:', err);
    return null;
  }
}

/**
 * Gets the current base application URL
 */
export function getBaseAppUrl() {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}${window.location.pathname.replace(/\/identity\/.*$/, '')}`;
  }
  return 'https://vice-city-character-studio.vercel.app';
}

/**
 * Generates the full public shareable URL for an identity.
 */
export function generateShareUrl(character, serial) {
  const baseUrl = getBaseAppUrl();
  const encoded = encodeIdentityForUrl(character, serial);
  return `${baseUrl}?id=${encoded}&serial=${serial || 'VC-9999'}`;
}

/**
 * Formats a clean, high-impact text representation of the dossier.
 */
export function generateIdentitySummaryText(character, serial) {
  const activeActivity = activities.find(a => a.id === character.activity) || activities[3];
  const identityType = computeIdentityDNA(character.preset, character.activity);
  const routeStamp = activeActivity.routeStamp || `ROUTE // ${activeActivity.location?.toUpperCase()} • SEC-07`;
  const shareUrl = generateShareUrl(character, serial);

  return [
    `VICE CITY METROPOLITAN // CITIZEN DOSSIER`,
    `IDENT: ${character.name?.toUpperCase() || 'ANONYMOUS'}${character.alias ? ` // "${character.alias.toUpperCase()}"` : ''}`,
    `ROLE: ${character.role?.toUpperCase()} | ARCHETYPE: ${identityType}`,
    `${routeStamp}`,
    `HEAT: ${character.heat || 3}/5 | STREET CRED: ${character.cred || 90} | CASH: $${((character.cash || 0) / 1000).toFixed(0)}K`,
    `SER: VC-${serial || '4821'} | #BuiltWithImageEditor`,
    ``,
    `Inspect Classified Dossier:`,
    `${shareUrl}`,
  ].join('\n');
}

/**
 * Generates a WhatsApp share URL with pre-filled dynamic dossier text.
 */
export function generateWhatsAppShareUrl(character, serial) {
  const identityType = computeIdentityDNA(character.preset, character.activity);
  const activeActivity = activities.find(a => a.id === character.activity) || activities[3];
  const shareUrl = generateShareUrl(character, serial);

  const message = [
    `I just created my Vice City identity.`,
    ``,
    `${character.name || 'ANONYMOUS'}${character.alias ? ` // "${character.alias}"` : ''}`,
    `${identityType}`,
    `${activeActivity.district || activeActivity.location || 'OCEAN DRIVE'}`,
    ``,
    `Create yours:`,
    `${shareUrl}`,
  ].join('\n');

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

/**
 * Generates an X / Twitter share URL with dynamic text and challenge hashtags.
 */
export function generateTwitterShareUrl(character, serial) {
  const identityType = computeIdentityDNA(character.preset, character.activity);
  const activeActivity = activities.find(a => a.id === character.activity) || activities[3];
  const shareUrl = generateShareUrl(character, serial);

  const text = `I just created my Vice City identity.\n\n${character.name?.toUpperCase() || 'OPERATIVE'} // ${identityType}\n${activeActivity.district || 'OCEAN DRIVE'}\n\nBuilt with Unlayer.\n#BuiltWithImageEditor`;

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
}

/**
 * Generates a LinkedIn share URL.
 */
export function generateLinkedInShareUrl(character, serial) {
  const shareUrl = generateShareUrl(character, serial);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
}

/**
 * Safe clipboard copy with fallback for older browsers or restricted iframe contexts.
 */
export async function copyTextToClipboard(text) {
  if (!text) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('[share] navigator.clipboard failed, attempting fallback:', err);
    }
  }

  // Fallback for browsers without navigator.clipboard or inside iframe
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error('[share] Fallback copy failed:', fallbackErr);
    return false;
  }
}

/**
 * Native Web Share invocation with feature detection.
 */
export async function invokeNativeShare(shareData) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      return { success: false, error: err };
    }
  }
  return { success: false, unsupported: true };
}
