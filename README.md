# NeuralForge — Local AI Text Tool

> **Zero API. Zero cost. 100% private.** Runs entirely in your browser using Transformers.js.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://ayanlogix.github.io/neuralforge)

## Features

- **Text Summarizer** — Paste any article or document and get a clean bullet-point summary
- **Content Generator** — Type a prompt and get AI-generated text
- **Fully Local** — Models run via WebAssembly in your browser (Transformers.js)
- **Cached Models** — Downloads once, works offline after that
- **No API Key** — No OpenAI, no Gemini, no cost

## Tech Stack

| Layer | Technology |
|---|---|
| UI | HTML5 + Vanilla CSS + Vanilla JS |
| AI Runtime | [Transformers.js](https://huggingface.co/docs/transformers.js) (Xenova) |
| Summarizer | `Xenova/distilbart-cnn-6-6` |
| Generator | `Xenova/flan-t5-small` |
| Hosting | GitHub Pages |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ayanlogix/neuralforge.git
cd neuralforge

# Serve locally (any static server works)
python -m http.server 5500
# Then open http://localhost:5500
```

## How It Works

1. The first time you click **Summarize** or **Generate**, the browser downloads the relevant model (~100–200MB) from Hugging Face CDN
2. The model is cached permanently in your browser (IndexedDB)
3. All inference runs in a **Web Worker** — the UI stays completely responsive
4. Your text **never leaves your machine**

## Project Structure

```
neuralforge/
├── index.html      # UI layout and structure
├── style.css       # Premium dark theme + glassmorphism
├── main.js         # UI controller and event handling
└── worker.js       # Transformers.js inference (runs off main thread)
```

---

Built with [Transformers.js](https://github.com/xenova/transformers.js) by Xenova/Hugging Face.

## Author

Ayan Hussain (ayanlogix)

Focused on AI, web development, and automation systems.
