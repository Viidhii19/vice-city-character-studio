import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, ChevronLeft, ChevronRight, Sparkles, 
  ShieldCheck, Eye, Sliders, Type, Flame, Zap, Award
} from 'lucide-react';
import { presets } from '../data/presets';
import { activities } from '../data/activities';
import { computeIdentityDNA, computeVisualDNAStats } from '../lib/identity';

export default function IdentityReplayModal({ character, editedImage, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activePreset = presets.find((p) => p.id === character.preset) || presets[0];
  const activeActivity = activities.find((a) => a.id === character.activity) || activities[3];
  const identityType = computeIdentityDNA(character.preset, character.activity);
  const visualDNA = computeVisualDNAStats(character.preset, character.activity, character);

  const steps = [
    {
      id: 'raw',
      title: '01 // RAW CITIZEN ASSET',
      subtitle: 'Original photographic source submitted to Vice City Records',
      badge: 'SOURCE INTAKE',
      content: (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-white/20 bg-black relative shadow-2xl">
            <img
              src={character.image}
              alt="Raw Asset"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/60 border border-white/10">
              RAW CAPTURE
            </div>
          </div>
          <div className="text-center">
            <div className="font-syne font-bold text-base text-white">{character.name || 'Anonymous Citizen'}</div>
            <div className="text-xs font-mono text-white/50">{character.role} • Uncalibrated</div>
          </div>
        </div>
      ),
    },
    {
      id: 'vibe',
      title: '02 // VIBE & LIGHTING CALIBRATION',
      subtitle: `Applied ${activePreset.name.toUpperCase()} atmospheric color matrix & neon grading`,
      badge: 'ENVIRONMENTAL GRADING',
      content: (
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 relative shadow-2xl transition-all"
            style={{ borderColor: activePreset.accent, boxShadow: `0 0 30px ${activePreset.glow}` }}
          >
            <img
              src={character.image}
              alt="Vibe Calibrated"
              className="w-full h-full object-cover"
              style={{
                filter: activePreset.id === 'neon-nights'
                  ? 'contrast(1.25) saturate(1.6) hue-rotate(-25deg)'
                  : activePreset.id === 'ocean-drive'
                  ? 'sepia(0.35) saturate(1.45) brightness(1.1)'
                  : activePreset.id === 'downtown-heat'
                  ? 'contrast(1.35) sepia(0.4) saturate(0.85)'
                  : activePreset.id === 'after-dark'
                  ? 'brightness(0.75) contrast(1.4) hue-rotate(180deg)'
                  : activePreset.id === 'sunset-boulevard'
                  ? 'saturate(1.7) brightness(1.05) hue-rotate(15deg)'
                  : 'grayscale(0.75) contrast(1.5)',
              }}
            />
            <div 
              className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
              style={{ backgroundColor: `${activePreset.accent}30`, borderColor: activePreset.accent, color: activePreset.accent }}
            >
              {activePreset.name.toUpperCase()}
            </div>
          </div>
          <div className="text-center font-mono text-xs" style={{ color: activePreset.accent }}>
            📍 {activePreset.location} • {activePreset.mood}
          </div>
        </div>
      ),
    },
    {
      id: 'calibration',
      title: '03 // VISUAL CALIBRATION MISSIONS',
      subtitle: 'Operative verified Framing, Color Atmosphere, and Personal Mark',
      badge: 'CALIBRATION PROTOCOL',
      content: (
        <div className="w-full max-w-md mx-auto space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
              <span className="text-white font-bold">MISSION 01: FRAME SUBJECT</span>
            </div>
            <span className="text-[#00f0ff] font-bold text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/15">
              CONFIRMED
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff2a85]" />
              <span className="text-white font-bold">MISSION 02: APPLY LOOK</span>
            </div>
            <span className="text-[#ff5ea7] font-bold text-[10px] px-2 py-0.5 rounded bg-[#ff2a85]/15">
              CONFIRMED
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
              <span className="text-white font-bold">MISSION 03: LEAVE MARK</span>
            </div>
            <span className="text-[#00ff88] font-bold text-[10px] px-2 py-0.5 rounded bg-[#00ff88]/15">
              CONFIRMED
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'unlayer',
      title: '04 // UNLAYER STUDIO PRODUCTION',
      subtitle: 'Native canvas customization compiled through Unlayer React Image Editor',
      badge: 'UNLAYER ENGINE',
      content: (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#00f0ff] relative shadow-2xl bg-black">
            <img
              src={editedImage || character.image}
              alt="Unlayer Calibrated"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-[#00f0ff] border border-[#00f0ff]/30">
              #BuiltWithImageEditor
            </div>
          </div>
          <div className="text-center font-mono text-xs text-white/70">
            Pixel data encoded • Client-side raster finalized
          </div>
        </div>
      ),
    },
    {
      id: 'dna',
      title: '05 // IDENTITY DNA SYNTHESIS',
      subtitle: `Underworld DNA archetype derived from ${activePreset.name} + ${activeActivity.title}`,
      badge: 'UNDERWORLD PROFILE',
      content: (
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="p-4 rounded-xl border bg-black/60 text-center" style={{ borderColor: `${activePreset.accent}50` }}>
            <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest">SYNTHESIZED ARCHETYPE</div>
            <div className="font-syne font-black text-2xl uppercase mt-1" style={{ color: activePreset.accent }}>
              {identityType}
            </div>
            <div className="text-xs font-mono text-white/60 mt-1">
              {activeActivity.routeStamp || `ROUTE // ${activeActivity.location?.toUpperCase()}`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {visualDNA.map((stat) => (
              <div key={stat.label} className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/60">{stat.label}</span>
                <span className="font-bold text-[#00f0ff]">{stat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'dossier',
      title: '06 // OFFICIAL CLASSIFIED DOSSIER',
      subtitle: 'Complete 1200×1600 high-resolution security dossier ready for export',
      badge: 'FINAL DOSSIER',
      content: (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] font-mono text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>IDENTITY VERIFIED & SECURED ON DATA MESH</span>
          </div>
          <div className="text-center font-syne font-black text-xl text-white uppercase tracking-tight">
            {character.name || 'ANONYMOUS CITIZEN'}
            {character.alias && <span className="text-[#ff2a85] ml-2">"{character.alias}"</span>}
          </div>
          <div className="text-xs font-mono text-white/50">
            SER: VC-{character.serial || '4821'} • 1200×1600 High-Res Verified
          </div>
        </div>
      ),
    },
  ];

  // Auto-play timeline
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentStep((p) => Math.min(steps.length - 1, p + 1));
      if (e.key === 'ArrowLeft') setCurrentStep((p) => Math.max(0, p - 1));
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, steps.length]);

  const activeStep = steps[currentStep];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#090812] border-2 border-white/20 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
        style={{
          boxShadow: `0 25px 80px rgba(0,0,0,0.9), 0 0 50px ${activePreset.glow}`,
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-syne font-black text-sm text-white tracking-widest uppercase">
                  IDENTITY REPLAY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                  {activeStep.badge}
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/40 mt-0.5">
                Cinematic transformation sequence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
            title="Close Replay (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Header */}
        <div className="text-center mb-6">
          <h3 className="font-syne font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
            {activeStep.title}
          </h3>
          <p className="text-xs font-mono text-white/60 mt-1 max-w-lg mx-auto">
            {activeStep.subtitle}
          </p>
        </div>

        {/* Step Visual Content Container */}
        <div className="min-h-[280px] flex items-center justify-center my-2">
          {activeStep.content}
        </div>

        {/* Timeline Stepper Pills */}
        <div className="flex items-center justify-center gap-2 my-6">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-10 bg-[#ff2a85] shadow-neon-pink'
                  : idx < currentStep
                  ? 'w-5 bg-[#00f0ff]/70'
                  : 'w-3 bg-white/20'
              }`}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Playback Controls Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-[#00ff88]" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <span className="text-white/40 text-[11px] hidden sm:inline">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentStep((p) => Math.max(0, p - 1));
                setIsPlaying(false);
              }}
              disabled={currentStep === 0}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white border border-white/10"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentStep((p) => Math.min(steps.length - 1, p + 1));
                setIsPlaying(false);
              }}
              disabled={currentStep === steps.length - 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white border border-white/10"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="ml-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-syne font-bold text-xs uppercase transition-all"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
