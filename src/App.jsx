import React, { useState, useEffect } from 'react';
import ProjectHeader from './components/ProjectHeader';
import LandingHero from './components/LandingHero';
import CharacterSetup from './components/CharacterSetup';
import VisualEditor from './components/VisualEditor';
import CompilationScreen from './components/CompilationScreen';
import FinalResultScreen from './components/FinalResultScreen';
import SharedIdentityView from './components/SharedIdentityView';
import { demoCharacters } from './data/demoCharacters';
import { decodeIdentityFromUrl } from './lib/share';

export default function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'setup' | 'editor' | 'compilation' | 'result' | 'shared'
  const [sharedCharacter, setSharedCharacter] = useState(null);
  
  const [character, setCharacter] = useState({
    name: 'Mia Santos',
    alias: 'Apex',
    role: 'Street Racer',
    preset: 'neon-nights',
    activity: 'cruise-city',
    image: demoCharacters[0].image,
    bio: 'Undisputed champion of Ocean Drive midnight drag circuits.',
    heat: 3,
    cred: 94,
    cash: 310000,
  });

  const [editedImage, setEditedImage] = useState(null);

  // Check URL on initial load for shareable identity link
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedId = params.get('id');
      const serialParam = params.get('serial');
      if (encodedId) {
        const decoded = decodeIdentityFromUrl(encodedId);
        if (decoded) {
          if (serialParam) decoded.serial = serialParam.replace(/^VC-/, '');
          setSharedCharacter(decoded);
          setScreen('shared');
          return;
        }
      }
      // Check /identity/:serial path structure
      const pathMatch = window.location.pathname.match(/\/identity\/([^/?#]+)/);
      if (pathMatch && encodedId) {
        const decoded = decodeIdentityFromUrl(encodedId);
        if (decoded) {
          decoded.serial = pathMatch[1].replace(/^VC-/, '');
          setSharedCharacter(decoded);
          setScreen('shared');
        }
      }
    } catch (e) {
      console.warn('Error reading share URL parameters:', e);
    }
  }, []);

  // Navigation handlers
  const handleStart = () => {
    setScreen('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDemo = (demo) => {
    setCharacter({
      name: demo.name,
      alias: demo.alias,
      role: demo.role,
      preset: demo.preset,
      activity: demo.activity,
      image: demo.image,
      bio: demo.bio,
      heat: demo.heat,
      cred: demo.cred,
      cash: demo.cash,
    });
    setScreen('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetupComplete = (configuredCharacter) => {
    setCharacter(configuredCharacter);
    setScreen('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditorSave = ({ dataUrl }) => {
    setEditedImage(dataUrl);
    setScreen('compilation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Auto-advance after compilation animation completes (~2.2 s)
    setTimeout(() => {
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2200);
  };

  const handleEditorCancel = () => {
    setScreen('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditAgain = () => {
    setScreen('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateAnother = () => {
    setEditedImage(null);
    setScreen('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditedImage(null);
    setCharacter({
      name: '',
      alias: '',
      role: 'Street Racer',
      preset: 'neon-nights',
      activity: 'cruise-city',
      image: demoCharacters[0].image,
      bio: '',
      heat: 3,
      cred: 90,
      cash: 280000,
    });
    setScreen('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08070d] text-[#f8f7fb] selection:bg-[#ff2a85] selection:text-white">
      {/* Universal Top Header */}
      <ProjectHeader
        currentScreen={screen}
        onNavigate={(targetScreen) => {
          setScreen(targetScreen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReset={handleReset}
      />

      {/* Main Dynamic View */}
      <main className="flex-1 w-full flex flex-col">
        {screen === 'landing' && (
          <LandingHero
            onStart={handleStart}
            onSelectDemo={handleSelectDemo}
          />
        )}

        {screen === 'setup' && (
          <CharacterSetup
            initialCharacter={character}
            onComplete={handleSetupComplete}
            onBack={() => setScreen('landing')}
          />
        )}

        {screen === 'editor' && (
          <VisualEditor
            character={character}
            onSave={handleEditorSave}
            onCancel={handleEditorCancel}
          />
        )}

        {screen === 'compilation' && (
          <CompilationScreen character={character} />
        )}

        {screen === 'result' && (
          <FinalResultScreen
            character={character}
            editedImage={editedImage}
            onEditAgain={handleEditAgain}
            onCreateAnother={handleCreateAnother}
          />
        )}

        {screen === 'shared' && sharedCharacter && (
          <SharedIdentityView
            character={sharedCharacter}
            onCreateOwn={() => {
              if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                window.history.pushState({}, '', window.location.pathname.replace(/\/identity\/.*$/, '') || '/');
              }
              setScreen('setup');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Universal Footer */}
      <footer className="w-full border-t border-white/10 bg-[#06050a] py-6 px-4 text-center text-xs font-mono text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff2a85]" />
            <span className="text-white/70 font-syne font-bold uppercase tracking-wider">
              Vice City Character Studio
            </span>
          </div>

          <div className="text-center sm:text-right">
            <span>Built with </span>
            <strong className="text-[#00f0ff]">@unlayer/react-image-editor</strong>
            <span> for the Unlayer Builder Challenge • </span>
            <span className="text-[#ff2a85]">#BuiltWithImageEditor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
