# Vice City Character Studio 🌴✨

[![#BuiltWithImageEditor](https://img.shields.io/badge/%23BuiltWithImageEditor-Unlayer%20Challenge-ff2a85?style=for-the-badge)](https://www.linkedin.com/posts/unlayer_builtwithimageeditor-activity-7501266371553452032-RB8U)
[![React](https://img.shields.io/badge/React-18-00f0ff?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-8a2be2?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Unlayer](https://img.shields.io/badge/@unlayer/react--image--editor-1.0.2-ffd000?style=for-the-badge)](https://www.npmjs.com/package/@unlayer/react-image-editor)

**Vice City Character Studio** is an original GTA VI-inspired character customization web experience built for the **Unlayer Build with React Image Editor Challenge**. 

Create your neon Vice City underworld identity, watch your chosen Vibe physically grade your operative's portrait via an off-screen HTML5 Canvas pre-processing pipeline, customize the visual with the official **Unlayer React Image Editor** using authentic canvas tools (filters, crop, text, stickers, shapes, frames), experience a cinematic compilation sequence, and export a high-resolution 1200×1600px unclipped street dossier card.

---

## ⚡ Core Features

- 🌆 **Cinematic Vice City Aesthetics**: Immersive synthwave dark mode, CRT scanlines, animated neon glows, glassmorphic HUD panels, and dynamic typography.
- 🔮 **Visual Causality & Pixel Transformation**: User choices do not merely toggle metadata. Selecting a Vibe preset physically grades the image pixels on an off-screen 1200×1600 canvas (with custom 2D context filters, vignette, and scanlines) before mounting into Unlayer.
- 🎨 **Real Unlayer Image Editor Integration**: Powered directly by `@unlayer/react-image-editor`. No mock tools—real cropping, resizing, color grading, text layers, stickers, and decorative frames with a live tri-state HUD indicator (`PREPARING IMAGE...` $\rightarrow$ `LOADING CANVAS...` $\rightarrow$ `CANVAS READY`).
- 🧬 **Identity DNA Engine**: Pairing your Vibe with your Lifestyle Route deterministically produces one of 30 unique underworld archetypes (*Chrome Phantom, Cyber Noir Runner, Wave Runner, Harbor Enforcer, etc.*) alongside a stable verification serial (`VC-XXXX`).
- 🕶️ **Character Identity & Underworld Roles**: Choose from 9 specialized roles (*Hacker, Street Racer, Fixer, Photographer, Entrepreneur, Detective, Smuggler, Freelancer, Custom*) with tailored Heat, Street Cred, and Bounty statistics.
- 🌴 **Vice City Vibe Presets**: 6 dynamic lighting and tone presets (*Neon Nights, Ocean Drive, Downtown Heat, After Dark, Sunset Boulevard, Backstreet*) driving both the canvas color grading and interface styling.
- 🏎️ **"Your Vice City Life" Lifestyle Activities**: Inspired by GTA VI lifestyle themes—select your character's evening route:
  - *Ride the Jet Ski* (Biscayne Bay water run)
  - *Visit the Local Deli* (Little Havana neighborhood exploration)
  - *Hit the Gym* (Muscle Beach iron session)
  - *Cruise the City* (Ocean Drive midnight boulevard run)
  - *Hang at the Docks* (Pier 42 covert after-hours cargo handoff)
- 🎬 **Cinematic 2.2s Compilation Sequence**: A multi-phase transition with concentric radar spinners and ambient vibe-colored lighting that bridges editing into the final dossier reveal.
- 🖼️ **Dual Visual Ingestion**: Upload custom photos (with client-side validation) or pick from 4 pre-loaded high-resolution starter characters (*Mia, Alex, Nova, Rio*).
- 🪪 **Decoupled 1200×1600px High-Res Export**: Download an unclipped, high-contrast 1200×1600px PNG street dossier card with barcode, district stamps, security verification, and preserved visual edits via client-side DOM serialization.
- 📱 **Fully Responsive**: Seamless layout scaling from mobile viewports (375px+) to ultra-wide displays.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Image Editing Engine**: [`@unlayer/react-image-editor`](https://www.npmjs.com/package/@unlayer/react-image-editor)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom Cyber Synthwave Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Exporting**: [`html-to-image`](https://github.com/bubkoo/html-to-image)
- **Effects**: [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti)

---

## 🧠 How It Works: The 5-Step Journey

```
01: IDENTITY SETUP          02: VIBE PRE-GRADING          03: UNLAYER STUDIO
Name, Role, Vibe,    ───►   Off-Screen 1200x1600   ───►   Stickers, Text, Frame,
Route & Portrait            Canvas Filter & Blend         Crop & Custom Colors
                                                                  │
                                                                  ▼
05: DOSSIER EXPORT          04: COMPILATION ENGINE
1200x1600 Unclipped  ◄───   2.2s Multi-Phase Radar
High-Res PNG Card           Identity Verification
```

1. **Step 1: Character Setup**: Configure your street operative's name, underworld alias, syndicate role, heat rating, ambient lighting vibe preset, and signature lifestyle activity.
2. **Step 2: Visual Ingestion & Pre-Grading**: Pick from high-res starter operative portraits or upload your custom photograph. The engine converts the image to base64 and renders it onto an off-screen 1200×1600 canvas with vibe-specific 2D filters, vignette, and scanlines.
3. **Step 3: Unlayer Image Studio**: Launch into the official `@unlayer/react-image-editor`. Apply neon filters, crop to composition, add custom typography taglines, and decorate with stickers/frames.
4. **Step 4: Save & Compile Dossier**: On save, the edited canvas image is captured as a base64 Data URL and compiled into a classified Vice City dossier during a 2.2s cinematic transition.
5. **Step 5: High-Res Export**: Export a dedicated, unclipped 1200×1600px PNG dossier card via client-side DOM serialization (`html-to-image`) with guaranteed `(0, 0)` alignment and automated fallback.

---

## 🎨 React Image Editor Integration

The Unlayer React Image Editor (`@unlayer/react-image-editor`) is the visual heartbeat of the experience:
- **Two-Stage Ingestion Pipeline**:
  - *Stage 1*: `ensureDataUrlWithVibe()` pre-grades the image on an off-screen canvas using custom 2D context filters (`contrast`, `saturate`, `hue-rotate`, `sepia`) and blend overlays.
  - *Stage 2*: Pre-graded base image mounts directly into Unlayer's canvas, allowing the user to customize with native tools.
- **Zero CORS / Iframe Conflicts**: Images are pre-converted to base64 Data URLs before mounting into the editor canvas, ensuring seamless cross-origin handling.
- **Native Suite**: Features Unlayer's complete editing suite including Filters, Crop, Resize, Drawing, Text, Shapes, Stickers, and Frames.
- **Tri-State Lifecycle HUD**:
  - `PREPARING IMAGE...` (Amber pulse): Off-screen canvas grading running.
  - `LOADING CANVAS...` (Cyan pulse): Mounting Unlayer Image Editor instance.
  - `CANVAS READY` (Neon green pulse): Unlayer canvas is fully interactive.
- **Fail-Safe Persistence**: Saves output through Unlayer's native `onSave` event and fallback programmatic canvas getters (`editorRef.current.editor.getImage()`).

---

## 📚 Technical Documentation

For in-depth architectural and structural details, refer to:
- [**`ARCHITECTURE.md`**](./ARCHITECTURE.md): Comprehensive system specification, state machine lifecycle, identity DNA matrix, Unlayer integration pipeline, and export architecture.
- [**`FILE_STRUCTURE.md`**](./FILE_STRUCTURE.md): Detailed repository layout, component breakdown, data schemas, utility APIs, and extension guides.

---

## 💻 Run Locally

### 1. Clone & Install

```bash
git clone https://github.com/Viidhii19/vice-city-character-studio.git
cd vice-city-character-studio
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Preview

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment

This project is a 100% client-side React SPA that builds into static assets in `dist/`.

### Deploy to Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. The included `vercel.json` automatically configures SPA routing rewrites.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Deploy to Netlify

1. Push your repository to GitHub.
2. Connect repository in [Netlify](https://www.netlify.com).
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. The included `public/_redirects` ensures seamless SPA routing.
6. Click **Deploy Site**.

### Deploy to Cloudflare Pages

1. In Cloudflare Dashboard, navigate to **Workers & Pages** > **Create application** > **Pages**.
2. Connect your GitHub repository.
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Click **Save and Deploy**.

---

## 🚀 Live Demo

- **Production URL**: https://vice-city-character-studio.vercel.app/
- **Submission Hashtag**: `#BuiltWithImageEditor`

---

## 🏆 Challenge Information

Built for the **Unlayer Build with React Image Editor Challenge**.

- **Challenge Post**: [LinkedIn Announcement](https://www.linkedin.com/posts/unlayer_builtwithimageeditor-activity-7501266371553452032-RB8U)
- **Challenge FAQ**: [Notion FAQ Guide](https://unlayer.notion.site/Build-With-Image-Editor-Challenge-FAQ-3cf0ceb4c8e180309d91cd730811ebd1)
- **React Image Editor**: [@unlayer/react-image-editor on npm](https://www.npmjs.com/package/@unlayer/react-image-editor)

---

## 👏 Credits

- **Image Editor Engine**: [@unlayer/react-image-editor](https://github.com/unlayer/react-image-editor) by Unlayer
- **Icons**: [Lucide React](https://lucide.dev)
- **Design & Code**: Vice City Character Studio

---

## ⚖️ Disclaimer

*This is an unofficial, original fan-inspired concept created exclusively for the Unlayer Build with React Image Editor Challenge. It is not affiliated with, endorsed by, or associated with Rockstar Games or Take-Two Interactive.*
