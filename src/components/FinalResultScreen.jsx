import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, Edit3, PlusCircle, Share2, Check, 
  Sparkles, ExternalLink, ShieldCheck, Trophy, Camera
} from 'lucide-react';
import ProfileCard from './ProfileCard';
import ExportProfileCard from './ExportProfileCard';
import { downloadElementAsPng, sanitizeFilename } from '../lib/download';

export default function FinalResultScreen({ character, editedImage, onEditAgain, onCreateAnother }) {
  // cardRef is the visible, responsive card (display only)
  const cardRef = useRef(null);
  // exportRef targets the hidden fixed-size card (download only)
  const exportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [copied, setCopied] = useState(false);

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
    if (!exportRef.current) return;
    try {
      setDownloading(true);
      setExportError(null);
      const safeName = sanitizeFilename(character.name || 'operative');
      const filename = `vice-city-profile-${safeName}.png`;
      // Target the fixed-size off-screen export card, NOT the responsive visible card
      const dataUrl = await downloadElementAsPng(exportRef.current, filename);
      if (typeof window !== 'undefined' && dataUrl) {
        window.__lastExportedDataUrl = dataUrl;
      }
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download error:', err);
      setExportError('Export encountered an issue. You can right-click the card to save it or try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const text = `Check out my custom Vice City character profile card: ${character.name} (${character.role})! Created with @UnlayerHQ React Image Editor. #BuiltWithImageEditor`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vice City Character Studio',
          text: text,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Hidden export card container — at (0,0) with opacity: 0 for full layout calculation */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1200px',
          height: '1600px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -50,
        }}
      >
        <ExportProfileCard
          exportRef={exportRef}
          character={character}
          editedImage={editedImage}
        />
      </div>
      
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-xs font-mono mb-4 animate-bounce">
          <ShieldCheck className="w-4 h-4" />
          <span>DOSSIER COMPILED // IDENTITY VERIFIED</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tight text-glow-pink">
          PROFILE READY.
        </h1>
        <p className="text-white/70 text-sm sm:text-base mt-2 font-light">
          Your custom Vice City street card is ready to export and share with the world.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: The Profile Card (visible / responsive with reveal animation) */}
        <div className="lg:col-span-7 flex justify-center relative animate-dossier-reveal">
          <div className="scan-sweep" />
          <ProfileCard
            cardRef={cardRef}
            character={character}
            editedImage={editedImage}
          />
        </div>

        {/* Right Column: Actions & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Action Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="font-syne font-bold text-lg text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
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
                  <span>DOWNLOAD PROFILE (PNG)</span>
                </>
              )}
            </button>

            {/* Note about export quality */}
            <p className="text-[10px] font-mono text-white/40 text-center -mt-2">
              Full 1200×1600px high-res export • 100% complete card • No clipping
            </p>

            {/* In-UI Export Error Notice */}
            {exportError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            {/* Edit Again Button */}
            <button
              id="btn-edit-again"
              onClick={onEditAgain}
              className="w-full py-3.5 rounded-xl btn-vice-outline font-syne font-semibold text-xs tracking-wider uppercase text-white/90 flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-[#00f0ff]" />
              <span>EDIT AGAIN IN UNLAYER STUDIO</span>
            </button>

            {/* Create Another Character Button */}
            <button
              id="btn-create-another"
              onClick={onCreateAnother}
              className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-syne font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-white/10 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#ff2a85]" />
              <span>CREATE ANOTHER CHARACTER</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span className="text-[#00ff88]">Copied share link to clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Profile Dossier</span>
                </>
              )}
            </button>

          </div>

          {/* Challenge Submission Callout Box */}
          <div className="glass-panel p-5 rounded-2xl border border-[#ff2a85]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#ff2a85] uppercase">
                #BuiltWithImageEditor
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                UNLAYER CHALLENGE
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              This card was created and stylized using <strong>@unlayer/react-image-editor</strong> with real canvas tools including filters, cropping, stickers, frames, and typography.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>Ready for Submission</span>
              <span className="text-[#00f0ff] font-bold">100% Client-Side</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

