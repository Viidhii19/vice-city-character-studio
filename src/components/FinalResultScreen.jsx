import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, Edit3, PlusCircle, Share2, Check, 
  Sparkles, ExternalLink, ShieldCheck, Trophy, Camera,
  RefreshCw, Globe, Send, Copy, Play, X, Info
} from 'lucide-react';
import ProfileCard from './ProfileCard';
import ExportProfileCard from './ExportProfileCard';
import IdentityReplayModal from './IdentityReplayModal';
import { downloadElementAsPng, sanitizeFilename } from '../lib/download';
import { presets } from '../data/presets';
import { activities } from '../data/activities';
import { computeIdentityDNA, computeVisualDNAStats } from '../lib/identity';
import { 
  generateIdentitySummaryText, 
  generateWhatsAppShareUrl, 
  generateTwitterShareUrl, 
  generateLinkedInShareUrl,
  generateShareUrl,
  copyTextToClipboard,
  invokeNativeShare 
} from '../lib/share';

export default function FinalResultScreen({ character, editedImage, onEditAgain, onCreateAnother }) {
  // cardRef is the visible, responsive card (display only)
  const cardRef = useRef(null);
  // exportRef targets the hidden fixed-size card (download only)
  const exportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportError, setExportError] = useState(null);
  
  // Modals & feedback states
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Identity data for the right-column compiled summary
  const activePreset = presets.find(p => p.id === character.preset) || presets[0];
  const activeActivity = activities.find(a => a.id === character.activity) || activities[3];
  const identityType = computeIdentityDNA(character.preset, character.activity);
  const visualDNA = computeVisualDNAStats(character.preset, character.activity, character);

  const stableSerial = React.useMemo(() => {
    let hash = 0;
    const str = `${character.name || 'citizen'}-${character.alias || 'ghost'}-${character.role || 'operative'}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 9000) + 1000;
  }, [character.name, character.alias, character.role]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff2a85', '#00f0ff', '#8a2be2', '#ffd000', '#ffffff'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  const handleDownload = async () => {
    const targetNode = exportRef.current || cardRef.current;
    if (!targetNode) return;
    try {
      setDownloading(true);
      setExportError(null);
      const safeName = sanitizeFilename(character.name || 'operative');
      const filename = `vice-city-profile-${safeName}.png`;
      const dataUrl = await downloadElementAsPng(targetNode, filename);
      if (typeof window !== 'undefined' && dataUrl) {
        window.__lastExportedDataUrl = dataUrl;
      }
      setDownloadSuccess(true);
      showToast('DOSSIER 1200×1600 PNG SAVED');
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download error with exportRef, trying fallback:', err);
      if (cardRef.current && targetNode !== cardRef.current) {
        try {
          const safeName = sanitizeFilename(character.name || 'operative');
          const filename = `vice-city-profile-${safeName}.png`;
          await downloadElementAsPng(cardRef.current, filename);
          setDownloadSuccess(true);
          showToast('DOSSIER SAVED (COMPACT RESOLUTION)');
          setTimeout(() => setDownloadSuccess(false), 4000);
          return;
        } catch (fallbackErr) {
          console.error('Fallback export also failed:', fallbackErr);
        }
      }
      setExportError('Export encountered an issue. You can right-click the card to save it or try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = generateShareUrl(character, stableSerial);
    const ok = await copyTextToClipboard(shareUrl);
    if (ok) {
      showToast('LINK COPIED');
    } else {
      showToast('COULD NOT COPY LINK');
    }
  };

  const handleCopyIdentity = async () => {
    const text = generateIdentitySummaryText(character, stableSerial);
    const ok = await copyTextToClipboard(text);
    if (ok) {
      showToast('IDENTITY COPIED');
    } else {
      showToast('COULD NOT COPY IDENTITY');
    }
  };

  const handleNativeShare = async () => {
    const text = generateIdentitySummaryText(character, stableSerial);
    const shareUrl = generateShareUrl(character, stableSerial);
    const result = await invokeNativeShare({
      title: `${character.name} // Vice City Citizen Dossier`,
      text,
      url: shareUrl,
    });
    if (result.success) {
      showToast('SHARED SUCCESSFULLY');
    } else if (result.unsupported) {
      handleCopyLink();
    }
  };

  const handleInstagramClick = async () => {
    // If mobile device supports sharing files directly, prompt download + share instructions
    setShowInstagramModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Floating Inline Toast Notification */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-black/95 border border-[#00f0ff] text-[#00f0ff] font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce"
        >
          <Check className="w-4 h-4 text-[#00ff88]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Identity Replay Modal */}
      {showReplayModal && (
        <IdentityReplayModal
          character={character}
          editedImage={editedImage}
          onClose={() => setShowReplayModal(false)}
        />
      )}

      {/* Instagram Share Guidance Modal */}
      {showInstagramModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInstagramModal(false);
          }}
        >
          <div className="relative w-full max-w-md rounded-2xl bg-[#090812] border-2 border-white/20 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#ff2a85]/20 border border-[#ff2a85]/40 text-[#ff2a85] mx-auto flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-syne font-black text-xl text-white uppercase">
                DOSSIER READY FOR INSTAGRAM
              </h3>
              <p className="text-xs font-mono text-white/60">
                Instagram does not permit direct web browser uploads. Follow these 2 simple steps:
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 text-left font-mono text-xs space-y-2 border border-white/10">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#ff2a85] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                <span>Download your official <strong>1200×1600</strong> high-res portrait card.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00f0ff] text-black flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                <span>Open Instagram, post to Stories or Feed, and tag <strong>#BuiltWithImageEditor</strong>.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowInstagramModal(false);
                  handleDownload();
                }}
                className="flex-1 py-3 rounded-xl btn-vice-primary font-syne font-bold text-xs uppercase text-white shadow-neon-pink flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Dossier Now</span>
              </button>

              <button
                onClick={() => setShowInstagramModal(false)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Off-screen fixed 1200x1600 export card container */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: '-99999px',
          width: '1200px',
          height: '1600px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999,
          opacity: 1,
          visibility: 'visible',
        }}
      >
        <ExportProfileCard
          exportRef={exportRef}
          character={character}
          editedImage={editedImage}
        />
      </div>
      
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-xs font-mono mb-3 animate-bounce">
          <ShieldCheck className="w-4 h-4" />
          <span>DOSSIER COMPILED // IDENTITY VERIFIED</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight text-glow-pink">
          PROFILE READY.
        </h1>
        <p className="text-white/70 text-xs sm:text-sm mt-1.5 font-light">
          Your custom Vice City street card is calibrated and ready to export or share.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: The Profile Card (visible / responsive with reveal animation) */}
        <div className="lg:col-span-6 flex justify-center relative animate-dossier-reveal">
          <div className="scan-sweep" />
          <ProfileCard
            cardRef={cardRef}
            character={character}
            editedImage={editedImage}
          />
        </div>

        {/* Right Column: Actions, DNA, Route, Network, & Sharing */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* 1. Compiled Identity & Environmental Route Consequence */}
          <div
            className="glass-panel p-5 rounded-2xl border"
            style={{ borderColor: `${activePreset.accent}40` }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">COMPILED IDENTITY</div>
                <div
                  className="font-syne font-black text-2xl uppercase tracking-tight mt-0.5"
                  style={{ color: activePreset.accent }}
                >
                  {identityType}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-white/40 uppercase">SERIAL ID</div>
                <div className="font-mono text-xs font-bold" style={{ color: activePreset.accent }}>
                  VC-{stableSerial}
                </div>
              </div>
            </div>

            {/* Environmental Route Consequence Stamp */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-white/40 text-[10px] uppercase">ENVIRONMENTAL STAMP:</span>
                <div className="text-[#00f0ff] font-bold">
                  {activeActivity.routeStamp || `ROUTE // ${activeActivity.location?.toUpperCase()} • SEC-07`}
                </div>
              </div>
              <div className="text-[10px] text-white/50">
                <span>{character.name || 'OPERATIVE'} • {character.role}</span>
              </div>
            </div>
          </div>

          {/* 2. Visual DNA Telemetry Matrix */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff2a85]" />
                <span className="font-syne font-bold text-white uppercase">VISUAL DNA MATRIX</span>
              </div>
              <span className="text-[10px] text-white/40">CALIBRATION ENGINE</span>
            </div>

            {/* 5-Attribute Visual DNA Bars */}
            <div className="space-y-2 font-mono text-xs">
              {visualDNA.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">{stat.label}</span>
                    <span className="font-bold text-[#00f0ff]">{stat.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${stat.value}%`,
                        backgroundColor: stat.label === 'HEAT' ? '#fbbf24' : stat.label === 'STYLE' ? activePreset.accent : '#00f0ff',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Calibration Directive Status */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
              <span className="flex items-center gap-1.5 text-[#00ff88]">
                <Check className="w-3.5 h-3.5" /> VISUAL CALIBRATION 03/03 CONFIRMED
              </span>
              <span>UNLAYER CANVAS READY</span>
            </div>
          </div>

          {/* 3. City Network Status */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest pb-1.5 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#00f0ff]" />
                <span>VICE CITY NETWORK // TELEMETRY</span>
              </span>
              <span className="text-[#00ff88]">ACTIVE MESH</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-white/40 block text-[9px]">DISTRICT</span>
                <span className="text-white font-bold">{activeActivity.district || 'OCEAN DRIVE'}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[9px]">ROUTE</span>
                <span className="text-white font-bold">{activeActivity.circuit || 'NIGHT CIRCUIT'}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[9px]">SECTOR</span>
                <span className="text-white font-bold">{activeActivity.sector || 'SEC-07'}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[9px]">SECURITY</span>
                <span className="text-[#00ff88] font-bold">LEVEL 4</span>
              </div>
            </div>
          </div>

          {/* 4. Main Export & Primary Action Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3.5">
            <h2 className="font-syne font-bold text-base text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Export & Actions</span>
            </h2>

            {/* Primary Download Button */}
            <button
              id="btn-download-profile"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-4 rounded-xl btn-vice-primary font-syne font-bold text-sm tracking-wider uppercase text-white shadow-neon-pink flex items-center justify-center gap-2.5 transition-all group"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>EXPORTING 1200×1600 HIGH-RES PNG...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-5 h-5 text-[#00ff88]" />
                  <span>DOWNLOADED SUCCESSFULLY!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>DOWNLOAD DOSSIER (1200×1600 PNG)</span>
                </>
              )}
            </button>

            {/* In-UI Export Error Notice */}
            {exportError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            {/* Identity Replay Cinematic Button */}
            <button
              onClick={() => setShowReplayModal(true)}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-[#00f0ff]/40 transition-all"
            >
              <Play className="w-4 h-4 text-[#00f0ff]" />
              <span>IDENTITY REPLAY (TRANSFORMATION STORY)</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Edit Again Button */}
              <button
                id="btn-edit-again"
                onClick={onEditAgain}
                className="py-3 px-4 rounded-xl btn-vice-outline font-syne font-semibold text-xs tracking-wider uppercase text-white/90 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4 text-[#00f0ff]" />
                <span>EDIT IN UNLAYER</span>
              </button>

              {/* Create Another Character Button */}
              <button
                id="btn-create-another"
                onClick={onCreateAnother}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-syne font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-[#ff2a85]" />
                <span>NEW IDENTITY</span>
              </button>
            </div>
          </div>

          {/* 5. Share Your Identity System */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-syne font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#ff2a85]" />
                <span>SHARE YOUR IDENTITY</span>
              </h3>
              <span className="text-[10px] font-mono text-white/40">#BuiltWithImageEditor</span>
            </div>

            {/* Platform Sharing Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <a
                href={generateWhatsAppShareUrl(character, stableSerial)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-all text-[11px]"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={generateTwitterShareUrl(character, stableSerial)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 font-bold flex items-center justify-center gap-1.5 transition-all text-[11px]"
              >
                <span>X (Twitter)</span>
              </a>

              <a
                href={generateLinkedInShareUrl(character, stableSerial)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center gap-1.5 transition-all text-[11px]"
              >
                <span>LinkedIn</span>
              </a>

              <button
                onClick={handleInstagramClick}
                aria-label="Share on Instagram"
                className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-bold flex items-center justify-center gap-1.5 transition-all text-[11px]"
              >
                <span>Instagram</span>
              </button>
            </div>

            {/* Copy Link, Copy Identity & Native Share */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-[11px]"
              >
                <Copy className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={handleCopyIdentity}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-[11px]"
              >
                <Copy className="w-3.5 h-3.5 text-[#ff2a85]" />
                <span>Copy Identity</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-[11px]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#00ff88]" />
                <span>Native Share</span>
              </button>
            </div>
          </div>

          {/* 6. Challenge Callout Box */}
          <div className="glass-panel p-4 rounded-2xl border border-[#ff2a85]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#ff2a85] uppercase">
                #BuiltWithImageEditor
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                UNLAYER CHALLENGE
              </span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
              This card was created and stylized using <strong>@unlayer/react-image-editor</strong> with real canvas tools including filters, cropping, stickers, frames, and typography.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
