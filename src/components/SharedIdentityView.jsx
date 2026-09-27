import React, { useRef, useState } from 'react';
import { 
  ShieldCheck, ArrowRight, Download, Share2, Sparkles, 
  MapPin, Check, ExternalLink, Globe, Lock
} from 'lucide-react';
import ProfileCard from './ProfileCard';
import ExportProfileCard from './ExportProfileCard';
import { downloadElementAsPng, sanitizeFilename } from '../lib/download';
import { presets } from '../data/presets';
import { activities } from '../data/activities';
import { computeIdentityDNA, computeVisualDNAStats } from '../lib/identity';
import { 
  generateIdentitySummaryText, 
  generateWhatsAppShareUrl, 
  generateTwitterShareUrl, 
  generateLinkedInShareUrl,
  copyTextToClipboard,
  invokeNativeShare 
} from '../lib/share';

export default function SharedIdentityView({ character, onCreateOwn }) {
  const cardRef = useRef(null);
  const exportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const activePreset = presets.find((p) => p.id === character.preset) || presets[0];
  const activeActivity = activities.find((a) => a.id === character.activity) || activities[3];
  const identityType = computeIdentityDNA(character.preset, character.activity);
  const visualDNA = computeVisualDNAStats(character.preset, character.activity, character);
  const stableSerial = character.serial || '4821';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = async () => {
    const targetNode = exportRef.current || cardRef.current;
    if (!targetNode) return;
    try {
      setDownloading(true);
      const safeName = sanitizeFilename(character.name || 'operative');
      const filename = `vice-city-profile-${safeName}.png`;
      await downloadElementAsPng(targetNode, filename);
      setDownloadSuccess(true);
      showToast('DOSSIER DOWNLOADED');
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      showToast('DOWNLOAD FAILED - RETRYING');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    const ok = await copyTextToClipboard(url);
    if (ok) showToast('LINK COPIED TO CLIPBOARD');
  };

  const handleCopyIdentity = async () => {
    const text = generateIdentitySummaryText(character, stableSerial);
    const ok = await copyTextToClipboard(text);
    if (ok) showToast('IDENTITY TEXT COPIED');
  };

  const handleNativeShare = async () => {
    const text = generateIdentitySummaryText(character, stableSerial);
    const result = await invokeNativeShare({
      title: `${character.name} // Vice City Citizen Dossier`,
      text,
      url: window.location.href,
    });
    if (result.success) {
      showToast('SHARED SUCCESSFULLY');
    } else if (result.unsupported) {
      handleCopyLink();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-black/90 border border-[#00f0ff] text-[#00f0ff] font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#00ff88]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Public Identity Network */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] shrink-0">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-syne font-black text-sm text-white uppercase tracking-wider">
                VICE CITY IDENTITY NETWORK
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
                VERIFIED DOSSIER
              </span>
            </div>
            <p className="text-white/60 font-mono text-xs mt-0.5">
              Public security record // Serial VC-{stableSerial}
            </p>
          </div>
        </div>

        <button
          onClick={onCreateOwn}
          className="w-full sm:w-auto px-6 py-3 rounded-xl btn-vice-primary font-syne font-bold text-xs tracking-wider uppercase text-white shadow-neon-pink flex items-center justify-center gap-2 transition-all"
        >
          <span>CREATE YOUR OWN IDENTITY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Card & Dossier Intel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Responsive Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[460px]">
            <ProfileCard
              cardRef={cardRef}
              character={character}
              editedImage={character.image}
            />
          </div>
        </div>

        {/* Right Column: Identity Dossier Intel & Sharing */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Identity Dossier Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest">
                  IDENTITY PROFILE
                </span>
                <h1 className="font-syne font-black text-3xl text-white uppercase mt-0.5">
                  {character.name || 'ANONYMOUS'}
                  {character.alias && (
                    <span className="text-[#ff2a85] ml-2">"{character.alias}"</span>
                  )}
                </h1>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/40 block">SER: VC-{stableSerial}</span>
                <span className="text-xs font-mono font-bold text-[#00ff88] flex items-center justify-end gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE
                </span>
              </div>
            </div>

            {/* Archetype & Route Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-white/40 text-[10px] uppercase">COMPILED IDENTITY TYPE</span>
                <div className="font-syne font-bold text-sm text-white uppercase" style={{ color: activePreset.accent }}>
                  {identityType}
                </div>
                <div className="text-[11px] text-white/50">{character.role} • {activePreset.name}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-white/40 text-[10px] uppercase">ENVIRONMENTAL ROUTE</span>
                <div className="font-syne font-bold text-sm text-white uppercase">
                  {activeActivity.title}
                </div>
                <div className="text-[11px] text-[#00f0ff]">
                  {activeActivity.routeStamp || `ROUTE // ${activeActivity.location?.toUpperCase()} • SEC-07`}
                </div>
              </div>
            </div>

            {/* Visual DNA Telemetry */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/60">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff2a85]" />
                  <span>IDENTITY DNA MATRIX</span>
                </span>
                <span className="text-[10px] text-white/40">DETERMINISTIC TELEMETRY</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                {visualDNA.map((dna) => (
                  <div key={dna.label} className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-center">
                    <div className="text-[10px] text-white/40">{dna.label}</div>
                    <div className="font-syne font-bold text-sm text-[#00f0ff] mt-0.5">{dna.value}%</div>
                    <div className="text-[8px] text-white/30 truncate mt-0.5">{dna.bar}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* City Network Telemetry */}
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs space-y-1.5">
              <div className="text-[10px] text-white/40 uppercase tracking-widest flex items-center justify-between">
                <span>VICE CITY DATA MESH // TELEMETRY</span>
                <span className="text-[#00ff88]">NODE-08 ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-white/10">
                <div>
                  <span className="text-white/40 block">DISTRICT</span>
                  <span className="text-white font-bold">{activeActivity.district || 'OCEAN DRIVE'}</span>
                </div>
                <div>
                  <span className="text-white/40 block">CIRCUIT</span>
                  <span className="text-white font-bold">{activeActivity.circuit || 'NIGHT CIRCUIT'}</span>
                </div>
                <div>
                  <span className="text-white/40 block">SECTOR</span>
                  <span className="text-white font-bold">{activeActivity.sector || 'SEC-07'}</span>
                </div>
                <div>
                  <span className="text-white/40 block">STATUS</span>
                  <span className="text-[#00ff88] font-bold">VERIFIED</span>
                </div>
              </div>
            </div>

          </div>

          {/* Share & Actions Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-syne font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#ff2a85]" />
              <span>SHARE THIS IDENTITY</span>
            </h3>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <a
                href={generateWhatsAppShareUrl(character, stableSerial)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={generateTwitterShareUrl(character, stableSerial)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>X (Twitter)</span>
              </a>

              <a
                href={generateLinkedInShareUrl(character, stableSerial)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>LinkedIn</span>
              </a>

              <button
                onClick={handleNativeShare}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Copy & Download Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <span>Copy Link</span>
              </button>

              <button
                onClick={handleCopyIdentity}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <span>Copy Identity</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="p-3 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] font-mono text-xs font-bold border border-[#00f0ff]/30 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Exporting...' : 'Download Dossier'}</span>
              </button>
            </div>

            {/* Big Prominent Call to Action */}
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                onClick={onCreateOwn}
                className="w-full py-4 rounded-xl btn-vice-primary font-syne font-black text-sm tracking-wider uppercase text-white shadow-neon-pink flex items-center justify-center gap-2 transition-all"
              >
                <span>CREATE YOUR OWN VICE CITY IDENTITY →</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Hidden 1200x1600 Export Card Node for PNG Download */}
      <div 
        style={{
          position: 'fixed',
          left: '-99999px',
          top: '-99999px',
          width: '1200px',
          height: '1600px',
          overflow: 'hidden',
          zIndex: -1,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <ExportProfileCard
          exportRef={exportRef}
          character={character}
          editedImage={character.image}
        />
      </div>

    </div>
  );
}
