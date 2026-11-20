// Vice Cover Studio - Main Application Controller
// Event handling, reactive state updates, file uploads, and UI interactions

import { DEFAULT_STATE, LAYOUTS, COLOR_GRADES, EXPORT_SIZES, SAMPLES } from './constants.js';
import { renderCover, exportCoverDataUrl } from './cover.js';
import { handleShotsMode } from './shots.js';

class ViceCoverApp {
  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.loadedImages = {};
    this.canvas = document.getElementById('preview-canvas');
    this.init();
  }

  async init() {
    // Check if running in automated screenshot mode
    const isShot = await handleShotsMode(this);
    if (isShot) return;

    // Normal interactive mode
    await this.preloadSamples();
    this.bindEvents();
    this.render();
  }

  async preloadSamples() {
    const promises = SAMPLES.map(sample => {
      return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.loadedImages[sample.id] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = sample.src;
      });
    });
    await Promise.all(promises);

    // Map default loaded images to panel slots
    this.updateImageSlots();
  }

  updateImageSlots() {
    const primaryImg = this.loadedImages[this.state.sampleId] || Object.values(this.loadedImages)[0];
    const secondaryImg = this.loadedImages['boulevard'] || primaryImg;

    this.activeImgEls = {
      0: primaryImg,
      1: secondaryImg,
      2: primaryImg,
      3: secondaryImg,
      4: primaryImg,
      5: secondaryImg,
      hero: primaryImg,
    };
  }

  bindEvents() {
    // 1. Layout Selector
    const layoutBtns = document.querySelectorAll('[data-layout]');
    layoutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        layoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.layout = btn.dataset.layout;
        this.render();
      });
    });

    // 2. Color Grade Swatches
    const gradeBtns = document.querySelectorAll('[data-grade]');
    gradeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        gradeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.grade = btn.dataset.grade;
        this.render();
      });
    });

    // 3. Caption & Subtitle Inputs
    const captionInput = document.getElementById('caption-input');
    if (captionInput) {
      captionInput.value = this.state.caption;
      captionInput.addEventListener('input', e => {
        this.state.caption = e.target.value;
        this.render();
      });
    }

    const subtitleInput = document.getElementById('subtitle-input');
    if (subtitleInput) {
      subtitleInput.value = this.state.subtitle;
      subtitleInput.addEventListener('input', e => {
        this.state.subtitle = e.target.value;
        this.render();
      });
    }

    // 4. Sliders (Vignette, Grain, Contrast)
    const vignetteSlider = document.getElementById('slider-vignette');
    if (vignetteSlider) {
      vignetteSlider.addEventListener('input', e => {
        this.state.vignette = parseFloat(e.target.value);
        this.render();
      });
    }

    const grainSlider = document.getElementById('slider-grain');
    if (grainSlider) {
      grainSlider.addEventListener('input', e => {
        this.state.grain = parseFloat(e.target.value);
        this.render();
      });
    }

    // 5. Sample Photo Switcher
    const sampleBtns = document.querySelectorAll('[data-sample]');
    sampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sampleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.sampleId = btn.dataset.sample;
        this.updateImageSlots();
        this.render();
      });
    });

    // 6. Custom Photo Upload
    const photoInput = document.getElementById('photo-upload');
    if (photoInput) {
      photoInput.addEventListener('change', e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
          const userImg = new Image();
          userImg.onload = () => {
            this.loadedImages['user'] = userImg;
            this.state.sampleId = 'user';
            this.updateImageSlots();
            this.render();
          };
          userImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // 7. Export Size Selection
    const exportSizeSelect = document.getElementById('export-size-select');
    if (exportSizeSelect) {
      exportSizeSelect.addEventListener('change', e => {
        this.state.exportSize = e.target.value;
        this.resizePreviewCanvas();
        this.render();
      });
    }

    // 8. Export Button
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportImage());
    }

    // 9. Keyboard Shortcuts (Ctrl+Enter to export, [ and ] to switch samples, 1-5 to toggle layouts)
    window.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.exportImage();
      } else if (e.key === '[' || e.key === ']') {
        const sampleKeys = ['pier', 'boulevard'];
        const currentIdx = sampleKeys.indexOf(this.state.sampleId);
        const nextIdx = (currentIdx + (e.key === ']' ? 1 : sampleKeys.length - 1)) % sampleKeys.length;
        this.state.sampleId = sampleKeys[nextIdx];
        document.querySelectorAll('[data-sample]').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.sample === this.state.sampleId);
        });
        this.updateImageSlots();
        this.render();
      } else if (['1', '2', '3', '4', '5'].includes(e.key) && !['input', 'textarea'].includes(document.activeElement?.tagName.toLowerCase())) {
        const layoutKeys = ['five-panel', 'classic-six', 'triptych', 'split', 'solo'];
        const targetLayout = layoutKeys[parseInt(e.key, 10) - 1];
        if (targetLayout) {
          this.state.layout = targetLayout;
          document.querySelectorAll('[data-layout]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layout === targetLayout);
          });
          this.render();
        }
      }
    });

    // Adjust canvas resolution to match current export aspect ratio
    this.resizePreviewCanvas();
  }

  resizePreviewCanvas() {
    const spec = EXPORT_SIZES[this.state.exportSize] || EXPORT_SIZES.square;
    this.canvas.width = spec.w;
    this.canvas.height = spec.h;
  }

  render() {
    renderCover(this.canvas, this.state, this.activeImgEls);
  }

  exportImage() {
    const dataUrl = exportCoverDataUrl(this.state, this.activeImgEls, this.state.exportSize);
    const link = document.createElement('a');
    link.download = `gta6-${this.state.caption.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'cover'}.png`;
    link.href = dataUrl;
    link.click();
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.__app = new ViceCoverApp();
});
