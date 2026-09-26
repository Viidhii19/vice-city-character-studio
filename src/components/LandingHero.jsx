import React from 'react';
import { Sparkles, ArrowRight, Zap, Palette, Shield, Flame, Car, Sliders, Layers, Wand2, Download } from 'lucide-react';
import { demoCharacters } from '../data/demoCharacters';

export default function LandingHero({ onStart, onSelectDemo }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hero Background image with dramatic blend */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/assets/backgrounds/hero-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-[#08070d]/75 to-[#08070d]/35" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        {/* Neon Ambient Light Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff2a85]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#00f0ff]/20 rounded-full blur-[140px] pointer-events-none" />

        {/* Ambient Palm & Coastal Silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none overflow-hidden opacity-30 flex items-end justify-between">
          <svg className="w-52 h-52 text-[#ff2a85] fill-current opacity-40 -translate-x-10 translate-y-8" viewBox="0 0 100 100">
            <path d="M50,100 C48,70 42,40 30,20 C35,22 45,30 50,40 C52,25 60,15 75,10 C70,18 65,28 60,38 C75,25 90,25 98,30 C88,38 78,42 65,45 C80,48 92,58 95,68 C82,65 72,58 60,52 C58,75 54,90 50,100 Z" />
          </svg>
          <svg className="w-60 h-60 text-[#00f0ff] fill-current opacity-40 translate-x-12 translate-y-10 scale-x-[-1]" viewBox="0 0 100 100">
            <path d="M50,100 C48,70 42,40 30,20 C35,22 45,30 50,40 C52,25 60,15 75,10 C70,18 65,28 60,38 C75,25 90,25 98,30 C88,38 78,42 65,45 C80,48 92,58 95,68 C82,65 72,58 60,52 C58,75 54,90 50,100 Z" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center text-center">
        
        {/* Challenge pill tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-[#ff2a85]/40 mb-8 transition-all hover:border-[#ff2a85] shadow-lg">
          <Sparkles className="w-4 h-4 text-[#ff2a85] animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-[#f8f7fb] uppercase">
            Unlayer React Image Editor Build Challenge
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff2a85] text-white">
            #BuiltWithImageEditor
          </span>
        </div>

        {/* Main Cinematic Title */}
        <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] max-w-5xl mb-6">
          <span className="block text-white drop-shadow-md">BUILD YOUR</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff70a6] to-[#00f0ff] text-glow-pink">
            VICE CITY IDENTITY.
          </span>
        </h1>

        {/* Subtitle & Story Hook */}
        <p className="font-sans text-lg sm:text-xl text-white/80 max-w-2xl font-light mb-8 leading-relaxed">
          Build your identity. Choose your vibe. Shape your story. Style your portrait in <span className="text-[#00f0ff] font-medium">Unlayer Image Editor</span> and generate a classified underworld dossier.
        </p>

        {/* 3-Step Creation Journey Pipeline */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <Layers className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>01. CUSTOMIZE IDENTITY</span>
          </div>
          <span className="text-white/30 text-xs">→</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
            <Wand2 className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>02. UNLAYER STUDIO</span>
          </div>
          <span className="text-white/30 text-xs">→</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-[#00ff88]/30 text-xs font-mono text-[#00ff88]">
            <Download className="w-3.5 h-3.5 text-[#00ff88]" />
            <span>03. 1200×1600 DOSSIER</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 w-full sm:w-auto">
          <button
            id="cta-create-character"
            onClick={onStart}
            className="w-full sm:w-auto px-9 py-4 rounded-xl btn-vice-primary font-syne font-bold text-base tracking-wider uppercase text-white shadow-neon-pink flex items-center justify-center gap-3 group"
          >
            <span>CREATE YOUR CHARACTER</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href="#demo-showcase"
            className="w-full sm:w-auto px-8 py-4 rounded-xl btn-vice-outline font-syne font-semibold text-base tracking-wider uppercase text-white/90 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-[#00f0ff]" />
            <span>INSTANT ROSTER</span>
          </a>
        </div>

        <p className="text-[11px] font-mono text-white/40 mb-14">
          100% Client-Side • Powered by @unlayer/react-image-editor • High-Res PNG Export
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-16">
          {[
            { title: "Real Image Editor", desc: "Powered by @unlayer/react-image-editor: crop, filters, typography, frames", icon: Palette, color: "text-[#00f0ff]" },
            { title: "GTA VI Lifestyle", desc: "Biscayne jet skis, Little Havana delis, Muscle Beach, night cruises", icon: Car, color: "text-[#ff2a85]" },
            { title: "Dynamic Vibe Engine", desc: "Neon Nights, Ocean Drive, Downtown Heat, After Dark palettes", icon: Sliders, color: "text-[#ffd000]" },
            { title: "1200×1600 High-Res", desc: "Deterministic export with zero clipping or layout shifts", icon: Shield, color: "text-[#00ff88]" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-4 rounded-xl text-left border border-white/10 hover:border-white/25 transition-all hover:-translate-y-1 shadow-sm"
              >
                <Icon className={`w-6 h-6 ${item.color} mb-2`} />
                <h2 className="font-syne font-bold text-sm text-white">{item.title}</h2>
                <p className="text-xs text-white/50 mt-1 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Demo Starters Showcase */}
        <div id="demo-showcase" className="w-full max-w-5xl mt-4 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="text-left mb-4 sm:mb-0">
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                Fast Track // Instant Roster
              </span>
              <h2 className="font-display font-extrabold text-2xl uppercase text-white mt-1">
                Choose a Starter Character
              </h2>
            </div>
            <p className="text-xs text-white/50 max-w-xs text-right hidden sm:block">
              Jump directly into the Unlayer Editor with pre-configured operative profiles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {demoCharacters.map((char) => (
              <div
                key={char.id}
                onClick={() => onSelectDemo(char)}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-[#ff2a85] transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-glass hover:shadow-neon-pink text-left"
              >
                {/* Character Image */}
                <div className="relative aspect-square overflow-hidden bg-[#11101a]">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-transparent opacity-80" />
                  
                  {/* Role Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#00f0ff] border border-[#00f0ff]/40">
                      {char.role}
                    </span>
                  </div>

                  {/* Heat badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-mono text-amber-400">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>HEAT {char.heat}★</span>
                  </div>
                </div>

                {/* Character Info */}
                <div className="p-4">
                  <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#ff2a85] transition-colors truncate">
                    {char.name}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 mt-1 leading-relaxed">
                    {char.bio}
                  </p>
                  
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-white/60">
                      BOUNTY <span className="text-[#00ff88] font-bold">${(char.cash / 1000).toFixed(0)}K</span>
                    </span>
                    <span className="text-xs font-syne font-bold text-[#00f0ff] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Edit Visual →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small Attribution Footer Note */}
        <div className="mt-16 text-center text-xs font-mono text-white/40 max-w-xl">
          <p>
            Built for the <strong className="text-white/70">Unlayer React Image Editor Challenge</strong>.
            Unofficial fan-inspired concept. Not affiliated with Rockstar Games.
          </p>
        </div>

      </div>
    </div>
  );
}

