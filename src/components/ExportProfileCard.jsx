import React from 'react';
import {
  Shield, Sparkles, Terminal, Gauge, Briefcase,
  Camera, Ship, Crosshair, DollarSign,
  Waves, Coffee, Dumbbell, Car, Anchor,
} from 'lucide-react';
import { presets } from '../data/presets';
import { activities } from '../data/activities';
import { ensureDataUrl } from '../lib/image';

/**
 * ExportProfileCard — Fixed 1200×1600px off-screen card for PNG download.
 *
 * Rendered off-screen (position: absolute; left: -9999px) so that html-to-image
 * captures a complete, deterministic image without depending on viewport width,
 * scroll position, or responsive layout.
 */
export default function ExportProfileCard({ exportRef, character, editedImage }) {
  const activePreset = presets.find((p) => p.id === character.preset) || presets[0];
  const activeActivity = activities.find((a) => a.id === character.activity) || activities[3];

  const roleIcons = {
    Hacker: Terminal,
    'Street Racer': Gauge,
    Fixer: Briefcase,
    Photographer: Camera,
    Entrepreneur: DollarSign,
    Detective: Shield,
    Smuggler: Ship,
    Freelancer: Crosshair,
    Custom: Sparkles,
  };
  const RoleIcon = roleIcons[character.role] || Shield;

  const activityIcons = {
    'ride-jetski': Waves,
    'visit-deli': Coffee,
    'hit-gym': Dumbbell,
    'cruise-city': Car,
    'hang-docks': Anchor,
  };
  const ActivityIcon = activityIcons[character.activity] || Car;

  const [resolvedImage, setResolvedImage] = React.useState(editedImage || character.image);

  React.useEffect(() => {
    let active = true;
    if (editedImage) {
      setResolvedImage(editedImage);
    } else if (character.image) {
      if (character.image.startsWith('data:')) {
        setResolvedImage(character.image);
      } else {
        ensureDataUrl(character.image).then((url) => {
          if (active && url) setResolvedImage(url);
        });
      }
    }
    return () => { active = false; };
  }, [editedImage, character.image]);

  const displayImage = resolvedImage || editedImage || character.image;
  const heatStars = Array.from({ length: 5 }, (_, i) => i < character.heat);

  // --- Shared inline style helpers ---
  const mono = { fontFamily: 'monospace' };
  const syne = { fontFamily: "'Syne', 'Outfit', 'Inter', sans-serif" };

  return (
    <div
      ref={exportRef}
      id="vice-city-export-card"
      style={{
        position: 'relative',
        width: '1200px',
        height: '1600px',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        backgroundColor: '#08070d',
        color: '#f8f7fb',
        boxSizing: 'border-box',
      }}
    >
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', top: '-150px', right: '-150px',
        width: '700px', height: '700px', borderRadius: '50%',
        background: activePreset.accent, filter: 'blur(200px)',
        opacity: 0.2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-150px',
        width: '700px', height: '700px', borderRadius: '50%',
        background: activePreset.secondary, filter: 'blur(200px)',
        opacity: 0.15, pointerEvents: 'none',
      }} />
      {/* Scanline texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
      }} />

      {/* === CARD CONTENT === */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: '72px 80px',
        boxSizing: 'border-box',
        gap: '40px',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '32px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff2a85' }} />
              <span style={{
                ...syne, fontWeight: 900, fontSize: '20px',
                letterSpacing: '6px', textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #ff2a85, #00f0ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                VICE CITY METROPOLITAN
              </span>
            </div>
            <div style={{ ...mono, fontSize: '13px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              CITIZEN UNDERWORLD DOSSIER // CLASSIFIED
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              ...mono, fontSize: '12px', fontWeight: 700,
              padding: '6px 14px', borderRadius: '999px',
              border: `1px solid ${activePreset.accent}50`,
              backgroundColor: `${activePreset.accent}15`,
              color: activePreset.accent,
              letterSpacing: '2px', marginBottom: '8px', display: 'inline-block',
            }}>
              #BuiltWithImageEditor
            </div>
            <div style={{ ...mono, fontSize: '11px', color: 'rgba(255,255,255,0.35)', display: 'block' }}>
              VICECITY-2026
            </div>
          </div>
        </div>

        {/* ── MAIN IMAGE ── */}
        <div style={{
          width: '100%', height: '580px', flexShrink: 0,
          borderRadius: '20px', overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.18)',
          backgroundColor: '#000', position: 'relative',
          boxShadow: `0 0 50px ${activePreset.glow}`,
        }}>
          {displayImage && (
            <img
              src={displayImage}
              alt={character.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              {...(!displayImage.startsWith('data:') ? { crossOrigin: 'anonymous' } : {})}
            />
          )}
          {/* Corner accent marks */}
          {[
            { top: 16, left: 16, borderTop: `3px solid ${activePreset.accent}`, borderLeft: `3px solid ${activePreset.accent}` },
            { top: 16, right: 16, borderTop: `3px solid ${activePreset.accent}`, borderRight: `3px solid ${activePreset.accent}` },
            { bottom: 16, left: 16, borderBottom: '3px solid #ff2a85', borderLeft: '3px solid #ff2a85' },
            { bottom: 16, right: 16, borderBottom: '3px solid #ff2a85', borderRight: '3px solid #ff2a85' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
          ))}
          {/* Vibe badge */}
          <div style={{
            position: 'absolute', top: 20, left: 20,
            padding: '6px 16px', borderRadius: '8px',
            backgroundColor: `${activePreset.accent}25`,
            border: `1px solid ${activePreset.accent}60`,
            color: activePreset.accent,
            ...mono, fontWeight: 700, fontSize: '13px',
            letterSpacing: '3px', textTransform: 'uppercase',
          }}>
            {activePreset.name}
          </div>
          {/* Watermark */}
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            padding: '4px 10px', borderRadius: '6px',
            backgroundColor: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(255,255,255,0.1)',
            ...mono, fontSize: '11px', color: 'rgba(255,255,255,0.6)',
            letterSpacing: '2px',
          }}>
            VC // UNLAYER CERTIFIED
          </div>
        </div>

        {/* ── IDENTITY ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
            <h2 style={{
              ...syne, fontWeight: 900, fontSize: '68px',
              color: '#ffffff', textTransform: 'uppercase',
              letterSpacing: '-2px', lineHeight: 1, margin: 0,
            }}>
              {character.name || 'ANONYMOUS'}
            </h2>
            {character.alias && (
              <span style={{
                ...syne, fontWeight: 700, fontSize: '26px',
                color: '#ff2a85', textTransform: 'uppercase',
              }}>
                "{character.alias}"
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              ...mono, fontWeight: 700, fontSize: '15px',
              color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              {character.role}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', borderRadius: '8px',
              backgroundColor: `${activePreset.accent}15`,
              border: `1px solid ${activePreset.accent}40`,
              ...mono, fontWeight: 700, fontSize: '15px',
              color: activePreset.accent, textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              {activePreset.name}
            </div>
          </div>
        </div>

        {/* ── ACTIVITY & LOCATION ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 32px', borderRadius: '16px',
          backgroundColor: `${activePreset.accent}10`,
          border: `1px solid ${activePreset.accent}30`,
        }}>
          <div>
            <div style={{
              ...mono, fontSize: '12px', color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px',
            }}>
              TONIGHT'S ROUTE
            </div>
            <div style={{ ...syne, fontWeight: 700, fontSize: '26px', color: '#ffffff' }}>
              {activeActivity.title}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              ...mono, fontSize: '12px', color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px',
            }}>
              LOCATION
            </div>
            <div style={{ ...mono, fontWeight: 700, fontSize: '20px', color: activePreset.accent }}>
              {activePreset.location || activeActivity.location}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          {/* Heat */}
          <div style={{
            padding: '24px', borderRadius: '14px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
          }}>
            <div style={{ ...mono, fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
              HEAT LEVEL
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
              {heatStars.map((lit, i) => (
                <span key={i} style={{ fontSize: '22px', color: lit ? '#fbbf24' : 'rgba(255,255,255,0.15)' }}>★</span>
              ))}
            </div>
            <div style={{ ...mono, fontWeight: 700, fontSize: '20px', color: '#fbbf24' }}>
              {character.heat} / 5
            </div>
          </div>

          {/* Street Cred */}
          <div style={{
            padding: '24px', borderRadius: '14px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
          }}>
            <div style={{ ...mono, fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
              STREET CRED
            </div>
            <div style={{ ...syne, fontWeight: 900, fontSize: '54px', color: activePreset.accent, lineHeight: 1 }}>
              {character.cred}
            </div>
            <div style={{
              marginTop: '10px', height: '6px',
              backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                backgroundColor: activePreset.accent,
                width: `${Math.min(character.cred, 100)}%`,
              }} />
            </div>
          </div>

          {/* Cash */}
          <div style={{
            padding: '24px', borderRadius: '14px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
          }}>
            <div style={{ ...mono, fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
              CASH FLOW
            </div>
            <div style={{ ...syne, fontWeight: 900, fontSize: '54px', color: '#00ff88', lineHeight: 1 }}>
              ${(character.cash / 1000).toFixed(0)}K
            </div>
            <div style={{ ...mono, fontSize: '12px', color: 'rgba(0,255,136,0.6)', fontWeight: 700, marginTop: '8px' }}>
              UNREGISTERED
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <svg width="180" height="28" viewBox="0 0 180 28" style={{ opacity: 0.6 }}>
              {[[0,3],[5,1],[8,4],[14,2],[18,1],[21,5],[28,2],[32,1],[35,3],[40,6],[48,2],[52,4],[58,1],[61,5],[68,2],[72,3],[77,1],[80,4],[86,2],[90,6],[98,2],[102,3],[107,1],[110,5],[117,2],[121,4]].map(([x, w], i) => (
                <rect key={i} x={x} y={0} width={w} height={28} fill="#ffffff" />
              ))}
            </svg>
            <div style={{ ...mono, fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', letterSpacing: '2px' }}>
              25.7617° N, 80.1918° W // VICECITY-FL
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...mono, fontWeight: 700, fontSize: '13px', color: '#ff2a85', textTransform: 'uppercase', letterSpacing: '2px' }}>
              VERIFIED DOSSIER
            </div>
            <div style={{ ...mono, fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
              Built with @unlayer/react-image-editor
            </div>
            <div style={{ ...mono, fontSize: '11px', color: activePreset.accent, marginTop: '2px' }}>
              #BuiltWithImageEditor
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
