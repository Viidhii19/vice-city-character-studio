# Project File Structure

**Project**: Vice City Character Studio  
**Target**: Unlayer Build with React Image Editor Challenge (`#BuiltWithImageEditor`)  
**Deployment**: [https://vice-city-character-studio.vercel.app/](https://vice-city-character-studio.vercel.app/)  
**Repository**: [https://github.com/Viidhii19/vice-city-character-studio](https://github.com/Viidhii19/vice-city-character-studio)  

---

## 1. Complete Directory Tree

```
vice-city-character-studio/
├── .gitignore                                   # Git ignore rules for node_modules, dist, logs
├── ARCHITECTURE.md                              # Comprehensive architectural and technical specification
├── FILE_STRUCTURE.md                            # Detailed repository structure and file breakdown
├── README.md                                    # Project documentation, challenge context, and setup guide
├── check-submission-deployment-ready.ps1        # Automated deployment verification script
├── index.html                                   # Root HTML5 template with Google Fonts & metadata
├── Makefile                                     # Automation target for git checkpoints (add, commit, push)
├── package.json                                 # Project dependencies, scripts, and package metadata
├── package-lock.json                            # Deterministic dependency lockfile
├── postcss.config.js                            # PostCSS config (Tailwind CSS + Autoprefixer)
├── tailwind.config.js                           # Custom synthwave color tokens, animations & fonts
├── vercel.json                                  # Vercel SPA routing rewrite configuration
├── vite.config.js                               # Vite 5 configuration & React plugin setup
│
├── public/                                      # Static public assets served at root
│   ├── _redirects                               # Netlify SPA fallback routing rule
│   ├── favicon.svg                              # SVG neon palm tree browser favicon
│   └── assets/                                  # High-resolution media assets
│       ├── backgrounds/
│       │   └── hero-bg.jpg                      # Vice City neon skyline landing background
│       ├── characters/
│       │   ├── alex.jpg                         # Starter character portrait: Alex
│       │   ├── mia.jpg                          # Starter character portrait: Mia
│       │   ├── nova.jpg                         # Starter character portrait: Nova
│       │   └── rio.jpg                          # Starter character portrait: Rio
│       └── textures/                            # Texture asset directory (scans/grain)
│
└── src/                                         # Application source code
    ├── App.jsx                                  # Root state machine & view router
    ├── index.css                                # Global CSS, cyber scanlines & neon utilities
    ├── main.jsx                                 # React 18 DOM mount entry point
    │
    ├── components/                              # Reusable React UI components
    │   ├── CharacterSetup.jsx                   # Operative setup, role, vibe & route configurator
    │   ├── CompilationScreen.jsx                # Multi-phase 2.2s cinematic compilation transition
    │   ├── ExportProfileCard.jsx                # Fixed 1200×1600px off-screen card for PNG export
    │   ├── FinalResultScreen.jsx                # Dossier presentation, download, share & celebration
    │   ├── IdentityReplayModal.jsx              # 6-step cinematic transformation timeline modal
    │   ├── LandingHero.jsx                      # Cinematic landing hero & quick-start demo cards
    │   ├── ProfileCard.jsx                      # Responsive on-screen operative dossier card
    │   ├── ProjectHeader.jsx                    # Top navigation bar with screen indicators & reset
    │   ├── SharedIdentityView.jsx               # Dedicated read-only public identity view for shared links
    │   └── VisualEditor.jsx                     # @unlayer/react-image-editor container with calibration missions
    │
    ├── data/                                    # Static game lore & identity dataset
    │   ├── activities.js                        # 5 Vice City lifestyle activities & routes
    │   ├── demoCharacters.js                    # 4 curated starter operative profiles
    │   ├── presets.js                           # 6 lighting, vibe & aesthetic presets
    │   └── roles.js                             # 9 underworld operative roles & stats
    │
    └── lib/                                     # Utility functions and helper modules
        ├── download.js                          # html-to-image DOM serialization & PNG download
        ├── identity.js                          # 30-combination deterministic Identity DNA matrix & visual stats
        ├── image.js                             # Canvas 2D vibe grading, base64 converter & validation
        └── share.js                             # Zero-backend URL encoder/decoder, social links & clipboard
```

---

## 2. Root Configuration & Project Files

### [`package.json`](file:///c:/Users/admin/Desktop/GTA/package.json)
The project manifest defining scripts and package dependencies.
- **Dependencies**:
  - `@unlayer/react-image-editor` (`^1.0.2`): The core Unlayer React Image Editor canvas engine.
  - `html-to-image` (`^1.11.11`): Canvas/SVG DOM serialization for 1200×1600px PNG downloads.
  - `lucide-react` (`^1.16.0`): Cyberpunk and interface iconography.
  - `canvas-confetti` (`^1.9.4`): Visual particle celebration on dossier reveal.
  - `react` & `react-dom` (`^18.3.1`): Core UI library.
- **DevDependencies**:
  - `vite` (`^5.4.14`): Lightning-fast bundler and local development server.
  - `@vitejs/plugin-react` (`^4.3.4`): Babel/Babel-free JSX transform for Vite.
  - `tailwindcss` (`^3.4.17`) & `autoprefixer` (`^10.4.20`): Utility-first styling engine.

### [`vite.config.js`](file:///c:/Users/admin/Desktop/GTA/vite.config.js)
Vite bundler configuration.
- Integrates `@vitejs/plugin-react`.
- Configures server port and production asset build parameters.

### [`tailwind.config.js`](file:///c:/Users/admin/Desktop/GTA/tailwind.config.js)
Tailwind CSS configuration extended for the Vice City aesthetic:
- **Custom Font Families**: `display`, `mono`, `sans`, `syne`.
- **Neon Color Tokens**: Deep blacks (`#08070d`), Neon Pink (`#ff2a85`), Cyber Cyan (`#00f0ff`), Miami Purple (`#8a2be2`), Sun Gold (`#ffd000`), Emerald Green (`#00ff88`).
- **Glow Shadow Utilities**: `shadow-neon-pink`, `shadow-neon-cyan`.

### [`postcss.config.js`](file:///c:/Users/admin/Desktop/GTA/postcss.config.js)
PostCSS pipeline wiring `tailwindcss` and `autoprefixer`.

### [`vercel.json`](file:///c:/Users/admin/Desktop/GTA/vercel.json)
Vercel routing configuration ensuring that all deep links rewrite to `/index.html` for single-page application routing without 404 errors.

### [`index.html`](file:///c:/Users/admin/Desktop/GTA/index.html)
The single-page HTML template.
- Loads Google Web Fonts (`Syne`, `Orbitron`, `Space Grotesk`, `JetBrains Mono`).
- Sets viewport meta tags, browser title, and favicon.

### [`Makefile`](file:///c:/Users/admin/Desktop/GTA/Makefile)
Automated checkpoint script target. Runs `git add -A`, commits with an ISO timestamp (`checkpoint at YYYY-MM-DDTHH:MM:SSZ`), pushes to origin repository, and outputs confirmation.

### [`check-submission-deployment-ready.ps1`](file:///c:/Users/admin/Desktop/GTA/check-submission-deployment-ready.ps1)
A comprehensive PowerShell automated QA test script verifying production builds, bundle sizes, asset paths, and export capabilities.

---

## 3. Source Code Breakdown (`src/`)

### Core Entry Files

#### [`src/main.jsx`](file:///c:/Users/admin/Desktop/GTA/src/main.jsx)
The application bootstrap entry point.
- Renders [`<App />`](file:///c:/Users/admin/Desktop/GTA/src/App.jsx) wrapped inside `React.StrictMode`.
- Attaches the React tree to `#root` in `index.html`.

#### [`src/App.jsx`](file:///c:/Users/admin/Desktop/GTA/src/App.jsx)
The master orchestrator and state machine of the entire application.
- **State Managed**:
  - `screen`: Current view (`'landing'` | `'setup'` | `'editor'` | `'compilation'` | `'result'`).
  - `character`: The active operative configuration object.
  - `editedImage`: The final base64 Data URL output produced by Unlayer.
- **Duties**:
  - Handles screen transitions and viewport auto-scrolling to top.
  - Coordinates the 2.2-second compilation transition between editor and result.
  - Renders universal layout chrome: [`ProjectHeader`](file:///c:/Users/admin/Desktop/GTA/src/components/ProjectHeader.jsx) and the global footer.

#### [`src/index.css`](file:///c:/Users/admin/Desktop/GTA/src/index.css)
The global stylesheet containing foundational rules, Tailwind directives, and custom keyframes:
- Base dark theme styling (`background-color: #08070d; color: #f8f7fb;`).
- Custom utility classes: `.glass-panel`, `.scanlines`, `.btn-vice-primary`, `.btn-vice-secondary`.
- Synthwave animations: `@keyframes pulse-slow`, `@keyframes scanline`.

---

### Component Layer (`src/components/`)

#### [`ProjectHeader.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/ProjectHeader.jsx)
The persistent top navigation header.
- Displays the Vice City Character Studio brand mark with glowing indicator.
- Shows the current step indicator in the user journey (01 CREATE $\rightarrow$ 02 CALIBRATE $\rightarrow$ 03 DOSSIER).
- Provides a quick "RESET" button and external link to the Unlayer Image Editor Challenge.

#### [`LandingHero.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/LandingHero.jsx)
The initial view (`screen === 'landing'`).
- High-impact visual headline explaining the 3-step creation journey.
- Primary Call to Action: "ENTER STUDIO // CREATE OPERATIVE".
- Quick-Start Demo Operatives Grid: Allows judges to bypass setup with one click on *Mia, Alex, Nova,* or *Rio*.
- Feature showcase badges emphasizing real `@unlayer/react-image-editor` tools and 1200×1600px export.

#### [`CharacterSetup.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/CharacterSetup.jsx)
The comprehensive customization workstation (`screen === 'setup'`).
- **Left Column (Customization Form)**:
  - Operative Name & Underworld Alias inputs with random generator button.
  - Role Selector: 9 underworld classes with auto-calculated Heat, Cred, and Cash stats.
  - Vibe Preset Selector: 6 lighting/aesthetic presets with dynamic preview pills.
  - Lifestyle Activity Selector: 5 evening routes (Jet Ski, Deli, Gym, Cruise, Docks).
  - Portrait Ingestion: Toggle between 4 starter portraits or custom image upload (validated for MIME type and size).
- **Right Column (Live Preview)**:
  - Embeds the reactive [`ProfileCard.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/ProfileCard.jsx).
  - Displays dynamic **Identity DNA** box showing the real-time archetype.
  - Action button: "LAUNCH UNLAYER STUDIO" to proceed to editing.

#### [`VisualEditor.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/VisualEditor.jsx)
The Unlayer React Image Editor integration container (`screen === 'editor'`).
- **Pre-Processing Pipeline**: Executes `ensureDataUrlWithVibe(character.image, character.preset)` before mounting, ensuring the portrait's pixels are physically color-graded and rendered with vignette + scanline overlays on an off-screen 1200×1600 canvas.
- **Top HUD**:
  - Operative summary badges (Role, Vibe).
  - Tri-state Canvas Lifecycle indicator:
    - `PREPARING IMAGE...` (amber): Off-screen canvas pixel grading active.
    - `LOADING CANVAS...` (cyan): Mounting Unlayer Image Editor instance.
    - `CANVAS READY` (green pulse): Unlayer canvas is fully interactive.
  - Action controls: "Reset Canvas" and "Save & Finish Dossier".
- **Canvas Container**:
  - Mounts `<ImageEditor />` from `@unlayer/react-image-editor`.
  - Configures dark theme options and handles `onLoad`, `onSave`, and `onError` events.
  - Overlay loading animations with concentric neon spinners.
- **Bottom HUD**: Pro-tips and recommended tools tailored to the active vibe preset.

#### [`CompilationScreen.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/CompilationScreen.jsx)
A full-screen cinematic transition modal (`screen === 'compilation'`).
- Runs for ~2.2 seconds between Unlayer save and final dossier presentation.
- 3 distinct chronological phases:
  - *Phase 0 (0-450ms)*: Scanning visual identity.
  - *Phase 1 (450-1300ms)*: Compiling metadata (Vibe, District, Route).
  - *Phase 2 (1300ms+)*: Identity compiled verification with `ShieldCheck` icon, stable serial, and energy ratings.
- Ambient radial backlight themed to the operative's active vibe.

#### [`ProfileCard.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/ProfileCard.jsx)
The responsive, on-screen operative dossier card.
- Used in `CharacterSetup` (live preview) and `FinalResultScreen` (display).
- Fluid Tailwind CSS responsive layout adaptable to mobile viewports (375px+).
- Features: Barcode header, character portrait with CRT scanlines, role icon, underworld stats matrix, heat rating stars, lifestyle activity tag, and dynamic identity archetype badge.

#### [`ExportProfileCard.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/ExportProfileCard.jsx)
A dedicated, off-screen dossier card built exclusively for high-resolution PNG generation.
- **Fixed Geometry**: Exactly `1200px` wide by `1600px` tall.
- **Relative Positioning & Inline Styling**: Uses `position: relative; left: 0px; top: 0px;` with 100% inline CSS style objects rather than Tailwind utility classes, guaranteeing that DOM-to-canvas rendering via `html-to-image` never suffers from dropped styles, font lag, or negative-offset clipping bugs.
- Dynamically renders `resolvedImage` from the Unlayer editor session, guaranteeing that all user filters, stickers, text overlays, and crops appear on the exported card.
- Shows high-DPI stamps, Unlayer accreditation badge, barcode, and clean image rendering without cross-origin blocking on same-origin assets.

#### [`FinalResultScreen.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/FinalResultScreen.jsx)
The climax screen (`screen === 'result'`).
- Mounts celebration confetti particles (`canvas-confetti`).
- Displays the responsive dossier card alongside a **Compiled Identity Summary Panel**.
- **Off-Screen Mounting**: Isolates `<ExportProfileCard>` in a fixed off-screen container (`position: fixed; left: -99999px; top: 0; width: 1200px; height: 1600px; opacity: 1; visibility: visible;`).
- **Download Engine**: Triggers `downloadElementAsPng()` targeting `exportRef.current` with an automated fallback to `cardRef.current`.
- Social Sharing: Native Web Share API integration with automatic fallback to clipboard copy.
- Secondary Actions: "Edit Visual Again" (returns to Unlayer) and "Create Another Operative" (returns to setup).

---

### Data Layer (`src/data/`)

#### [`presets.js`](file:///c:/Users/admin/Desktop/GTA/src/data/presets.js)
Exports an array of 6 curated aesthetic vibes:
- `neon-nights`: High-contrast magenta/cyan night atmosphere.
- `ocean-drive`: Warm sunset coastal palette.
- `downtown-heat`: Aggressive red/orange urban aesthetic.
- `after-dark`: Deep purple/noir surveillance aesthetic.
- `sunset-boulevard`: Cinematic golden hour tones.
- `backstreet`: Gritty street-level green/yellow tones.
- Each preset defines `accent`, `secondary`, `glow`, `badgeBg`, `location`, and `filterAdvice`.

#### [`activities.js`](file:///c:/Users/admin/Desktop/GTA/src/data/activities.js)
Exports 5 signature Vice City lifestyle routes:
- `ride-jetski`: Biscayne Bay high-speed aquatic circuit.
- `visit-deli`: Little Havana street reconnaissance and cubano stop.
- `hit-gym`: Muscle Beach bodybuilding session.
- `cruise-city`: Ocean Drive midnight boulevard cruise.
- `hang-docks`: Pier 42 covert after-hours cargo handoff.
- Each activity defines `title`, `when`, `mood`, `energy`, `location`, and lore description.

#### [`roles.js`](file:///c:/Users/admin/Desktop/GTA/src/data/roles.js)
Exports 9 underworld syndicate roles:
- *Hacker, Street Racer, Fixer, Photographer, Entrepreneur, Detective, Smuggler, Freelancer, Custom*.
- Defines base attributes for Heat (1–5), Street Cred (0–100%), and Bounty Cash.

#### [`demoCharacters.js`](file:///c:/Users/admin/Desktop/GTA/src/data/demoCharacters.js)
Exports 4 complete demo operative profiles (*Mia Santos, Alex Vance, Nova Diaz, Rio Cortez*) with pre-configured vibes, routes, and high-res portrait paths.

---

### Library & Utilities (`src/lib/`)

#### [`identity.js`](file:///c:/Users/admin/Desktop/GTA/src/lib/identity.js)
The deterministic Identity DNA causality engine.
- Contains the 30-entry `DNA_MATRIX` mapping every Vibe Preset to every Lifestyle Route.
- Exports `computeIdentityDNA(preset, activity)` returning unique archetypes like `CHROME PHANTOM`, `CYBER NOIR RUNNER`, or `COASTAL SOVEREIGN`.

#### [`image.js`](file:///c:/Users/admin/Desktop/GTA/src/lib/image.js)
Image processing, asset validation, and canvas 2D pre-grading pipeline.
- `ensureDataUrlWithVibe(imageSource, vibeId)`: Converts source to base64, draws onto an off-screen 1200×1600 canvas (object-fit: cover), applies 2D vibe filters (`contrast`, `saturate`, `hue-rotate`, `sepia`), overlays radial vignette and scanlines via canvas blend modes, and returns the mutated PNG base64 Data URL.
- `ensureDataUrl(imageSource)`: Converts image URLs to base64 Data URLs via `fetch()` and `FileReader` to prevent canvas CORS security errors.
- `validateImageFile(file, maxSizeBytes)`: Validates uploaded user files for image MIME types and enforces a 15 MB file size limit.
- `generateRandomIdentity()`: Generates random Vice City names, aliases, and underworld statistics.

#### [`download.js`](file:///c:/Users/admin/Desktop/GTA/src/lib/download.js)
Client-side image export engine.
- `downloadElementAsPng(element, filename)`: Uses `html-to-image` to serialize a DOM element to a high-quality PNG. Passes explicit width: 1200, height: 1600, `skipFonts: true`, `pixelRatio: 1`, `backgroundColor: '#08070d'`, and forces inline style resets (`left: 0, top: 0, position: relative, opacity: 1, visibility: visible`) to ensure unclipped, non-black rendering.
- `sanitizeFilename(name)`: Cleans operative names for safe OS file naming.

---

### Public Assets (`public/`)

#### [`public/_redirects`](file:///c:/Users/admin/Desktop/GTA/public/_redirects)
Single-page application rewrite rule for Netlify deployments (`/* /index.html 200`).

#### [`public/favicon.svg`](file:///c:/Users/admin/Desktop/GTA/public/favicon.svg)
High-contrast vector neon palm tree icon displayed on browser tabs.

#### `public/assets/characters/`
Four high-resolution character portrait assets:
- `mia.jpg`: Default operative (Street Racer).
- `alex.jpg`: Operative (Hacker / Fixer).
- `nova.jpg`: Operative (Underworld Entrepreneur).
- `rio.jpg`: Operative (Smuggler / Enforcer).

#### `public/assets/backgrounds/`
- `hero-bg.jpg`: Cinematic Vice City neon waterfront skyline backdrop used on the landing screen.

---

## 4. Component Dependency & Import Graph

```
main.jsx
  └── App.jsx
        ├── ProjectHeader.jsx
        ├── LandingHero.jsx
        │     └── demoCharacters.js
        ├── CharacterSetup.jsx
        │     ├── ProfileCard.jsx
        │     ├── presets.js
        │     ├── activities.js
        │     ├── roles.js
        │     ├── demoCharacters.js
        │     ├── identity.js (computeIdentityDNA)
        │     └── image.js (validateImageFile, generateRandomIdentity)
        ├── VisualEditor.jsx
        │     ├── @unlayer/react-image-editor
        │     ├── presets.js
        │     └── image.js (ensureDataUrlWithVibe)
        ├── CompilationScreen.jsx
        │     ├── presets.js
        │     ├── activities.js
        │     └── identity.js (computeIdentityDNA)
        └── FinalResultScreen.jsx
              ├── ProfileCard.jsx
              ├── ExportProfileCard.jsx
              │     ├── presets.js
              │     ├── activities.js
              │     ├── identity.js (computeIdentityDNA)
              │     └── image.js (ensureDataUrl)
              ├── presets.js
              ├── activities.js
              ├── identity.js (computeIdentityDNA)
              └── download.js (downloadElementAsPng, sanitizeFilename)
```

---

## 5. Developer Guide: How to Extend

### Adding a New Vibe Preset
1. Open [`src/data/presets.js`](file:///c:/Users/admin/Desktop/GTA/src/data/presets.js).
2. Add a new preset object with a unique `id`, `name`, `accent`, `secondary`, `glow`, `badgeBg`, and `filterAdvice`.
3. Open [`src/lib/image.js`](file:///c:/Users/admin/Desktop/GTA/src/lib/image.js) and add the corresponding 2D canvas context filter string to `VIBE_FILTERS[yourNewPresetId]`.
4. Open [`src/lib/identity.js`](file:///c:/Users/admin/Desktop/GTA/src/lib/identity.js) and add the corresponding archetype entries to `DNA_MATRIX[yourNewPresetId]` for each of the 5 lifestyle activities.

### Adding a New Lifestyle Activity
1. Open [`src/data/activities.js`](file:///c:/Users/admin/Desktop/GTA/src/data/activities.js).
2. Add an activity object with `id`, `title`, `when`, `mood`, `energy`, and `location`.
3. Add a corresponding Lucide icon mapping in [`ExportProfileCard.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/ExportProfileCard.jsx) and [`ProfileCard.jsx`](file:///c:/Users/admin/Desktop/GTA/src/components/ProfileCard.jsx).
4. Update `DNA_MATRIX` in [`src/lib/identity.js`](file:///c:/Users/admin/Desktop/GTA/src/lib/identity.js) across all presets.

### Adding a New Starter Character
1. Place the portrait JPEG/PNG inside `public/assets/characters/`.
2. Open [`src/data/demoCharacters.js`](file:///c:/Users/admin/Desktop/GTA/src/data/demoCharacters.js).
3. Append a new demo object with the character's name, role, preset, activity, and portrait path (`/assets/characters/your-image.jpg`).
