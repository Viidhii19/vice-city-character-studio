import React from 'react';
import { Sparkles, Palette, Shield, Download, RefreshCw, Layers } from 'lucide-react';

export default function ProjectHeader({ currentScreen, onNavigate, onReset }) {
  const steps = [
    { id: 'setup', label: '1. Identity', icon: Layers },
    { id: 'editor', label: '2. Unlayer Studio', icon: Palette },
    { id: 'result', label: '3. Profile Dossier', icon: Download },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08070d]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff2a85] via-[#8a2be2] to-[#00f0ff] p-[2px] shadow-neon-pink group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#08070d] rounded-[10px] flex items-center justify-center">
              <span className="font-syne font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#00f0ff]">
                VC
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-syne font-extrabold tracking-wider text-xl uppercase text-white group-hover:text-[#ff2a85] transition-colors">
                VICE CITY
              </span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-[#ff2a85]/20 text-[#ff5ea7] border border-[#ff2a85]/30">
                STUDIO
              </span>
            </div>
            <p className="text-xs text-white/50 tracking-wider font-mono">
              GTA-INSPIRED IDENTITY CREATOR
            </p>
          </div>
        </div>

        {/* Step Indicator (Visible when past landing) */}
        {currentScreen !== 'landing' && (
          <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentScreen === step.id;
              const isPast = 
                (step.id === 'setup' && (currentScreen === 'editor' || currentScreen === 'result')) ||
                (step.id === 'editor' && currentScreen === 'result');

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff2a85] to-[#8a2be2] text-white shadow-neon-pink'
                      : isPast
                      ? 'text-[#00f0ff] hover:bg-white/5 cursor-pointer'
                      : 'text-white/40'
                  }`}
                  onClick={() => {
                    if (isPast) onNavigate(step.id);
                  }}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white animate-pulse' : ''}`} />
                  <span>{step.label}</span>
                </div>
              );
            })}
          </nav>
        )}

        {/* Right Action / Challenge Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="text-[#00f0ff] font-bold">#BuiltWithImageEditor</span>
          </div>

          {currentScreen !== 'landing' && (
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-red-500/50 bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 text-xs font-mono transition-all flex items-center gap-1.5"
              title="Start New Character"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
