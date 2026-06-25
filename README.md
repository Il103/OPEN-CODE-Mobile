# OPEN CODE Mobile 🌊

> AI Coding Agent for Android — Liquid Glass UI

<p align="center">
  <img src="src/assets/icons/icon.svg" width="200" alt="OPEN CODE Mobile">
</p>

<p align="center">
  <strong>The most beautiful AI coding assistant for your phone.</strong><br>
  Liquid Glass interface • iOS 27‑style animations • Multi‑model AI
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌊 **Liquid Glass UI** | Stunning glass morphism interface with floating particles |
| 🤖 **Multi‑Model AI** | GPT‑4, GPT‑3.5, Claude 3, Gemini — pick your engine |
| ✨ **iOS 27 Animations** | Buttery‑smooth spring animations, typing indicators, message reveals |
| 🎨 **3 Themes** | Dark, Light, Ocean — each with its own Liquid Glass palette |
| 📱 **Mobile Native** | Built with Capacitor — real APK, not a web wrapper |
| 🔒 **Privacy First** | Your API key stays on your device. No cloud, no tracking |
| ⚡ **Code Highlighting** | In‑message syntax‑highlighted code blocks with one‑tap copy |
| 🎯 **Zero Setup** | Works in demo mode without an API key |

## 🚀 Quick Start

### Download APK

Grab the latest APK from the [**Releases**](https://github.com/Il103/OPEN-CODE-Mobile/releases) page.

### Build yourself

```bash
# 1. Clone
git clone https://github.com/Il103/OPEN-CODE-Mobile.git
cd OPEN-CODE-Mobile

# 2. Install
npm install

# 3. Add Android platform
npx cap init "OPEN CODE Mobile" "com.opencode.mobile" --webDir src
npx cap add android

# 4. Sync & Build
npx cap sync android
cd android && ./gradlew assembleDebug

# APK → android/app/build/outputs/apk/debug/app-debug.apk
```

## 🛠️ Tech Stack

- **Frontend** — HTML / CSS / JavaScript (vanilla, zero framework weight)
- **Animations** — CSS `backdrop-filter`, Web Animations API, spring easing
- **Mobile** — [Capacitor](https://capacitorjs.com) (native APK wrapper)
- **AI APIs** — OpenAI / Anthropic / Google Gemini (bring your own key)

## 🎨 Liquid Glass

The UI is built around **glass morphism** — a frosted‑glass effect powered by
`backdrop-filter: blur()` and semi‑transparent backgrounds with subtle borders.

Floating particles drift across the screen, animated gradients shift in the
background, and every interaction — sending a message, opening the menu,
receiving a reply — triggers a buttery‑smooth spring animation.

## 🤖 AI Models

Configure your preferred model in Settings:

| Model | Provider | API Endpoint |
|-------|----------|-------------|
| GPT‑4 | OpenAI | `api.openai.com` |
| GPT‑3.5 | OpenAI | `api.openai.com` |
| Claude 3 | Anthropic | `api.anthropic.com` |
| Gemini | Google | `generativelanguage.googleapis.com` |

> **Demo mode** works without any API key — perfect for previewing the UI.

## 📦 Build with GitHub Actions

Every push triggers an automated build. The debug APK is available as a
build artifact. To create a **Release**:

1. Go to **Actions** → **Build OPEN CODE Mobile APK**
2. Click **Run workflow**
3. Set **Create a GitHub Release** → `true`
4. Optionally set a version tag (e.g. `v1.0.1`)

## 🔐 Signing (Release Builds)

For release APKs, add these **repository secrets**:

| Secret | Description |
|--------|-------------|
| `ANDROID_KEYSTORE` | Base64‑encoded keystore file |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Key alias |
| `KEY_PASSWORD` | Key password |

Without these, the workflow builds an **unsigned debug APK** which is
perfectly fine for personal use.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Il103">Il103</a><br>
  Powered by <a href="https://opencode.ai">OPEN CODE</a>
</p>
