import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { presets } from '../data/presets';
import { activities } from '../data/activities';
import { computeIdentityDNA } from '../lib/identity';

/**
 * CompilationScreen
 *
 * A full-screen cinematic transition shown after the user saves from the
 * Unlayer Image Editor. It bridges the editor → final dossier experience
 * by making the identity "compilation" feel earned and intentional.
 *
 * Duration: ~2.2s total (controlled by App.jsx timeout).
 * Phases:
 *   0 — SCANNING VISUAL IDENTITY...  (0 – 450ms)
 *   1 — COMPILING DOSSIER...         (450 – 1300ms, data rows appear)
 *   2 — IDENTITY COMPILED            (1300ms+, all rows visible + check icon)
 */
export default function CompilationScreen({ character }) {
  const [phase, setPhase] = useState(0);

  const activePreset  = presets.find(p => p.id === character.preset)     || presets[0];
  const activeActivity = activities.find(a => a.id === character.activity) || activities[3];
  const identityType   = computeIdentityDNA(character.preset, character.activity);

  // Deterministic serial — identical algorithm to ProfileCard / ExportProfileCard
  const stableSerial = React.useMemo(() => {
    let hash = 0;
    const str = `${character.name || 'citizen'}-${character.alias || 'ghost'}-${character.role || 'operative'}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 9000) + 1000;
  }, [character.name, character.alias, character.role]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 450);
    const t2 = setTimeout(() => setPhase(2), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const dataRows = [
    { label: 'VIBE',     value: activePreset.name.toUpperCase(),       color: activePreset.accent,          show: phase >= 1 },
    { label: 'DISTRICT', value: activePreset.location.toUpperCase(),   color: 'rgba(255,255,255,0.75)',     show: phase >= 1 },
    { label: 'ROUTE',    value: activeActivity.title.toUpperCase(),    color: 'rgba(255,255,255,0.75)',     show: phase >= 1 },
    { label: 'ENERGY',   value: activeActivity.energy.toUpperCase(),   color: '#fbbf24',                   show: phase >= 2 },
    { label: 'IDENTITY', value: identityType,                          color: activePreset.accent,          show: phase >= 2 },
    { label: 'SERIAL',   value: `VC-${stableSerial}`,                  color: '#00f0ff',                   show: phase >= 2 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#06050a] flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Vibe-reactive ambient glow */}
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full blur-[180px] pointer-events-none"
        style={{ backgroundColor: activePreset.accent, opacity: 0.10 }}
      />
      <div
        className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full blur-[160px] pointer-events-none"
        style={{ backgroundColor: activePreset.secondary, opacity: 0.07 }}
      />

      {/* Subtle scanline texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-7 max-w-sm w-full px-6">

        {/* Concentric spinner */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div
            className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${activePreset.accent} transparent transparent transparent` }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-b-transparent animate-spin"
            style={{
              borderColor: `transparent transparent ${activePreset.secondary} transparent`,
              animationDuration: '1.4s',
              animationDirection: 'reverse',
            }}
          />
          {/* Icon centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            {phase === 2 ? (
              <ShieldCheck className="w-7 h-7" style={{ color: activePreset.accent }} />
            ) : (
              <span
                className="font-mono text-xs font-black"
                style={{ color: activePreset.accent }}
              >
                VC
              </span>
            )}
          </div>
        </div>

        {/* Status headline */}
        <div className="text-center space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
            {phase === 0
              ? 'SCANNING VISUAL IDENTITY...'
              : phase === 1
              ? 'COMPILING DOSSIER...'
              : 'IDENTITY COMPILED'}
          </p>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight text-white leading-none">
            {character.name || 'OPERATIVE'}
          </h1>
          <p className="font-mono text-xs" style={{ color: activePreset.accent }}>
            &ldquo;{character.alias || 'GHOST'}&rdquo;&nbsp;&nbsp;&middot;&nbsp;&nbsp;{character.role}
          </p>
        </div>

        {/* Data compilation rows */}
        <div className="w-full space-y-1.5">
          {dataRows.map(({ label, value, color, show }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-2 rounded-lg border"
              style={{
                borderColor: show ? 'rgba(255,255,255,0.08)' : 'transparent',
                backgroundColor: show ? 'rgba(255,255,255,0.04)' : 'transparent',
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(5px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease, border-color 0.4s ease, background-color 0.4s ease',
              }}
            >
              <span className="font-mono text-[10px] text-white/35 tracking-[0.2em]">{label}</span>
              <span
                className="font-mono text-[11px] font-bold tracking-wider"
                style={{ color: show ? color : 'transparent' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {phase === 2 && (
          <p
            className="text-[11px] font-mono text-white/30 animate-pulse"
            style={{ animationDuration: '1.2s' }}
          >
            Revealing dossier...
          </p>
        )}
      </div>
    </div>
  );
}
