import React from 'react';
import { 
  Flame, Shield, Zap, Sparkles, MapPin, Award, 
  Terminal, Gauge, Briefcase, Camera, Ship, Crosshair,
  Waves, Coffee, Dumbbell, Car, Anchor, DollarSign
} from 'lucide-react';
import { presets } from '../data/presets';
import { activities } from '../data/activities';

export default function ProfileCard({ cardRef, character, editedImage }) {
  const activePreset = presets.find((p) => p.id === character.preset) || presets[0];
  const activeActivity = activities.find((a) => a.id === character.activity) || activities[3];

  const roleIcons = {
    'Hacker': Terminal,
    'Street Racer': Gauge,
    'Fixer': Briefcase,
    'Photographer': Camera,
    'Entrepreneur': DollarSign,
    'Detective': Shield,
    'Smuggler': Ship,
    'Freelancer': Crosshair,
    'Custom': Sparkles,
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

  // Visual image: prioritize edited image returned by Unlayer
  const displayImage = editedImage || character.image;

  return (
    <div
      ref={cardRef}
      id="vice-city-profile-card"
      className="relative w-full max-w-[460px] mx-auto rounded-3xl overflow-hidden bg-[#0c0b14] border-2 border-white/20 shadow-2xl p-6 transition-all font-sans text-white select-none"
      style={{
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px ${activePreset.glow}`,
      }}
    >
      {/* Background ambient lighting */}
      <div 
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-40"
        style={{ backgroundColor: activePreset.accent }}
      />
      <div 
        className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-30"
        style={{ backgroundColor: activePreset.secondary }}
      />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

      {/* CARD HEADER */}
      <div className="relative z-10 flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff2a85] animate-pulse" />
            <span className="font-syne font-black text-sm tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#00f0ff]">
              VICE CITY METROPOLITAN
            </span>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-white/50 uppercase mt-0.5">
            CITIZEN UNDERWORLD DOSSIER // CLASSIFIED
          </p>
        </div>

        {/* Challenge badge */}
        <div className="text-right">
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30">
            #BuiltWithImageEditor
          </span>
          <p className="text-[9px] font-mono text-white/40 mt-1">SER: VC-{Math.floor(Math.random() * 8999 + 1000)}</p>
        </div>
      </div>

      {/* EDITED CHARACTER IMAGE (PRIMARY VISUAL) */}
      <div className="relative z-10 aspect-square w-full rounded-2xl overflow-hidden mb-5 border-2 border-white/20 bg-black shadow-inner group">
        <img
          src={displayImage}
          alt={character.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />

        {/* Tactical Corner Crosshairs */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff] pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff] pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ff2a85] pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff2a85] pointer-events-none" />

        {/* Preset Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${activePreset.badgeBg} shadow-lg`}>
            {activePreset.name}
          </span>
        </div>

        {/* Watermark Logo in Corner */}
        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[9px] font-mono tracking-widest text-white/70">
          VC // UNLAYER CERTIFIED
        </div>
      </div>

      {/* IDENTITY INFO */}
      <div className="relative z-10 space-y-3 mb-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#00f0ff] tracking-widest uppercase">
              REGISTERED IDENTITY
            </span>
            <span className="text-[10px] font-mono text-white/40">ID: 804-922</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight truncate leading-none mt-1">
            {character.name || 'ANONYMOUS CITIZEN'}
          </h2>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {character.alias && (
              <span className="font-syne font-bold text-xs text-[#ff2a85] tracking-wide uppercase px-2 py-0.5 rounded bg-[#ff2a85]/10 border border-[#ff2a85]/20">
                "{character.alias}"
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/10">
              <RoleIcon className="w-3.5 h-3.5 text-[#00f0ff]" />
              {character.role}
            </span>
          </div>
        </div>

      {/* LIFESTYLE / TONIGHT'S ROUTE */}
        <div className="p-3 rounded-xl border flex items-center justify-between" style={{ backgroundColor: `${activePreset.accent}10`, borderColor: `${activePreset.accent}30` }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10" style={{ color: activePreset.accent }}>
              <ActivityIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-white/50 uppercase tracking-wider">
                TONIGHT'S ROUTE
              </div>
              <div className="text-xs font-syne font-bold text-white">
                {activeActivity.title}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-mono text-white/40">LOCATION</div>
            <div className="text-[10px] font-mono font-semibold" style={{ color: activePreset.accent }}>
              {activePreset.location || activeActivity.location}
            </div>
          </div>
        </div>
      </div>

      {/* STATS MATRIX */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-black/50 border border-white/10 font-mono mb-4 text-center">
        
        {/* Heat Level */}
        <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-white/50 tracking-wider">HEAT LEVEL</span>
          <div className="flex items-center justify-center gap-0.5 my-1">
            {[...Array(5)].map((_, i) => (
              <Flame
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < character.heat
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-amber-400 font-bold">{character.heat} / 5</span>
        </div>

        {/* Street Cred */}
        <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-white/50 tracking-wider">STREET CRED</span>
          <div className="font-display font-black text-xl text-[#00f0ff] my-0.5">
            {character.cred}
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-[#00f0ff] h-full rounded-full"
              style={{ width: `${Math.min(character.cred, 100)}%` }}
            />
          </div>
        </div>

        {/* Bounty / Cash */}
        <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-white/50 tracking-wider">CASH FLOW</span>
          <div className="font-display font-black text-lg text-[#00ff88] my-0.5 truncate">
            ${(character.cash / 1000).toFixed(0)}K
          </div>
          <span className="text-[9px] text-[#00ff88]/80 font-bold">UNREGISTERED</span>
        </div>

      </div>

      {/* CARD FOOTER: BARCODE & WATERMARK */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
        
        {/* Stylized Barcode SVG */}
        <div className="flex flex-col">
          <svg className="w-32 h-6 opacity-75" viewBox="0 0 128 24" fill="currentColor">
            <rect x="0" y="0" width="3" height="24" fill="#ffffff" />
            <rect x="5" y="0" width="1" height="24" fill="#ffffff" />
            <rect x="8" y="0" width="4" height="24" fill="#ffffff" />
            <rect x="14" y="0" width="2" height="24" fill="#ffffff" />
            <rect x="18" y="0" width="1" height="24" fill="#ffffff" />
            <rect x="21" y="0" width="5" height="24" fill="#ffffff" />
            <rect x="28" y="0" width="2" height="24" fill="#ffffff" />
            <rect x="32" y="0" width="1" height="24" fill="#ffffff" />
            <rect x="35" y="0" width="3" height="24" fill="#ffffff" />
            <rect x="40" y="0" width="6" height="24" fill="#ffffff" />
            <rect x="48" y="0" width="2" height="24" fill="#ffffff" />
            <rect x="52" y="0" width="4" height="24" fill="#ffffff" />
            <rect x="58" y="0" width="1" height="24" fill="#ffffff" />
            <rect x="61" y="0" width="5" height="24" fill="#ffffff" />
            <rect x="68" y="0" width="2" height="24" fill="#ffffff" />
            <rect x="72" y="0" width="3" height="24" fill="#ffffff" />
            <rect x="77" y="0" width="1" height="24" fill="#ffffff" />
            <rect x="80" y="0" width="4" height="24" fill="#ffffff" />
            <rect x="86" y="0" width="2" height="24" fill="#ffffff" />
            <rect x="90" y="0" width="6" height="24" fill="#ffffff" />
            <rect x="98" y="0" width="2" height="24" fill="#ffffff" />
            <rect x="102" y="0" width="3" height="24" fill="#ffffff" />
            <rect x="107" y="0" width="1" height="24" fill="#ffffff" />
            <rect x="110" y="0" width="5" height="24" fill="#ffffff" />
            <rect x="117" y="0" width="2" height="24" fill="#ffffff" />
            <rect x="121" y="0" width="4" height="24" fill="#ffffff" />
          </svg>
          <span className="text-[8px] font-mono text-white/40 tracking-widest mt-1">
            25.7617° N, 80.1918° W // VICECITY-FL
          </span>
        </div>

        {/* Date and Security stamp */}
        <div className="text-right">
          <div className="text-[9px] font-mono text-[#ff2a85] font-bold">VERIFIED DOSSIER</div>
          <div className="text-[8px] font-mono text-white/40">SEPTEMBER 2026</div>
        </div>

      </div>

    </div>
  );
}
