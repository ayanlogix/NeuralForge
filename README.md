[![Status](https://img.shields.io/badge/status-active-success?style=flat-square)](https://github.com/ayanlogix/NeuralForge)
[![Built With](https://img.shields.io/badge/built%20with-JavaScript-yellow?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![AI](https://img.shields.io/badge/AI-Transformers.js-blue?style=flat-square)](https://huggingface.co/docs/transformers.js)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/ayanlogix/NeuralForge/blob/main/LICENSE)

<br>

# 🚀 NeuralForge | Local AI Text Tool

⭐ If you like this project, give it a star!

<br>

> **Zero API. Zero cost. 100% private.**  
> Runs entirely in your browser using Transformers.js.

<br>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://ayanlogix.github.io/NeuralForge/)

---

## 🖼️ Preview

![NeuralForge Preview](https://via.placeholder.com/1200x600.png?text=NeuralForge+Preview)

---

## ✨ Features

- **Text Summarizer** — Paste any article or document and get a clean bullet-point summary  
- **Content Generator** — Type a prompt and get AI-generated text  
- **Fully Local** — Models run via WebAssembly in your browser (Transformers.js)  
- **Cached Models** — Downloads once, works offline after that  
- **No API Key** — No OpenAI, no Gemini, no cost  

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| UI | HTML5 + Vanilla CSS + Vanilla JS |
| AI Runtime | [Transformers.js](https://huggingface.co/docs/transformers.js) (Xenova) |
| Summarizer | `Xenova/distilbart-cnn-6-6` |
| Generator | `Xenova/flan-t5-small` |
| Hosting | GitHub Pages |

---

## ⚡ Getting Started

```bash
# Clone the repo
git clone https://github.com/ayanlogix/neuralforge.git
cd neuralforge

# Serve locally
python -m http.server 5500
