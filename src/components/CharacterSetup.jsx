import React, { useState, useRef } from 'react';
import { 
  User, Sparkles, Upload, ArrowRight, Shield, Flame, 
  Coins, MapPin, Check, AlertCircle, RefreshCw, Wand2,
  Terminal, Gauge, Briefcase, Camera, Ship, Crosshair,
  Waves, Coffee, Dumbbell, Car, Anchor, Dice5,
  Clock, Zap, Activity
} from 'lucide-react';
import { roles } from '../data/roles';
import { presets } from '../data/presets';
import { activities } from '../data/activities';
import { demoCharacters } from '../data/demoCharacters';
import { validateImageFile, generateRandomIdentity } from '../lib/image';

export default function CharacterSetup({ initialCharacter, onComplete, onBack }) {
  const [character, setCharacter] = useState({
    name: initialCharacter?.name || '',
    alias: initialCharacter?.alias || '',
    role: initialCharacter?.role || 'Street Racer',
    customRoleTitle: initialCharacter?.customRoleTitle || '',
    preset: initialCharacter?.preset || 'neon-nights',
    activity: initialCharacter?.activity || 'cruise-city',
    image: initialCharacter?.image || demoCharacters[0].image,
    bio: initialCharacter?.bio || '',
    heat: initialCharacter?.heat || 3,
    cred: initialCharacter?.cred || 90,
    cash: initialCharacter?.cash || 280000,
  });

  const [activeTab, setActiveTab] = useState('identity'); // identity | vibe | lifestyle | visual
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Icon map for roles
  const roleIconMap = {
    Terminal, Gauge, Briefcase, Camera, Coins, ShieldAlert: Shield, Ship, Crosshair, Sparkles
  };

  // Icon map for activities
  const activityIconMap = {
    Waves, Coffee, Dumbbell, Car, Anchor
  };

  // Find active data objects
  const selectedRole = roles.find((r) => r.name === character.role) || roles[1];
  const selectedPreset = presets.find((p) => p.id === character.preset) || presets[0];
  const selectedActivity = activities.find((a) => a.id === character.activity) || activities[3];

  const handleRoleChange = (roleName) => {
    const r = roles.find((item) => item.name === roleName);
    if (r) {
      setCharacter((prev) => ({
        ...prev,
        role: r.name,
        heat: r.defaultHeat,
        cred: r.defaultCred,
        cash: r.defaultCash,
      }));
    } else {
      setCharacter((prev) => ({ ...prev, role: roleName }));
    }
  };

  const handleRandomize = () => {
    const random = generateRandomIdentity();
    setCharacter((prev) => ({
      ...prev,
      name: random.name,
      alias: random.alias,
      heat: random.heat,
      cred: random.cred,
      cash: random.cash,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const { valid, error } = validateImageFile(file);
    if (!valid) {
      setUploadError(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setCharacter((prev) => ({
          ...prev,
          image: dataUrl,
        }));
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalRole = character.role === 'Custom' && character.customRoleTitle?.trim()
      ? character.customRoleTitle.trim()
      : character.role;
    const finalCharacter = {
      ...character,
      name: character.name.trim() || 'NOVA "APEX" REED',
      role: finalRole,
    };
    onComplete(finalCharacter);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-500">
      
      {/* Dynamic Vibe Ambient Light Orbs */}
      <div 
        className="absolute top-10 left-1/4 w-[480px] h-[480px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 -z-10"
        style={{ backgroundColor: selectedPreset.accent, opacity: 0.15 }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 -z-10"
        style={{ backgroundColor: selectedPreset.secondary, opacity: 0.12 }}
      />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff2a85] animate-ping" />
            STEP 01 // CITIZEN DOSSIER CONFIGURATION
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Craft Your Vice City Character
          </h1>
        </div>
        
        {/* Tab Switcher with Progress Feedback */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
          {[
            { id: 'identity', label: '1. Identity', isDone: Boolean(character.name.trim()) },
            { id: 'vibe', label: '2. Vibe', isDone: Boolean(character.preset) },
            { id: 'lifestyle', label: '3. Lifestyle', isDone: Boolean(character.activity) },
            { id: 'visual', label: '4. Visual Asset', isDone: Boolean(character.image) },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff2a85] to-[#8a2be2] text-white shadow-neon-pink'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.isDone && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: IDENTITY */}
          {activeTab === 'identity' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-syne font-bold text-lg text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ff2a85]" />
                  <span>Personal Dossier & Role</span>
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#ff2a85]/20 text-[#ff2a85] hover:text-white border border-[#ff2a85]/30 text-xs font-mono transition-all flex items-center gap-1.5"
                    title="Roll a random Vice City identity"
                  >
                    <Dice5 className="w-3.5 h-3.5" />
                    <span>ROLL RANDOM</span>
                  </button>
                  <span className="text-xs font-mono text-white/40 hidden sm:inline">SECTION A-1</span>
                </div>
              </div>

              {/* Name & Street Alias */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-2 uppercase tracking-wider">
                    Full Character Name
                  </label>
                  <input
                    type="text"
                    value={character.name}
                    onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                    placeholder="e.g. Mia Santos"
                    className="w-full bg-[#08070d]/80 border border-white/15 focus:border-[#ff2a85] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff2a85]/30 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-2 uppercase tracking-wider">
                    Street Alias / Moniker
                  </label>
                  <input
                    type="text"
                    value={character.alias}
                    onChange={(e) => setCharacter({ ...character, alias: e.target.value })}
                    placeholder="e.g. 'Apex' or 'Ghost'"
                    className="w-full bg-[#08070d]/80 border border-white/15 focus:border-[#00f0ff] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/30 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Role Selection Grid */}
              <div>
                <label className="block text-xs font-mono text-white/70 mb-3 uppercase tracking-wider">
                  Select Underworld Specialization
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {roles.map((r) => {
                    const IconComponent = roleIconMap[r.icon] || Shield;
                    const isSelected = character.role === r.name;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleChange(r.name)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#ff2a85]/20 to-[#8a2be2]/20 border-[#ff2a85] shadow-neon-pink'
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#ff2a85]' : 'text-white/60'}`} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00f0ff]" />}
                        </div>
                        <div>
                          <div className="font-syne font-bold text-xs text-white truncate">{r.name}</div>
                          <div className="text-[10px] font-mono text-white/50 mt-0.5">${(r.defaultCash / 1000).toFixed(0)}k</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Role Configuration */}
              {character.role === 'Custom' && (
                <div className="p-4 rounded-xl bg-white/5 border border-[#00f0ff]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Custom Specialization Attributes
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff]">CONFIG</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1 uppercase tracking-wider">
                      Custom Role Title
                    </label>
                    <input
                      type="text"
                      value={character.customRoleTitle}
                      onChange={(e) => setCharacter({ ...character, customRoleTitle: e.target.value })}
                      placeholder="e.g. Syndicate Kingpin, Cyber Informant, Nightclub DJ..."
                      className="w-full bg-[#08070d] border border-white/15 focus:border-[#00f0ff] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono text-white/60">HEAT LEVEL</span>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">{character.heat} ★</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={character.heat}
                        onChange={(e) => setCharacter({ ...character, heat: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-400"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono text-white/60">STREET CRED</span>
                        <span className="text-[11px] font-mono text-[#00f0ff] font-bold">{character.cred}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="99"
                        value={character.cred}
                        onChange={(e) => setCharacter({ ...character, cred: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#00f0ff]"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono text-white/60">BOUNTY CASH</span>
                        <span className="text-[11px] font-mono text-[#00ff88] font-bold">${(character.cash / 1000).toFixed(0)}K</span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="1000000"
                        step="25000"
                        value={character.cash}
                        onChange={(e) => setCharacter({ ...character, cash: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#00ff88]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Role Perk Card */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-mono text-amber-400 font-semibold">{selectedRole.name} Special Perk: </span>
                  <span className="text-white/70">{selectedRole.perk}</span>
                </div>
              </div>

              {/* Next Tab Button */}
              <button
                type="button"
                onClick={() => setActiveTab('vibe')}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-syne font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                <span>Proceed to Vibe & Lighting</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 2: VIBE PRESETS */}
          {activeTab === 'vibe' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-syne font-bold text-lg text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00f0ff]" />
                  <span>Vice City Vibe & Aesthetic</span>
                </h2>
                <span className="text-xs font-mono text-white/40">SECTION B-2</span>
              </div>

              <p className="text-xs text-white/60 leading-relaxed">
                Choose the ambient palette that sets the atmosphere for your character card and Unlayer editor tools.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presets.map((p) => {
                  const isSelected = character.preset === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        // Update preset AND set the default activity for this vibe
                        setCharacter((prev) => ({
                          ...prev,
                          preset: p.id,
                          activity: p.defaultActivity || prev.activity,
                        }));
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-2 bg-gradient-to-br from-white/10 to-white/5 scale-[1.02] shadow-lg'
                          : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8'
                      }`}
                      style={isSelected ? {
                        borderColor: p.accent,
                        boxShadow: `0 0 20px ${p.glow}, 0 0 40px ${p.glow.replace('0.4', '0.15')}`,
                      } : {}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-syne font-bold text-sm text-white">{p.name}</span>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: p.accent }}
                            >
                              <Check className="w-3 h-3 text-black" />
                            </div>
                          )}
                          <div
                            className="w-4 h-4 rounded-full border border-white/30"
                            style={{ backgroundColor: p.accent }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-white/60 mb-1">{p.description}</p>
                      <p className="text-[10px] font-mono mb-3" style={{ color: p.accent }}>
                        📍 {p.location}
                      </p>

                      {/* Gradient preview bar */}
                      <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${p.gradient}`} />

                      <div className="mt-3 text-[10px] font-mono text-white/40 italic">
                        Tip: {p.filterAdvice}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vibe status indicator */}
              <div
                className="p-3 rounded-xl border text-xs font-mono flex items-center gap-2"
                style={{
                  borderColor: `${selectedPreset.accent}40`,
                  backgroundColor: `${selectedPreset.accent}10`,
                  color: selectedPreset.accent,
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: selectedPreset.accent }} />
                <span className="font-bold">{selectedPreset.name.toUpperCase()}</span>
                <span className="text-white/50 mx-1">•</span>
                <span className="text-white/60">Tonight: {activities.find(a => a.id === selectedPreset.defaultActivity)?.title || 'Free Roam'}</span>
                <span className="ml-auto text-white/40">📍 {selectedPreset.location}</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('identity')}
                  className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-syne font-semibold text-xs uppercase transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('lifestyle')}
                  className="w-2/3 py-3 rounded-xl font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border transition-all text-white"
                  style={{
                    borderColor: `${selectedPreset.accent}60`,
                    backgroundColor: `${selectedPreset.accent}15`,
                    boxShadow: `0 0 12px ${selectedPreset.glow}`,
                  }}
                >
                  <span>Select Tonight's Route</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LIFESTYLE ACTIVITY */}
          {activeTab === 'lifestyle' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-syne font-bold text-lg text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#ffd000]" />
                    <span>Your Vice City Life // Tonight's Route</span>
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    Inspired by GTA VI activities: pick where your character makes their mark tonight.
                  </p>
                </div>
                <span className="text-xs font-mono text-white/40">SECTION C-3</span>
              </div>

              <div className="space-y-3">
                {activities.map((act) => {
                  const Icon = activityIconMap[act.icon] || Car;
                  const isSelected = character.activity === act.id;
                  return (
                    <div
                      key={act.id}
                      onClick={() => setCharacter({ ...character, activity: act.id })}
                      className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#ff2a85] bg-gradient-to-r from-[#ff2a85]/15 via-purple-900/20 to-transparent shadow-neon-pink'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-[#ff2a85] text-white shadow-neon-pink' : 'bg-white/10 text-white/70 group-hover:text-white'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-syne font-bold text-sm text-white group-hover:text-[#ff2a85] transition-colors">
                              {act.title}
                            </h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                              {act.badge}
                            </span>
                          </div>
                          <p className="text-xs text-white/60 leading-snug">
                            {act.description}
                          </p>
                          {/* Tactical Meta Badges: WHERE, WHEN, MOOD, ENERGY */}
                          <div className="flex items-center gap-2 pt-0.5 flex-wrap text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-[#00f0ff]" />
                              {act.when}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-400/90 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              {act.mood}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#ff2a85] flex items-center gap-1">
                              <Activity className="w-2.5 h-2.5 text-[#ff2a85]" />
                              {act.energy}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10 shrink-0">
                        <span className="text-[11px] font-mono font-bold text-[#00ff88]">
                          {act.vibeBonus}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-[#00f0ff]" />
                          {act.location}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('vibe')}
                  className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-syne font-semibold text-xs uppercase transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className="w-2/3 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-syne font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-white/10 transition-all"
                >
                  <span>Select Character Visual</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL ASSET (DEMO OR UPLOAD) */}
          {activeTab === 'visual' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-syne font-bold text-lg text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#00ff88]" />
                    <span>Character Portrait Visual</span>
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    Upload your own photo OR pick a high-res starter portrait to edit in Unlayer.
                  </p>
                </div>
                <span className="text-xs font-mono text-white/40">SECTION D-4</span>
              </div>

              {/* Upload Drop Area */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-[#00f0ff] rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/5 hover:bg-[#00f0ff]/5 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-[#00f0ff]/20 mx-auto flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-6 h-6 text-white/70 group-hover:text-[#00f0ff]" />
                  </div>
                  <div className="font-syne font-bold text-sm text-white group-hover:text-[#00f0ff] transition-colors">
                    Click to Upload Custom Photo
                  </div>
                  <p className="text-xs text-white/40 mt-1 font-mono">
                    PNG, JPG, or WEBP (Max 15MB)
                  </p>
                </div>

                {uploadError && (
                  <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Instant Demo Presets Roster */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
                    Or Pick from Official Starter Roster:
                  </span>
                  <span className="text-[10px] font-mono text-white/40">4 High-Res Visuals</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {demoCharacters.map((demo) => {
                    const isSelected = character.image === demo.image;
                    return (
                      <div
                        key={demo.id}
                        onClick={() => {
                          setCharacter((prev) => ({
                            ...prev,
                            name: prev.name || demo.name,
                            alias: prev.alias || demo.alias,
                            image: demo.image,
                          }));
                        }}
                        className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#ff2a85] ring-2 ring-[#ff2a85]/50 shadow-neon-pink'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="aspect-square overflow-hidden bg-black">
                          <img
                            src={demo.image}
                            alt={demo.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-2 bg-[#11101a] text-center">
                          <div className="font-syne font-bold text-xs text-white truncate">
                            {demo.alias}
                          </div>
                          <div className="text-[10px] font-mono text-white/50 truncate">
                            {demo.role}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#ff2a85] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] font-mono text-white/40 mt-2 text-center">
                  ✓ Selecting a portrait preserves your configured name, role, stats, and route.
                </p>
              </div>

              {/* Ready to Edit CTA */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  id="btn-launch-studio"
                  onClick={handleSubmit}
                  className="w-full py-4 rounded-xl btn-vice-primary font-syne font-bold text-sm tracking-wider uppercase text-white shadow-neon-pink flex items-center justify-center gap-2 group"
                >
                  <Wand2 className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>OPEN IN UNLAYER IMAGE STUDIO</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Live Dossier Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-28">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                Live Dossier Preview
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                PRE-STUDIO
              </span>
            </div>

            {/* Tactical Card Shell */}
            <div 
              className="glass-panel-elevated rounded-2xl overflow-hidden border p-5 relative hud-corner-tl hud-corner-br transition-all duration-300"
              style={{
                borderColor: `${selectedPreset.accent}45`,
                boxShadow: `0 16px 40px rgba(0, 0, 0, 0.7), 0 0 25px ${selectedPreset.glow}`,
              }}
            >

              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-[#ff2a85] font-bold">
                    VICE CITY // UNDERWORLD DOSSIER
                  </div>
                  <div className="text-xs font-mono text-white/50">
                    STATUS: ACTIVE OPERATIVE
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-white/40">DISTRICT 08</div>
                  <div className="text-xs font-mono text-[#00f0ff] font-bold">25.76° N, 80.19° W</div>
                </div>
              </div>

              {/* Image Preview with Cyber Frame */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-white/20 bg-black/60">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={character.name || 'Character'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                    <User className="w-12 h-12 mb-2" />
                    <span className="text-xs font-mono">No Image Selected</span>
                  </div>
                )}
                
                {/* Vibe badge overlay */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${selectedPreset.badgeBg}`}>
                    {selectedPreset.name}
                  </span>
                </div>

                {/* Heat Stars Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                  {[...Array(5)].map((_, i) => (
                    <Flame
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < character.heat
                          ? 'text-amber-400 fill-amber-400 animate-pulse'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Bottom activity overlay */}
                <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center justify-between text-xs">
                  <span className="font-mono text-white/70 truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                    {selectedActivity.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#00ff88] font-bold">
                    {selectedActivity.vibeBonus}
                  </span>
                </div>
              </div>

              {/* Character Details in Preview */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight truncate">
                    {character.name || 'UNNAMED OPERATIVE'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-syne font-bold text-[#ff2a85] uppercase">
                      "{character.alias || 'GHOST'}"
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-xs font-mono text-[#00f0ff] uppercase">
                      {character.role === 'Custom' && character.customRoleTitle?.trim() ? character.customRoleTitle : character.role}
                    </span>
                  </div>
                </div>

                {/* Stat Bars */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-white/50">HEAT</div>
                    <div className="text-sm font-bold text-amber-400">{character.heat} / 5</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-white/50">CRED</div>
                    <div className="text-sm font-bold text-[#00f0ff]">{character.cred}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-white/50">BOUNTY</div>
                    <div className="text-sm font-bold text-[#00ff88]">${(character.cash / 1000).toFixed(0)}K</div>
                  </div>
                </div>

                {/* Direct Launch Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-xl btn-vice-cyan font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-cyan mt-3"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Customize in Image Editor →</span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
