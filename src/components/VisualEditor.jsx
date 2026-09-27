import React, { useRef, useState, useEffect } from 'react';
import ImageEditor from '@unlayer/react-image-editor';
import { 
  Sparkles, Check, ArrowLeft, RotateCcw, AlertTriangle, 
  HelpCircle, Eye, Info, ShieldCheck, Flame, Palette,
  Crop, Type, Sliders, Smile, Frame, PenTool, RefreshCw
} from 'lucide-react';
import { presets } from '../data/presets';
import { ensureDataUrlWithVibe } from '../lib/image';

export default function VisualEditor({ character, onSave, onCancel }) {
  const editorRef = useRef(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorError, setEditorError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [preparedImage, setPreparedImage] = useState(null);
  const [preparingImage, setPreparingImage] = useState(true);

  const [missions, setMissions] = useState({
    1: 'CONFIRMED', // Frame The Subject (auto-centered framing initialized)
    2: 'CONFIRMED', // Apply Your Look (vibe color-grading applied)
    3: 'PENDING',   // Leave Your Mark (text/drawing/stickers)
  });
  const [calibrationVerified, setCalibrationVerified] = useState(false);

  const activePreset = presets.find((p) => p.id === character.preset) || presets[0];

  const toggleMission = (id) => {
    setMissions((prev) => {
      const current = prev[id];
      const next = current === 'CONFIRMED' ? 'PENDING' : 'CONFIRMED';
      return { ...prev, [id]: next };
    });
  };

  const completedCount = Object.values(missions).filter((s) => s === 'CONFIRMED').length;

  // Convert relative / external image sources to base64 Data URLs with vibe grading
  // This guarantees smooth canvas operation without CORS or relative iframe path issues.
  useEffect(() => {
    let isCancelled = false;
    setPreparingImage(true);
    setEditorError(null);

    ensureDataUrlWithVibe(character.image, character.preset)
      .then((dataUrl) => {
        if (!isCancelled) {
          setPreparedImage(dataUrl || character.image);
          setPreparingImage(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn('Image prep error, falling back:', err);
          setPreparedImage(character.image);
          setPreparingImage(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [character.image, character.preset]);

  const handleEditorSave = ({ dataUrl, blob }) => {
    setCalibrationVerified(true);
    setIsSaving(true);
    setTimeout(() => {
      onSave({ dataUrl, blob });
    }, 1400);
  };

  const handleManualSave = () => {
    try {
      setCalibrationVerified(true);
      setIsSaving(true);
      let targetUrl = preparedImage || character.image;
      if (editorRef.current && editorRef.current.editor) {
        const dataUrl = editorRef.current.editor.getImage();
        if (dataUrl) {
          targetUrl = dataUrl;
        }
      }
      setTimeout(() => {
        onSave({ dataUrl: targetUrl });
      }, 1400);
    } catch (err) {
      console.error('Error during manual save:', err);
      setTimeout(() => {
        onSave({ dataUrl: preparedImage || character.image });
      }, 1400);
    }
  };

  const handleReset = () => {
    if (editorRef.current && editorRef.current.editor) {
      try {
        editorRef.current.editor.reset(preparedImage || character.image);
      } catch (err) {
        console.warn('Reset error:', err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Studio Mission Intro Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="font-syne font-bold text-sm text-white flex items-center gap-2">
              <span>VISUAL STUDIO // YOUR PORTRAIT. YOUR STYLE. YOUR RULES.</span>
            </div>
            <p className="text-white/60 font-mono text-[11px] mt-0.5">
              Crop, color-grade, draw, add text or stickers to your operative's visual before compiling your official dossier.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-[10px]">
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70">
            NATIVE TOOLS ACTIVE
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#ff2a85]/15 border border-[#ff2a85]/30 text-[#ff5ea7] font-bold">
            #BuiltWithImageEditor
          </span>
        </div>
      </div>

      {/* Top HUD Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Character Quick Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Return to Setup"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg text-white uppercase tracking-tight">
                {character.name || 'CITIZEN'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff2a85]/20 text-[#ff5ea7] border border-[#ff2a85]/30">
                {character.role}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${activePreset.badgeBg}`}>
                {activePreset.name}
              </span>
            </div>
            <div className="text-xs font-mono text-white/50 flex items-center gap-2 mt-0.5">
              <span>UNLAYER ENGINE // REACT IMAGE EDITOR</span>
              <span className="text-white/20">•</span>
              <span
                className="flex items-center gap-1 transition-colors duration-300"
                style={{
                  color: editorLoaded ? '#00ff88' : preparingImage ? '#fbbf24' : '#00f0ff',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-300"
                  style={{
                    backgroundColor: editorLoaded ? '#00ff88' : preparingImage ? '#fbbf24' : '#00f0ff',
                  }}
                />
                {preparingImage
                  ? 'PREPARING IMAGE...'
                  : editorLoaded
                  ? 'CANVAS READY'
                  : 'LOADING CANVAS...'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-mono transition-all flex items-center gap-1.5"
            title="Reset edits back to original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            id="btn-save-design"
            onClick={handleManualSave}
            disabled={isSaving || preparingImage}
            className="px-5 py-2.5 rounded-xl btn-vice-primary font-syne font-bold text-xs tracking-wider uppercase text-white shadow-neon-pink flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>CALIBRATING DOSSIER...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>SAVE & FINISH DOSSIER</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Visual Calibration Mission Panel */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="text-[#00f0ff] font-bold tracking-widest uppercase">
              VISUAL CALIBRATION
            </span>
            <span className="text-white/40">// CREATIVE DIRECTIVES</span>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-white/60">CALIBRATION:</span>
            <span className="text-[#ff2a85] font-bold tracking-wider">
              {completedCount === 3 ? '● ● ● 3 / 3' : completedCount === 2 ? '● ● ○ 2 / 3' : '● ○ ○ 1 / 3'}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${completedCount === 3 ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40' : 'bg-white/10 text-white/70'}`}>
              {completedCount === 3 ? 'ALL CONFIRMED' : 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* 3 Mission Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* MISSION 01 */}
          <div
            onClick={() => toggleMission(1)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              missions[1] === 'CONFIRMED'
                ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 shadow-sm'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
            title="Click to toggle confirmation"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/50">MISSION 01</span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${missions[1] === 'CONFIRMED' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'bg-white/10 text-white/40'}`}>
                {missions[1] === 'CONFIRMED' ? 'USER CONFIRMED' : 'NOT STARTED'}
              </span>
            </div>
            <div>
              <div className="font-syne font-bold text-xs text-white flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>FRAME THE SUBJECT</span>
              </div>
              <p className="text-[11px] text-white/60 font-mono mt-0.5 leading-snug">
                Recompose framing using Unlayer crop & resize tools.
              </p>
            </div>
          </div>

          {/* MISSION 02 */}
          <div
            onClick={() => toggleMission(2)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              missions[2] === 'CONFIRMED'
                ? 'bg-[#ff2a85]/10 border-[#ff2a85]/40 shadow-sm'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
            title="Click to toggle confirmation"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/50">MISSION 02</span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${missions[2] === 'CONFIRMED' ? 'bg-[#ff2a85]/20 text-[#ff5ea7]' : 'bg-white/10 text-white/40'}`}>
                {missions[2] === 'CONFIRMED' ? 'USER CONFIRMED' : 'NOT STARTED'}
              </span>
            </div>
            <div>
              <div className="font-syne font-bold text-xs text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#ff2a85]" />
                <span>APPLY YOUR LOOK</span>
              </div>
              <p className="text-[11px] text-white/60 font-mono mt-0.5 leading-snug">
                Establish atmosphere with filters and visual grading.
              </p>
            </div>
          </div>

          {/* MISSION 03 */}
          <div
            onClick={() => toggleMission(3)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              missions[3] === 'CONFIRMED'
                ? 'bg-[#00ff88]/10 border-[#00ff88]/40 shadow-sm'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
            title="Click to toggle confirmation"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/50">MISSION 03</span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${missions[3] === 'CONFIRMED' ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-white/10 text-white/40'}`}>
                {missions[3] === 'CONFIRMED' ? 'USER CONFIRMED' : 'NOT STARTED'}
              </span>
            </div>
            <div>
              <div className="font-syne font-bold text-xs text-white flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#00ff88]" />
                <span>LEAVE YOUR MARK</span>
              </div>
              <p className="text-[11px] text-white/60 font-mono mt-0.5 leading-snug">
                Add text, drawing, stickers, or high-tech frames.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Main Canvas Frame */}
      <div className="relative rounded-2xl border-2 border-white/15 overflow-hidden shadow-2xl bg-[#0b0a12] min-h-[600px] flex flex-col">
        
        {/* Subtle Cyber scanline & corner accents */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none text-[10px] font-mono text-[#00f0ff]/80 bg-black/70 px-2 py-0.5 rounded border border-white/10">
          HUD // UNLAYER CANVAS 1080P
        </div>

        {/* Calibration Complete Verification State Overlay */}
        {calibrationVerified && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#07060e]/95 backdrop-blur-md text-white p-6 space-y-5 animate-fade-in">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-[#00ff88] border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-[#ff2a85] border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
            </div>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#00ff88] uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
                <span>CALIBRATION PROTOCOL</span>
              </div>
              <h2 className="font-syne font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                VISUAL CALIBRATION COMPLETE
              </h2>
            </div>

            {/* Verification Telemetry Checklist */}
            <div className="w-full max-w-sm bg-black/70 rounded-xl border border-white/15 p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">IMAGE STATUS</span>
                <span className="text-[#00ff88] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> VERIFIED
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">VISUAL EDIT</span>
                <span className="text-[#00f0ff] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> DETECTED
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">IDENTITY DNA</span>
                <span className="text-[#ff2a85] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> UPDATED
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-white/60">CALIBRATION</span>
                <span className="text-white font-bold tracking-wider">██████████ 100%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff] animate-pulse">
              <span>DOSSIER READY // COMMENCING COMPILATION SEQUENCE</span>
            </div>
          </div>
        )}

        {/* High-Tech Compiling State Overlay */}
        {isSaving && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0b0a12]/95 backdrop-blur-md text-white space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-[#ff2a85] border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-[#00f0ff] border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
            </div>
            <div className="text-center space-y-1">
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-[#00f0ff]">
                COMPILING VISUAL IDENTITY...
              </p>
              <p className="text-xs font-mono text-white/60">
                Encoding canvas pixels • Finalizing operative dossier
              </p>
            </div>
          </div>
        )}

        {/* Loading Visual Indicator */}
        {(preparingImage || (!editorLoaded && !editorError)) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b0a12] text-white space-y-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-[#ff2a85] border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-[#00f0ff] border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <div className="text-center space-y-1">
              <p className="font-mono text-xs uppercase tracking-widest text-[#00f0ff]">
                MOUNTING UNLAYER IMAGE EDITOR...
              </p>
              <p className="text-[10px] font-mono text-white/40">
                LOADING CANVASES • TOOLS • FILTERS • ASSETS
              </p>
            </div>
          </div>
        )}

        {/* Error Fallback Notice if load fails */}
        {editorError && (
          <div className="p-4 m-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 flex items-center justify-between z-30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Editor encountered an issue:</p>
                <p className="text-white/70">{editorError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditorError(null);
                  setPreparingImage(true);
                  ensureDataUrlWithVibe(character.image, character.preset)
                    .then((dataUrl) => {
                      setPreparedImage(dataUrl || character.image);
                      setPreparingImage(false);
                    })
                    .catch(() => {
                      setPreparedImage(character.image);
                      setPreparingImage(false);
                    });
                }}
                className="text-xs font-mono px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white"
              >
                Retry
              </button>
              <button
                onClick={onCancel}
                className="text-xs font-mono px-3 py-1 rounded bg-red-800/40 hover:bg-red-700/50 text-white"
              >
                Choose Another Image
              </button>
            </div>
          </div>
        )}

        {/* The Official Unlayer React Image Editor */}
        <div className="flex-1 w-full relative min-h-[600px] flex flex-col">
          {preparedImage && (
            <ImageEditor
              ref={editorRef}
              image={preparedImage}
              options={{
                theme: 'dark',
              }}
              onLoad={() => {
                setEditorLoaded(true);
              }}
              onSave={handleEditorSave}
              onCancel={onCancel}
              onLoadError={() => {
                console.error('Image failed to load in Unlayer Image Editor');
                setEditorError('The visual could not be loaded into canvas. Try resetting or selecting another demo image.');
              }}
              onError={(err) => {
                console.error('Unlayer Image Editor Error:', err);
                setEditorError(err.message || 'Image editor initialization error');
              }}
              minHeight={600}
              style={{
                width: '100%',
                flex: 1,
                minHeight: '600px',
                backgroundColor: '#0e0d17',
              }}
            />
          )}
        </div>

      </div>

      {/* Suggested Tool Guide Pills */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white/70 font-mono text-[11px]">
          <Info className="w-4 h-4 text-[#00f0ff] shrink-0" />
          <span className="font-bold">PRO TIPS FOR {activePreset.name.toUpperCase()}:</span>
          <span className="text-[#00f0ff] hidden md:inline">{activePreset.filterAdvice}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">CROP / ROTATE</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">NEON FILTERS</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">TEXT & TAGLINES</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">STICKERS & FRAMES</span>
        </div>
      </div>

    </div>
  );
}
