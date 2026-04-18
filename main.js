// Marked.js is loaded via script tag in HTML (window.marked)
// We only need to initialize the UI logic here.

// ── DOM References ────────────────────────────────────────────────────────────
const tabBtns         = document.querySelectorAll('.tab-btn');
const tabIndicator    = document.querySelector('.tab-indicator');
const userInput       = document.getElementById('userInput');
const currentChar     = document.getElementById('currentChar');
const processBtn      = document.getElementById('processBtn');
const btnText         = document.getElementById('btnText');
const btnLoader       = processBtn.querySelector('.loader');
const btnContent      = processBtn.querySelector('.btn-content');
const progressSection = document.getElementById('progressSection');
const statusText      = document.getElementById('statusText');
const percentageText  = document.getElementById('percentageText');
const progressBar     = document.getElementById('progressBar');
const outputSection   = document.getElementById('outputSection');
const outputContent   = document.getElementById('outputContent');
const copyBtn         = document.getElementById('copyBtn');

// ── State ─────────────────────────────────────────────────────────────────────
let currentMode = 'summarize';
let worker      = null;
let isBusy      = false;

// ── Tab Switching ─────────────────────────────────────────────────────────────
const tabConfig = {
    summarize: {
        placeholder: 'Paste a long article, document, or any text here to get a clean bullet-point summary...',
        btnLabel: '✦ Summarize Text',
    },
    generate: {
        placeholder: 'Type a prompt, e.g. "Write a Python function to sort a list of dicts by a key value" ...',
        btnLabel: '✦ Generate Content',
    },
};

tabBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        if (isBusy) return;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tabIndicator.style.transform = `translateX(${i * 100}%)`;
        currentMode          = btn.dataset.tab;
        userInput.placeholder = tabConfig[currentMode].placeholder;
        btnText.textContent   = tabConfig[currentMode].btnLabel;
        resetOutputArea();
    });
});

// ── Char Counter ──────────────────────────────────────────────────────────────
userInput.addEventListener('input', () => {
    currentChar.textContent = userInput.value.length;
});

// ── Copy Button ───────────────────────────────────────────────────────────────
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputContent.innerText).then(() => {
        const icon = copyBtn.querySelector('i');
        icon.className = 'ph ph-check';
        icon.style.color = '#10b981';
        setTimeout(() => {
            icon.className = 'ph ph-copy';
            icon.style.color = '';
        }, 2000);
    });
});

// ── Process Button ────────────────────────────────────────────────────────────
processBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (!text) {
        shake(userInput);
        return;
    }
    if (currentMode === 'summarize' && text.split(/\s+/).length < 30) {
        showError('Please paste at least 30 words to summarize.');
        return;
    }
    startProcessing(text);
});

// ── Worker Communication ──────────────────────────────────────────────────────
function startProcessing(text) {
    isBusy = true;
    setBusyUI(true);
    resetOutputArea();
    progressSection.classList.remove('hidden');
    setProgress(0, 'Initializing...');

    if (!worker) {
        worker = new Worker('worker.js', { type: 'module' });
    }

    worker.onmessage = handleWorkerMessage;
    worker.onerror   = (err) => {
        showError('Worker error: ' + err.message);
        setBusyUI(false);
        isBusy = false;
    };

    worker.postMessage({ mode: currentMode, text });
}

function handleWorkerMessage(event) {
    const { type, status, progress, text, output, message } = event.data;

    if (type === 'progress') {
        setProgress(progress, text);
    } else if (type === 'result') {
        progressSection.classList.add('hidden');
        renderOutput(output);
        setBusyUI(false);
        isBusy = false;
    } else if (type === 'error') {
        progressSection.classList.add('hidden');
        showError(message);
        setBusyUI(false);
        isBusy = false;
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function setProgress(pct, label) {
    progressBar.style.width    = pct + '%';
    statusText.textContent     = label || 'Processing...';
    percentageText.textContent = pct + '%';
}

function setBusyUI(busy) {
    processBtn.disabled    = busy;
    btnContent.classList.toggle('hidden', busy);
    btnLoader.classList.toggle('hidden', !busy);
}

function resetOutputArea() {
    outputSection.classList.add('hidden');
    outputContent.innerHTML = '';
}

function renderOutput(markdownText) {
    outputSection.classList.remove('hidden');
    outputContent.innerHTML = window.marked.parse(markdownText);
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(msg) {
    outputSection.classList.remove('hidden');
    outputContent.innerHTML = `<p style="color:#ef4444"><strong>Error:</strong> ${msg}</p>`;
}

function shake(el) {
    el.style.animation = 'none';
    el.style.borderColor = '#ef4444';
    el.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(0)' },
    ], { duration: 350, easing: 'ease' }).onfinish = () => {
        el.style.borderColor = '';
    };
}
