# Code-a-Pookalam — Onam Floral Mandala Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![p5.js](https://img.shields.io/badge/p5.js-1.9.0-orange.svg)](https://p5js.org/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Competition](https://img.shields.io/badge/Code--a--Pookalam-2025-red.svg)](https://onam-games.pages.dev/code-a-pookalam/submit)

> A procedurally generated **Athapookalam** (Onam floral mandala) rendered in 1024×1024 PNG using pure mathematics — no randomness, no external assets, fully reproducible.

---

## 🎨 Preview

| Generated Output | Live Demo |
|:----------------:|:---------:|
| ![Pookalam Render](pookalam-render.png) | [Open in Browser](#-quick-start) |

> **Note:** The preview above is the actual competition submission render (`pookalam-render.png`). Open `index.html` in a browser to generate it yourself.

---

## 📖 Table of Contents

- [Concept](#-concept)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Export Render](#-export-render-1024×1024-png)
- [Project Structure](#-project-structure)
- [Reproducibility](#-reproducibility)
- [Algorithm Overview](#-algorithm-overview)
- [Competition Entry](#-competition-entry)
- [License](#-license)
- [Credits](#-credits)

---

## 💡 Concept

This project recreates the geometry of a traditional **Athapookalam** — the floral mandala laid during Onam festival in Kerala. Key design principles:

- **Strict radial symmetry** — every layer uses `TWO_PI / N` tiling
- **Floral/teardrop petals** — constructed via cubic Bézier approximation (no `bezierVertex`, works in 2D canvas)
- **Authentic Onam palette** — maroon, mustard yellow, orange, deep green, white, crimson
- **7 concentric layers** — each a distinct geometric motif:
  1. Diamond checkerboard border (5 interlocking color bands)
  2. Swirl/spiral ring (29 orange-white-maroon ribbons)
  3. Inner petal ring (12 large teardrop petals + 12 pinwheel flowers)
  4. Lotus buds in interstitial gaps (6 minimalist buds)
  5. Central medallion (6 layered petals + concentric detail rings)

---

## 🛠 Tech Stack

| Component | Choice |
|-----------|--------|
| **Runtime** | Browser (ES6+) |
| **Graphics** | p5.js 1.9.0 (via CDN) |
| **Language** | Vanilla JavaScript (no build step) |
| **Output** | 1024×1024 PNG (deterministic) |
| **Dependencies** | Zero local dependencies |

---

## 🚀 Quick Start

### Prerequisites
- Any modern browser (Chrome, Firefox, Safari, Edge)
- A local static server (required for ES modules / p5.js CDN)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/code-a-pookalam.git
cd code-a-pookalam

# 2. Start a static server (choose one)

# Option A: Python 3 (recommended, pre-installed on most systems)
python -m http.server 8000

# Option B: Node.js (npx)
npx serve .

# Option C: VS Code — Right-click index.html → "Open with Live Server"

# 3. Open http://localhost:8000 in your browser
```

The mandala renders instantly on page load (`noLoop()`).

---

## 💾 Export Render (1024×1024 PNG)

| Method | Action |
|--------|--------|
| **Keyboard** | Press `S` or `s` |
| **Button** | Click **"Save PNG (1024×1024)"** below the canvas |

- File saves as `pookalam-render.png` (exactly 1024×1024 pixels)
- No post-processing, no compression artifacts
- `pixelDensity(1)` ensures deterministic pixel output

---

## 📁 Project Structure

```
code-a-pookalam/
├── index.html      # Canvas setup + p5.js CDN import
├── sketch.js       # All generative logic (~1000 lines)
├── style.css       # Centered canvas, export button UI
├── LICENSE         # MIT License
├── README.md       # This file
└── pookalam-render.png  # Competition submission render (generated)
```

---

## 🔬 Reproducibility

This project is **fully deterministic** — same code + same browser = identical PNG every time.

| Guarantee | Implementation |
|-----------|----------------|
| Fixed canvas size | `createCanvas(1024, 1024)` |
| No pixel scaling | `pixelDensity(1)` |
| No randomness | `Math.random()` never called |
| No external assets | All geometry computed at runtime |
| Pinned CDN version | `p5@1.9.0` (exact version in `index.html`) |

> **Verification:** Run twice, `diff` the PNGs — they will be byte-identical.

---

## ⚙️ Algorithm Overview

```
draw() → translate(center)
  ├─ Layer 1: drawCheckerboard()       → 200 diamonds × 5 color bands
  ├─ Layer 2: White separator ring
  ├─ Layer 3: drawSwirlRing()          → 29 spirals via drawSpiral()
  ├─ Layer 4: White separator ring
  ├─ Layer 5: drawInnerPetalRing()     → 12 teardrops + 12 pinwheels
  ├─ Layer 6: drawMinimalLotus() × 6   → Lotus buds in gaps
  └─ Layer 7: drawCenterMedallion()    → 6 layered petals + detail rings
```

**Core primitives:**
- `bezierPoints(p0,p1,p2,p3,n)` — cubic Bézier sampling (polynomial form)
- `drawLeafShape(baseX, tipX, width, color)` — symmetric petal via dual Bézier
- `drawTeardrop(tipX, len, width, color)` — variant with tip at origin
- Canvas gradient for seamless orange ribbon (no WebGL, no gaps)

---

## 🏆 Competition Entry

This project was built for **[Code-a-Pookalam 2025](https://onam-games.pages.dev/code-a-pookalam/submit)**.

| Requirement | Status |
|-------------|--------|
| ✅ 1024×1024 PNG output | `pookalam-render.png` |
| ✅ Public repository | This repo |
| ✅ Open-source license | MIT |
| ✅ Runnable from scratch | `python -m http.server` |
| ✅ No watermarks/identifiers | Clean render |
| ✅ Tagged release | `v1.0.0` |

**Judging pillars targeted:**
- 🎨 **Visual Quality & Polish** — authentic palette, crisp geometry, 7-layer depth
- ⚙️ **Technical Complexity** — Bézier approximation, gradient ribbons, layered petals
- 🌿 **Closeness to Real Pookalam** — concentric floral rings, traditional symmetry
- 📦 **Open-Source & Reproducibility** — zero deps, deterministic, documented

---

## 📄 License

**MIT License** — see [LICENSE](LICENSE) for details.

You are free to use, modify, and distribute this code for any purpose.

---

## 🙏 Credits

- **Author:** [Your Name / GitHub Handle](https://github.com/YOUR_USERNAME)
- **Graphics Library:** [p5.js](https://p5js.org/) (LGPL 2.1)
- **Inspiration:** Traditional Athapookalam designs of Kerala
- **Competition:** [Onam Games — Code-a-Pookalam](https://onam-games.pages.dev/code-a-pookalam/submit)

---

> **Generated with 🪷 for Onam 2025**