import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Allow model caching in browser
env.allowLocalModels = false;
env.useBrowserCache = true;

let summarizer = null;
let generator = null;

// Report progress back to main thread
function sendProgress(status, progress = 0, text = '') {
    self.postMessage({ type: 'progress', status, progress, text });
}

// Load models on demand
async function loadSummarizer() {
    if (summarizer) return;
    sendProgress('loading', 0, 'Downloading summarization model...');
    summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6', {
        progress_callback: (info) => {
            if (info.status === 'downloading' && info.total) {
                const pct = Math.round((info.loaded / info.total) * 100);
                sendProgress('loading', pct, `Downloading model... ${pct}%`);
            }
        }
    });
    sendProgress('ready', 100, 'Model ready!');
}

async function loadGenerator() {
    if (generator) return;
    sendProgress('loading', 0, 'Downloading text generation model...');
    generator = await pipeline('text2text-generation', 'Xenova/flan-t5-small', {
        progress_callback: (info) => {
            if (info.status === 'downloading' && info.total) {
                const pct = Math.round((info.loaded / info.total) * 100);
                sendProgress('loading', pct, `Downloading model... ${pct}%`);
            }
        }
    });
    sendProgress('ready', 100, 'Model ready!');
}

// Listen for messages from main thread
self.addEventListener('message', async (event) => {
    const { mode, text } = event.data;

    try {
        if (mode === 'summarize') {
            await loadSummarizer();
            sendProgress('running', 100, 'Summarizing...');

            const chunks = chunkText(text, 900);
            const results = [];

            for (let i = 0; i < chunks.length; i++) {
                sendProgress('running', 100, `Processing chunk ${i + 1} of ${chunks.length}...`);
                const out = await summarizer(chunks[i], {
                    max_new_tokens: 180,
                    min_new_tokens: 30,
                });
                results.push(out[0].summary_text);
            }

            const finalSummary = results.join('\n\n');
            self.postMessage({ type: 'result', output: formatSummary(finalSummary) });

        } else if (mode === 'generate') {
            await loadGenerator();
            sendProgress('running', 100, 'Generating response...');

            const out = await generator(text, {
                max_new_tokens: 250,
            });

            self.postMessage({ type: 'result', output: out[0].generated_text });
        }
    } catch (err) {
        self.postMessage({ type: 'error', message: err.message });
    }
});

// Split long text into smaller chunks for the model
function chunkText(text, maxWords) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(' '));
    }
    return chunks;
}

// Format raw summary into markdown
function formatSummary(text) {
    const sentences = text
        .replace(/([.!?])\s+/g, '$1\n')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

    if (sentences.length <= 1) return `**Summary**\n\n${text}`;

    const bullets = sentences.map(s => `- ${s}`).join('\n');
    return `## 📝 Summary\n\n${bullets}`;
}
