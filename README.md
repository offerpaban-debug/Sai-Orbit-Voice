# 🎙️ SAIORBIT VOICE

> **মানুষের মতো কণ্ঠ, বাংলায়**
> Human-like Bengali Voice, For All

Premium Bengali & Indian Text-to-Speech application with AI-powered voice synthesis.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://saiorbit-voice.pages.dev)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://saiorbit-voice.onrender.com)

---

## ✨ Features

- 🎭 **100% Human-like Bengali Voice** — Natural pronunciation
- ⚡ **Fast Generation** — 1000 words in 30-60 seconds
- 🎨 **Premium UI** — ElevenLabs-style dashboard
- 🌍 **Multi-Language** — Bengali, Hindi, English, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi
- 🎤 **Viral Voice Presets** — Instagram Reels, TikTok, YouTube Shorts optimized
- 🎭 **6 Emotions** — Happy, Calm, Excited, Sad, Angry, Neutral
- 📚 **Voice Library** — Save & manage custom voices
- 📜 **History Panel** — Recent generations
- 💬 **Social Sharing** — WhatsApp, Facebook, Telegram
- 📥 **Download** — WAV & MP3 export
- 🎬 **Subtitle Generator** — .srt file support
- 💎 **100% Free** — No credit card required

---

## 🚀 Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://saiorbit-voice.pages.dev |
| **Backend API** | https://saiorbit-voice.onrender.com |
| **Health Check** | https://saiorbit-voice.onrender.com/api/health |

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- WaveSurfer.js

### Backend
- Node.js
- Express
- TypeScript
- Google Gemini API
- Google Cloud TTS

### Deployment
- **Frontend:** Cloudflare Pages
- **Backend:** Render
- **Storage:** Google Drive 5TB

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key

### Local Setup

```bash
# 1. Clone repository
git clone https://github.com/offerpaban-debug/Sai-Orbit-Voice.git
cd Sai-Orbit-Voice

# 2. Install dependencies
npm install --include=dev

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# 4. Run development server
npm run dev

# 5. In another terminal, run backend
npx tsx server.ts
