import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Lock,
  Unlock,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  RotateCw,
  FlipHorizontal2,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Maximize2,
  Minimize2,
  UserCheck,
  PenTool,
  Crop,
  Wand2,
  Paintbrush,
  Eraser,
  Shield,
  Eye,
  Check,
  Droplets,
} from 'lucide-react';

const PRESETS = [
  {
    id: 'passport',
    label: 'Passport',
    dimensions: '300 × 300',
    width: 300,
    height: 300,
    targetKB: 100,
    fitMode: 'cover',
    keyMode: 'edge',
    icon: UserCheck,
  },
  {
    id: 'signature',
    label: 'Signature',
    dimensions: '300 × 80',
    width: 300,
    height: 80,
    targetKB: 60,
    fitMode: 'contain',
    keyMode: 'paper',
    icon: PenTool,
  },
  {
    id: 'nid',
    label: 'NID / Visa',
    dimensions: '400 × 500',
    width: 400,
    height: 500,
    targetKB: 100,
    fitMode: 'cover',
    keyMode: 'edge',
    icon: UserCheck,
  },
];

const BG_OPTIONS = [
  { id: 'original', label: 'Original', color: null },
  { id: 'white', label: 'White', color: '#FFFFFF' },
  { id: 'blue', label: 'Studio Blue', color: '#1D63B8' },
  { id: 'blur', label: 'BG Blur', color: 'blur' },
];

const EFFECT_PRESETS = [
  { id: 'natural', label: 'Natural', brightness: 0, contrast: 0, saturation: 0, warmth: 0, sharpness: 0, blur: 0 },
  { id: 'studio', label: 'Studio Bright', brightness: 10, contrast: 12, saturation: 8, warmth: 4, sharpness: 25, blur: 0 },
  { id: 'warm', label: 'Warm Glow', brightness: 6, contrast: 8, saturation: 14, warmth: 18, sharpness: 15, blur: 0 },
  { id: 'bw', label: 'Crisp B&W', brightness: 4, contrast: 20, saturation: -100, warmth: 0, sharpness: 20, blur: 0 },
  { id: 'scan', label: 'Clean Ink', brightness: 14, contrast: 32, saturation: -20, warmth: 0, sharpness: 35, blur: 0 },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      mimeType,
      mimeType === 'image/png' ? undefined : quality
    );
  });
}

async function compressToTargetSize(canvas, mimeType, targetBytes) {
  if (mimeType === 'image/png') {
    const blob = await canvasToBlob(canvas, mimeType, 1);
    return { blob, quality: 1 };
  }
  const highBlob = await canvasToBlob(canvas, mimeType, 0.95);
  if (highBlob && highBlob.size <= targetBytes) {
    return { blob: highBlob, quality: 0.95 };
  }

  let low = 0.05;
  let high = 0.94;
  let bestUnder = null;
  let bestQuality = 0.05;
  let smallestBlob = highBlob;
  let smallestQuality = 0.95;

  for (let i = 0; i < 8; i += 1) {
    const mid = (low + high) / 2;
    const blob = await canvasToBlob(canvas, mimeType, mid);
    if (!blob) break;
    if (!smallestBlob || blob.size < smallestBlob.size) {
      smallestBlob = blob;
      smallestQuality = mid;
    }
    if (blob.size <= targetBytes) {
      bestUnder = blob;
      bestQuality = mid;
      low = mid + 0.01;
    } else {
      high = mid - 0.01;
    }
  }
  return bestUnder
    ? { blob: bestUnder, quality: bestQuality }
    : { blob: smallestBlob, quality: smallestQuality };
}

/**
 * Computes edge-aware, face-safe background alpha mask + manual brush overrides.
 */
function applyFaceSafeBackgroundMask(
  offscreenCanvas,
  drawRect,
  { tolerance, mode, deepenInk, protectFace, feather, manualMask }
) {
  const w = offscreenCanvas.width;
  const h = offscreenCanvas.height;
  const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Apply paper/ink keying for signatures
  if (mode === 'paper') {
    const threshold = 255 - tolerance * 2.1;
    const featherRange = 28;
    for (let p = 0; p < w * h; p += 1) {
      const i = p * 4;
      const override = manualMask && manualMask.length === w * h ? manualMask[p] : 0;
      if (override === 1) continue;
      if (override === 2) {
        data[i + 3] = 0;
        continue;
      }

      const a = data[i + 3];
      if (a === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);

      if (tolerance > 0 && luma >= threshold && saturation < 55) {
        data[i + 3] = 0;
      } else if (tolerance > 0 && luma >= threshold - featherRange && saturation < 55) {
        const ratio = (threshold - luma) / featherRange;
        data[i + 3] = Math.round(a * Math.max(0, Math.min(1, ratio)));
      } else if (deepenInk && luma < 175) {
        data[i] = Math.max(0, Math.round(r * 0.55));
        data[i + 1] = Math.max(0, Math.round(g * 0.55));
        data[i + 2] = Math.max(0, Math.round(b * 0.55));
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return;
  }

  // Portrait mode: edge-contrast barrier + inner face safe-zone + BFS flood fill
  if (tolerance > 0) {
    const x0 = Math.max(0, Math.floor(drawRect.x));
    const y0 = Math.max(0, Math.floor(drawRect.y));
    const x1 = Math.min(w - 1, Math.ceil(drawRect.x + drawRect.w) - 1);
    const y1 = Math.min(h - 1, Math.ceil(drawRect.y + drawRect.h) - 1);

    if (x1 >= x0 && y1 >= y0) {
      const sampleCoords = [
        [x0, y0],
        [x1, y0],
        [Math.floor((x0 + x1) / 2), y0],
        [x0, Math.floor((y0 + y1) * 0.35)],
        [x1, Math.floor((y0 + y1) * 0.35)],
      ];
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let sampleCount = 0;
      for (const [sx, sy] of sampleCoords) {
        const idx = (sy * w + sx) * 4;
        if (data[idx + 3] > 20) {
          sumR += data[idx];
          sumG += data[idx + 1];
          sumB += data[idx + 2];
          sampleCount += 1;
        }
      }

      if (sampleCount > 0) {
        const refR = sumR / sampleCount;
        const refG = sumG / sampleCount;
        const refB = sumB / sampleCount;
        const maxDist = tolerance * 2.15;
        const maxDistSq = maxDist * maxDist;

        // Precompute lightweight edge magnitude to stop bleeding across chin/hair
        const lumaArr = new Float32Array(w * h);
        for (let p = 0; p < w * h; p += 1) {
          const i = p * 4;
          lumaArr[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }

        const faceCx = w * 0.5;
        const faceCy = h * 0.44;
        const faceRx = w * 0.23;
        const faceRy = h * 0.30;
        const edgeStopThreshold = Math.max(22, 48 - tolerance * 0.28);

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const isSkinTone = (r, g, b) =>
          r > 85 &&
          g > 45 &&
          b > 25 &&
          r > g &&
          r > b &&
          Math.abs(r - g) > 12 &&
          r - b > 20;

        const tryEnqueue = (px, py, prevLuma) => {
          if (px < x0 || px > x1 || py < y0 || py > y1) return;
          const pIdx = py * w + px;
          if (visited[pIdx]) return;

          const override = manualMask && manualMask.length === w * h ? manualMask[pIdx] : 0;
          if (override === 1) return;

          // Center portrait safe-zone protects face & skin from accidental flood bleed
          if (protectFace) {
            const nx = (px - faceCx) / faceRx;
            const ny = (py - faceCy) / faceRy;
            if (nx * nx + ny * ny <= 1.0) return;
          }

          const dIdx = pIdx * 4;
          if (data[dIdx + 3] === 0) {
            visited[pIdx] = 1;
            queue[tail++] = pIdx;
            return;
          }

          // Edge barrier check against strong hair/jawline contrast
          const curLuma = lumaArr[pIdx];
          if (prevLuma !== null && Math.abs(curLuma - prevLuma) > edgeStopThreshold) {
            return;
          }

          const r = data[dIdx];
          const g = data[dIdx + 1];
          const b = data[dIdx + 2];
          if (protectFace && isSkinTone(r, g, b) && py > h * 0.18 && px > w * 0.22 && px < w * 0.78) {
            return;
          }

          const dr = r - refR;
          const dg = g - refG;
          const db = b - refB;
          if (dr * dr + dg * dg + db * db <= maxDistSq) {
            visited[pIdx] = 1;
            queue[tail++] = pIdx;
          }
        };

        for (let x = x0; x <= x1; x += 1) {
          tryEnqueue(x, y0, null);
        }
        for (let y = y0; y <= y1; y += 1) {
          tryEnqueue(x0, y, null);
          tryEnqueue(x1, y, null);
        }

        const featherBand = Math.max(0.12, Math.min(0.45, feather * 0.04));
        while (head < tail) {
          const pIdx = queue[head++];
          const px = pIdx % w;
          const py = (pIdx - px) / w;
          const dIdx = pIdx * 4;

          const dr = data[dIdx] - refR;
          const dg = data[dIdx + 1] - refG;
          const db = data[dIdx + 2] - refB;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);
          const solidCutoff = maxDist * (1 - featherBand);

          if (dist <= solidCutoff) {
            data[dIdx + 3] = 0;
          } else {
            const ratio = (dist - solidCutoff) / Math.max(1, maxDist - solidCutoff);
            data[dIdx + 3] = Math.round(data[dIdx + 3] * Math.min(1, Math.max(0, ratio)));
          }

          const curLuma = lumaArr[pIdx];
          tryEnqueue(px + 1, py, curLuma);
          tryEnqueue(px - 1, py, curLuma);
          tryEnqueue(px, py + 1, curLuma);
          tryEnqueue(px, py - 1, curLuma);
        }
      }
    }
  }

  // Apply manual brush overrides cleanly on top of auto segmentation
  if (manualMask && manualMask.length === w * h) {
    for (let p = 0; p < w * h; p += 1) {
      if (manualMask[p] === 2) {
        data[p * 4 + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Applies pixel warmth & unsharp-mask clarity on a canvas.
 */
function applyPixelEnhance(canvas, { warmth, sharpness }) {
  if (warmth === 0 && sharpness === 0) return;
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  if (warmth !== 0) {
    const rShift = warmth * 1.1;
    const bShift = -warmth * 1.1;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      data[i] = Math.min(255, Math.max(0, data[i] + rShift));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + bShift));
    }
  }

  if (sharpness > 0) {
    const src = new Uint8ClampedArray(data);
    const amount = (sharpness / 100) * 0.75;
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const idx = (y * w + x) * 4;
        if (src[idx + 3] === 0) continue;
        for (let c = 0; c < 3; c += 1) {
          const center = src[idx + c];
          const avgNeighbors =
            (src[((y - 1) * w + x) * 4 + c] +
              src[((y + 1) * w + x) * 4 + c] +
              src[(y * w + x - 1) * 4 + c] +
              src[(y * w + x + 1) * 4 + c]) *
            0.25;
          const sharpened = center + (center - avgNeighbors) * (amount * 2.2);
          data[idx + c] = Math.min(255, Math.max(0, sharpened));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function createOfflineSampleDataUrl(type) {
  const c = document.createElement('canvas');
  if (type === 'signature') {
    c.width = 600;
    c.height = 160;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#E8ECEF';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(75, 110);
    ctx.bezierCurveTo(100, 25, 145, 25, 130, 110);
    ctx.bezierCurveTo(120, 130, 170, 60, 195, 95);
    ctx.bezierCurveTo(215, 120, 235, 50, 270, 90);
    ctx.bezierCurveTo(295, 120, 340, 45, 385, 88);
    ctx.bezierCurveTo(420, 115, 470, 65, 520, 82);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(90, 132);
    ctx.quadraticCurveTo(290, 120, 495, 130);
    ctx.stroke();
    return c.toDataURL('image/png');
  }

  c.width = 600;
  c.height = 600;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 600);
  grad.addColorStop(0, '#DFE6EE');
  grad.addColorStop(1, '#C8D3E0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 600);

  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.moveTo(110, 600);
  ctx.quadraticCurveTo(140, 415, 300, 415);
  ctx.quadraticCurveTo(460, 415, 490, 600);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.moveTo(245, 415);
  ctx.lineTo(300, 520);
  ctx.lineTo(355, 415);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#E6B89C';
  ctx.fillRect(264, 345, 72, 90);

  ctx.fillStyle = '#F1C7AD';
  ctx.beginPath();
  ctx.ellipse(300, 248, 86, 108, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.ellipse(300, 168, 90, 56, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(268, 245, 7, 0, Math.PI * 2);
  ctx.arc(332, 245, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#9A5B47';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(300, 286, 24, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  return c.toDataURL('image/png');
}

export default function PhotoStudio() {
  const [sourceImage, setSourceImage] = useState(null);
  const [sourceMeta, setSourceMeta] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inspectorTab, setInspectorTab] = useState('size');

  // Dimensions & Preset State
  const [activePreset, setActivePreset] = useState('passport');
  const [outputWidth, setOutputWidth] = useState(300);
  const [outputHeight, setOutputHeight] = useState(300);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [lockedRatio, setLockedRatio] = useState(1);

  // Transform & Interactive Crop Box (normalized 0..1)
  const [cropMode, setCropMode] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [lockCropToOutput, setLockCropToOutput] = useState(true);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [straightenDeg, setStraightenDeg] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [fitMode, setFitMode] = useState('cover');
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Background Color, Blur & Face Protection
  const [bgMode, setBgMode] = useState('original');
  const [customBgColor, setCustomBgColor] = useState('#E0F2FE');
  const [bgTolerance, setBgTolerance] = useState(28);
  const [bgBlurAmount, setBgBlurAmount] = useState(10);
  const [featherAmount, setFeatherAmount] = useState(4);
  const [protectFace, setProtectFace] = useState(true);
  const [keyMode, setKeyMode] = useState('edge');
  const [deepenInk, setDeepenInk] = useState(false);

  // Manual Touch-up Brush
  const [brushMode, setBrushMode] = useState('none'); // 'none' | 'keep' | 'erase'
  const [brushSize, setBrushSize] = useState(18);
  const [maskVersion, setMaskVersion] = useState(0);
  const manualMaskRef = useRef(null);
  const isPaintingRef = useRef(false);
  const dragPanRef = useRef(null);

  // Effects, Enhance & Blur
  const [activeEffect, setActiveEffect] = useState('natural');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [overallBlur, setOverallBlur] = useState(0);

  // Compression & Output
  const [targetKB, setTargetKB] = useState(100);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [showOriginalCompare, setShowOriginalCompare] = useState(false);
  const [compressionStats, setCompressionStats] = useState({
    blob: null,
    sizeBytes: 0,
    quality: 0.95,
    isCompressing: false,
  });

  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const cropStageRef = useRef(null);
  const cropDragRef = useRef(null);
  const renderJobRef = useRef(0);

  const resetMask = useCallback(() => {
    manualMaskRef.current = null;
    setMaskVersion((v) => v + 1);
  }, []);

  const loadImageFromUrl = useCallback(
    (url, meta) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setSourceMeta({
          ...meta,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
        setCropBox({ x: 0, y: 0, w: 1, h: 1 });
        setRotationDeg(0);
        setStraightenDeg(0);
        setFlipH(false);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
        setCropMode(false);
        resetMask();
      };
      img.src = url;
    },
    [resetMask]
  );

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        loadImageFromUrl(ev.target.result, {
          name: file.name,
          size: file.size,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    },
    [loadImageFromUrl]
  );

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setOutputWidth(preset.width);
    setOutputHeight(preset.height);
    setLockedRatio(preset.width / preset.height);
    setAspectLocked(true);
    setTargetKB(preset.targetKB);
    setFitMode(preset.fitMode);
    setKeyMode(preset.keyMode);
    setDeepenInk(preset.id === 'signature');
    setProtectFace(preset.keyMode === 'edge');
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    resetMask();
    if (preset.id === 'signature') {
      setBgMode('white');
      setBgTolerance(34);
    }
  };

  const handleLoadSample = (type) => {
    const dataUrl = createOfflineSampleDataUrl(type);
    if (type === 'signature') {
      applyPreset(PRESETS[1]);
      loadImageFromUrl(dataUrl, {
        name: 'sample-signature.png',
        size: 18400,
        type: 'image/png',
      });
    } else {
      applyPreset(PRESETS[0]);
      setBgMode('blue');
      setBgTolerance(28);
      loadImageFromUrl(dataUrl, {
        name: 'sample-portrait.png',
        size: 64200,
        type: 'image/png',
      });
    }
  };

  const handleWidthChange = (rawVal) => {
    const nextW = Math.max(10, Math.min(4000, Number(rawVal) || 10));
    setActivePreset('custom');
    setOutputWidth(nextW);
    if (aspectLocked && lockedRatio > 0) {
      setOutputHeight(Math.max(10, Math.round(nextW / lockedRatio)));
    }
    resetMask();
  };

  const handleHeightChange = (rawVal) => {
    const nextH = Math.max(10, Math.min(4000, Number(rawVal) || 10));
    setActivePreset('custom');
    setOutputHeight(nextH);
    if (aspectLocked && lockedRatio > 0) {
      setOutputWidth(Math.max(10, Math.round(nextH * lockedRatio)));
    }
    resetMask();
  };

  const toggleAspectLock = () => {
    if (!aspectLocked && outputHeight > 0) {
      setLockedRatio(outputWidth / outputHeight);
    }
    setAspectLocked((prev) => !prev);
  };

  const handleBgSelect = (id) => {
    setBgMode(id);
    if (id === 'original') {
      setBgTolerance(0);
    } else if (bgTolerance === 0) {
      setBgTolerance(28);
    }
  };

  const applyEffectPreset = (preset) => {
    setActiveEffect(preset.id);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setWarmth(preset.warmth);
    setSharpness(preset.sharpness);
    setOverallBlur(preset.blur);
  };

  const handleAutoEnhance = () => {
    if (!sourceImage) return;
    // Sample miniature version of source image to auto-balance brightness & contrast
    const sampleC = document.createElement('canvas');
    sampleC.width = 64;
    sampleC.height = 64;
    const sCtx = sampleC.getContext('2d');
    sCtx.drawImage(sourceImage, 0, 0, 64, 64);
    const px = sCtx.getImageData(0, 0, 64, 64).data;
    let sumL = 0;
    let minL = 255;
    let maxL = 0;
    for (let i = 0; i < px.length; i += 4) {
      const l = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      sumL += l;
      if (l < minL) minL = l;
      if (l > maxL) maxL = l;
    }
    const meanL = sumL / (64 * 64);
    const targetBright = Math.round(Math.max(-18, Math.min(24, (132 - meanL) * 0.45)));
    const spread = maxL - minL;
    const targetContrast = spread < 190 ? Math.round(Math.min(26, (210 - spread) * 0.22)) : 8;

    setActiveEffect('auto');
    setBrightness(targetBright);
    setContrast(targetContrast);
    setSaturation(10);
    setWarmth(4);
    setSharpness(22);
    setOverallBlur(0);
  };

  const resolvedBgColor =
    bgMode === 'white'
      ? '#FFFFFF'
      : bgMode === 'blue'
      ? '#1D63B8'
      : bgMode === 'custom'
      ? customBgColor
      : null;

  // Build transformed + cropped source bitmap onto an offscreen canvas
  const buildCroppedSourceCanvas = useCallback(() => {
    if (!sourceImage) return null;
    const sw = sourceImage.naturalWidth;
    const sh = sourceImage.naturalHeight;
    const totalDeg = rotationDeg + straightenDeg;
    const rad = (totalDeg * Math.PI) / 180;

    // Step 1: Rotate & Flip full source image
    const swapDims = Math.abs(rotationDeg % 180) === 90;
    const rotW = swapDims ? sh : sw;
    const rotH = swapDims ? sw : sh;
    const rotCanvas = document.createElement('canvas');
    rotCanvas.width = rotW;
    rotCanvas.height = rotH;
    const rotCtx = rotCanvas.getContext('2d');
    rotCtx.translate(rotW / 2, rotH / 2);
    rotCtx.rotate(rad);
    rotCtx.scale(flipH ? -1 : 1, 1);
    rotCtx.drawImage(sourceImage, -sw / 2, -sh / 2);

    // Step 2: Slice normalized cropBox
    const sx = Math.max(0, Math.round(cropBox.x * rotW));
    const sy = Math.max(0, Math.round(cropBox.y * rotH));
    const cw = Math.max(10, Math.min(rotW - sx, Math.round(cropBox.w * rotW)));
    const ch = Math.max(10, Math.min(rotH - sy, Math.round(cropBox.h * rotH)));

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cw;
    croppedCanvas.height = ch;
    const cCtx = croppedCanvas.getContext('2d');
    cCtx.drawImage(rotCanvas, sx, sy, cw, ch, 0, 0, cw, ch);
    return croppedCanvas;
  }, [sourceImage, rotationDeg, straightenDeg, flipH, cropBox]);

  // Main Render & Target-Size Compression Effect
  useEffect(() => {
    if (!sourceImage || cropMode || !previewCanvasRef.current) return;

    const jobId = ++renderJobRef.current;
    const w = Math.max(10, outputWidth);
    const h = Math.max(10, outputHeight);

    const timer = setTimeout(async () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const cropped = buildCroppedSourceCanvas();
      if (!cropped) return;

      const baseScale =
        fitMode === 'cover'
          ? Math.max(w / cropped.width, h / cropped.height)
          : Math.min(w / cropped.width, h / cropped.height);
      const scale = baseScale * zoom;
      const drawW = cropped.width * scale;
      const drawH = cropped.height * scale;
      const drawX = (w - drawW) / 2 + (offsetX / 100) * (w * 0.5);
      const drawY = (h - drawH) / 2 + (offsetY / 100) * (h * 0.5);

      if (showOriginalCompare) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(cropped, drawX, drawY, drawW, drawH);
        return;
      }

      // Build offscreen enhanced subject canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext('2d');
      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = 'high';

      const filterParts = [
        `brightness(${100 + brightness}%)`,
        `contrast(${100 + contrast}%)`,
        `saturate(${100 + saturation}%)`,
        overallBlur > 0 ? `blur(${overallBlur}px)` : '',
      ].filter(Boolean);
      offCtx.filter = filterParts.join(' ');
      offCtx.drawImage(cropped, drawX, drawY, drawW, drawH);
      offCtx.filter = 'none';

      applyPixelEnhance(offscreen, { warmth, sharpness });

      // Composite background layer (Solid / Portrait Bokeh Blur / Original)
      ctx.clearRect(0, 0, w, h);
      if (bgMode === 'blur') {
        // Draw blurred background behind sharp foreground cutout
        ctx.save();
        ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%) blur(${bgBlurAmount}px)`;
        ctx.drawImage(cropped, drawX - 10, drawY - 10, drawW + 20, drawH + 20);
        ctx.restore();
      } else if (resolvedBgColor) {
        ctx.fillStyle = resolvedBgColor;
        ctx.fillRect(0, 0, w, h);
      } else if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
      }

      if (bgMode !== 'original') {
        applyFaceSafeBackgroundMask(
          offscreen,
          { x: drawX, y: drawY, w: drawW, h: drawH },
          {
            tolerance: bgTolerance,
            mode: keyMode,
            deepenInk,
            protectFace,
            feather: featherAmount,
            manualMask: manualMaskRef.current,
          }
        );
      }

      ctx.drawImage(offscreen, 0, 0);

      setCompressionStats((prev) => ({ ...prev, isCompressing: true }));
      const targetBytes = Math.max(5, Number(targetKB) || 100) * 1024;
      const result = await compressToTargetSize(canvas, outputFormat, targetBytes);

      if (jobId !== renderJobRef.current) return;

      setCompressionStats({
        blob: result.blob,
        sizeBytes: result.blob ? result.blob.size : 0,
        quality: result.quality,
        isCompressing: false,
      });
    }, 65);

    return () => clearTimeout(timer);
  }, [
    sourceImage,
    cropMode,
    outputWidth,
    outputHeight,
    fitMode,
    zoom,
    offsetX,
    offsetY,
    bgMode,
    resolvedBgColor,
    bgTolerance,
    bgBlurAmount,
    featherAmount,
    protectFace,
    keyMode,
    deepenInk,
    brightness,
    contrast,
    saturation,
    warmth,
    sharpness,
    overallBlur,
    targetKB,
    outputFormat,
    showOriginalCompare,
    maskVersion,
    buildCroppedSourceCanvas,
  ]);

  // Paint onto manual mask OR drag-pan image on preview canvas
  const paintAtClientPoint = (clientX, clientY) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = Math.round(((clientX - rect.left) / rect.width) * canvas.width);
    const py = Math.round(((clientY - rect.top) / rect.height) * canvas.height);

    if (
      !manualMaskRef.current ||
      manualMaskRef.current.length !== canvas.width * canvas.height
    ) {
      manualMaskRef.current = new Uint8Array(canvas.width * canvas.height);
    }
    const mask = manualMaskRef.current;
    const r = Math.max(2, Math.round((brushSize / 300) * canvas.width));
    const rSq = r * r;
    const val = brushMode === 'keep' ? 1 : 2;

    for (let dy = -r; dy <= r; dy += 1) {
      const yy = py + dy;
      if (yy < 0 || yy >= canvas.height) continue;
      for (let dx = -r; dx <= r; dx += 1) {
        const xx = px + dx;
        if (xx < 0 || xx >= canvas.width) continue;
        if (dx * dx + dy * dy <= rSq) {
          mask[yy * canvas.width + xx] = val;
        }
      }
    }
    setMaskVersion((v) => v + 1);
  };

  const handlePreviewPointerDown = (e) => {
    if (!sourceImage) return;
    if (brushMode === 'keep' || brushMode === 'erase') {
      isPaintingRef.current = true;
      paintAtClientPoint(e.clientX, e.clientY);
      return;
    }
    dragPanRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initOffsetX: offsetX,
      initOffsetY: offsetY,
    };
  };

  const handlePreviewPointerMove = (e) => {
    if (isPaintingRef.current) {
      paintAtClientPoint(e.clientX, e.clientY);
      return;
    }
    if (dragPanRef.current) {
      const dx = e.clientX - dragPanRef.current.startX;
      const dy = e.clientY - dragPanRef.current.startY;
      setOffsetX(Math.max(-100, Math.min(100, Math.round(dragPanRef.current.initOffsetX + dx * 0.45))));
      setOffsetY(Math.max(-100, Math.min(100, Math.round(dragPanRef.current.initOffsetY + dy * 0.45))));
    }
  };

  const handlePreviewPointerUp = () => {
    isPaintingRef.current = false;
    dragPanRef.current = null;
  };

  // Interactive Crop Box Pointer Handlers
  const startCropDrag = (e, handle) => {
    e.stopPropagation();
    cropDragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startBox: { ...cropBox },
    };
  };

  useEffect(() => {
    if (!cropMode) return;
    const onMove = (e) => {
      if (!cropDragRef.current || !cropStageRef.current) return;
      const rect = cropStageRef.current.getBoundingClientRect();
      const dx = (e.clientX - cropDragRef.current.startX) / rect.width;
      const dy = (e.clientY - cropDragRef.current.startY) / rect.height;
      const b = cropDragRef.current.startBox;
      const minSize = 0.12;
      let { x, y, w, h } = b;

      if (cropDragRef.current.handle === 'move') {
        x = Math.max(0, Math.min(1 - w, b.x + dx));
        y = Math.max(0, Math.min(1 - h, b.y + dy));
      } else {
        if (cropDragRef.current.handle.includes('e')) {
          w = Math.max(minSize, Math.min(1 - b.x, b.w + dx));
        }
        if (cropDragRef.current.handle.includes('s')) {
          h = Math.max(minSize, Math.min(1 - b.y, b.h + dy));
        }
        if (cropDragRef.current.handle.includes('w')) {
          const nextX = Math.max(0, Math.min(b.x + b.w - minSize, b.x + dx));
          w = b.w + (b.x - nextX);
          x = nextX;
        }
        if (cropDragRef.current.handle.includes('n')) {
          const nextY = Math.max(0, Math.min(b.y + b.h - minSize, b.y + dy));
          h = b.h + (b.y - nextY);
          y = nextY;
        }
        if (lockCropToOutput && rect.width > 0 && rect.height > 0) {
          const targetPixelRatio = outputWidth / outputHeight;
          const stageRatio = rect.width / rect.height;
          const normRatio = targetPixelRatio / stageRatio;
          h = Math.min(1 - y, Math.max(minSize, w / normRatio));
          w = Math.min(1 - x, h * normRatio);
        }
      }
      setCropBox({ x, y, w, h });
    };
    const onUp = () => {
      cropDragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [cropMode, lockCropToOutput, outputWidth, outputHeight]);

  const handleDownload = () => {
    if (!compressionStats.blob) return;
    const ext =
      outputFormat === 'image/png'
        ? 'png'
        : outputFormat === 'image/webp'
        ? 'webp'
        : 'jpg';
    const prefix = activePreset === 'custom' ? 'photo' : activePreset;
    const kb = Math.round(compressionStats.sizeBytes / 1024);
    const filename = `${prefix}_${outputWidth}x${outputHeight}_${kb}KB.${ext}`;

    const url = URL.createObjectURL(compressionStats.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const targetBytes = Math.max(5, Number(targetKB) || 100) * 1024;
  const isWithinTarget =
    compressionStats.sizeBytes > 0 && compressionStats.sizeBytes <= targetBytes;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/70 dark:bg-slate-950">
      {/* Studio Top Bar */}
      <div className="px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Photo Studio Pro
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive Crop, Face-Safe BG Swap, Bokeh Blur, Enhance & &lt;100KB Compressor
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sourceImage && (
            <>
              <button
                type="button"
                onClick={handleAutoEnhance}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/30 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto Enhance</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>New Photo</span>
              </button>
            </>
          )}

          <button
            type="button"
            disabled={!compressionStats.blob || compressionStats.isCompressing || cropMode}
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:pointer-events-none text-white shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>
              Export{' '}
              {compressionStats.sizeBytes > 0
                ? `(${formatBytes(compressionStats.sizeBytes)})`
                : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Clean Tabbed Inspector */}
        <div className="w-full lg:w-[370px] shrink-0 flex flex-col bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {/* 4-Tab Bar */}
          <div className="grid grid-cols-4 gap-1 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
            {[
              { id: 'size', label: 'Crop & Size', icon: Crop },
              { id: 'bg', label: 'Backdrop', icon: Shield },
              { id: 'enhance', label: 'Enhance', icon: Sparkles },
              { id: 'export', label: '<100KB', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = inspectorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInspectorTab(tab.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-700'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {inspectorTab === 'size' && (
              <>
                {/* Presets */}
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Standard Presets
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const active = activePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            active
                              ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-500 ring-1 ring-indigo-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 mb-1 ${
                              active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                            }`}
                          />
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {preset.label}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {preset.dimensions}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Interactive Crop Box Trigger & Rotate/Flip */}
                <section className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Crop & Rotate
                    </span>
                    <button
                      type="button"
                      disabled={!sourceImage}
                      onClick={() => {
                        setBrushMode('none');
                        setCropMode((v) => !v);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 ${
                        cropMode
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {cropMode ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply Crop</span>
                        </>
                      ) : (
                        <>
                          <Crop className="w-3.5 h-3.5" />
                          <span>Crop Photo</span>
                        </>
                      )}
                    </button>
                  </div>

                  {cropMode && (
                    <label className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <span>Lock crop box to output ratio</span>
                      <input
                        type="checkbox"
                        checked={lockCropToOutput}
                        onChange={(e) => setLockCropToOutput(e.target.checked)}
                        className="rounded accent-indigo-600"
                      />
                    </label>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRotationDeg((d) => (d - 90) % 360)}
                      className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>-90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotationDeg((d) => (d + 90) % 360)}
                      className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>+90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipH((f) => !f)}
                      className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border ${
                        flipH
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <FlipHorizontal2 className="w-3.5 h-3.5" />
                      <span>Flip</span>
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Straighten Angle</span>
                      <span className="font-mono">{straightenDeg}°</span>
                    </div>
                    <input
                      type="range"
                      min={-15}
                      max={15}
                      step={0.5}
                      value={straightenDeg}
                      onChange={(e) => setStraightenDeg(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </section>

                {/* Dimensions & Aspect Lock */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Output Size (px)
                    </h3>
                    <button
                      type="button"
                      onClick={toggleAspectLock}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${
                        aspectLocked
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {aspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{aspectLocked ? 'Ratio Locked' : 'Free'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Width</label>
                      <input
                        type="number"
                        min={10}
                        max={4000}
                        value={outputWidth}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Height</label>
                      <input
                        type="number"
                        min={10}
                        max={4000}
                        value={outputHeight}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Frame Fit
                    </span>
                    <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
                      <button
                        type="button"
                        onClick={() => setFitMode('cover')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          fitMode === 'cover'
                            ? 'bg-white dark:bg-slate-700 shadow-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Fill</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFitMode('contain')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          fitMode === 'contain'
                            ? 'bg-white dark:bg-slate-700 shadow-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        <Minimize2 className="w-3 h-3" />
                        <span>Fit</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Zoom (drag preview to pan)</span>
                      <span className="font-mono">{zoom.toFixed(2)}×</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.8}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </section>
              </>
            )}

            {inspectorTab === 'bg' && (
              <>
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    1-Click Backdrop & Blur
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {BG_OPTIONS.map((opt) => {
                      const active = bgMode === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleBgSelect(opt.id)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            active
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                          }`}
                        >
                          {opt.color === 'blur' ? (
                            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400/50 to-cyan-400/50 backdrop-blur flex items-center justify-center shrink-0">
                              <Droplets className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-200" />
                            </span>
                          ) : (
                            <span
                              className="w-6 h-6 rounded-lg border border-slate-300 dark:border-slate-600 shrink-0"
                              style={{
                                background:
                                  opt.color ||
                                  'linear-gradient(135deg, #e2e8f0 50%, #94a3b8 50%)',
                              }}
                            />
                          )}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Custom Color
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customBgColor}
                        onChange={(e) => {
                          setCustomBgColor(e.target.value);
                          setBgMode('custom');
                          if (bgTolerance === 0) setBgTolerance(28);
                        }}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[11px] font-mono text-slate-500">
                        {resolvedBgColor || 'None'}
                      </span>
                    </div>
                  </div>
                </section>

                {bgMode !== 'original' && (
                  <>
                    <section className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-500" />
                          Face-Safe Guard
                        </span>
                        <input
                          type="checkbox"
                          checked={protectFace}
                          onChange={(e) => setProtectFace(e.target.checked)}
                          className="rounded accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>BG Sensitivity</span>
                          <span className="font-mono">{bgTolerance}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={75}
                          value={bgTolerance}
                          onChange={(e) => setBgTolerance(parseInt(e.target.value, 10))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Edge Smoothness</span>
                          <span className="font-mono">{featherAmount}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          value={featherAmount}
                          onChange={(e) => setFeatherAmount(parseInt(e.target.value, 10))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      {bgMode === 'blur' && (
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Background Blur Strength</span>
                            <span className="font-mono">{bgBlurAmount}px</span>
                          </div>
                          <input
                            type="range"
                            min={2}
                            max={24}
                            value={bgBlurAmount}
                            onChange={(e) => setBgBlurAmount(parseInt(e.target.value, 10))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          Mode
                        </span>
                        <div className="inline-flex rounded-lg bg-white dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => setKeyMode('edge')}
                            className={`px-2 py-1 rounded text-[11px] font-semibold ${
                              keyMode === 'edge' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                            }`}
                          >
                            Portrait
                          </button>
                          <button
                            type="button"
                            onClick={() => setKeyMode('paper')}
                            className={`px-2 py-1 rounded text-[11px] font-semibold ${
                              keyMode === 'paper' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                            }`}
                          >
                            Signature
                          </button>
                        </div>
                      </div>

                      {keyMode === 'paper' && (
                        <label className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          <input
                            type="checkbox"
                            checked={deepenInk}
                            onChange={(e) => setDeepenInk(e.target.checked)}
                            className="rounded accent-indigo-600"
                          />
                          <span>Deepen signature ink</span>
                        </label>
                      )}
                    </section>

                    {/* Touch-up Brush */}
                    <section className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                          Touch-Up Brush (Paint on Photo)
                        </span>
                        <button
                          type="button"
                          onClick={resetMask}
                          className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Reset Brush
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setBrushMode('none')}
                          className={`py-1.5 rounded-xl text-[11px] font-bold border ${
                            brushMode === 'none'
                              ? 'bg-slate-900 text-white border-slate-900 dark:bg-indigo-600 dark:border-indigo-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Pan View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCropMode(false);
                            setBrushMode('keep');
                          }}
                          className={`inline-flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold border ${
                            brushMode === 'keep'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Paintbrush className="w-3 h-3" />
                          <span>Keep Face</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCropMode(false);
                            setBrushMode('erase');
                          }}
                          className={`inline-flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold border ${
                            brushMode === 'erase'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Eraser className="w-3 h-3" />
                          <span>Erase BG</span>
                        </button>
                      </div>

                      {brushMode !== 'none' && (
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                            <span>Brush Size</span>
                            <span className="font-mono">{brushSize}px</span>
                          </div>
                          <input
                            type="range"
                            min={6}
                            max={48}
                            value={brushSize}
                            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      )}
                    </section>
                  </>
                )}
              </>
            )}

            {inspectorTab === 'enhance' && (
              <>
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Quick Filter Effects
                    </h3>
                    <button
                      type="button"
                      onClick={() => applyEffectPreset(EFFECT_PRESETS[0])}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline"
                    >
                      Reset All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {EFFECT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyEffectPreset(preset)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                          activeEffect === preset.id
                            ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                  {[
                    { label: 'Brightness', val: brightness, set: setBrightness, min: -50, max: 50 },
                    { label: 'Contrast', val: contrast, set: setContrast, min: -50, max: 50 },
                    { label: 'Saturation', val: saturation, set: setSaturation, min: -100, max: 100 },
                    { label: 'Warmth', val: warmth, set: setWarmth, min: -40, max: 40 },
                    { label: 'Sharpness / Clarity', val: sharpness, set: setSharpness, min: 0, max: 100 },
                    { label: 'Soft Blur', val: overallBlur, set: setOverallBlur, min: 0, max: 10 },
                  ].map((ctrl) => (
                    <div key={ctrl.label}>
                      <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                        <span className="font-medium">{ctrl.label}</span>
                        <span className="font-mono">{ctrl.val}</span>
                      </div>
                      <input
                        type="range"
                        min={ctrl.min}
                        max={ctrl.max}
                        value={ctrl.val}
                        onChange={(e) => {
                          setActiveEffect('custom');
                          ctrl.set(parseInt(e.target.value, 10));
                        }}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  ))}
                </section>
              </>
            )}

            {inspectorTab === 'export' && (
              <section className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Max Size Target
                    </span>
                    <div className="flex gap-1.5">
                      {[50, 60, 100].map((kb) => (
                        <button
                          key={kb}
                          type="button"
                          onClick={() => setTargetKB(kb)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                            targetKB === kb
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          &lt;{kb}KB
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Custom KB</label>
                      <input
                        type="number"
                        min={5}
                        max={2000}
                        value={targetKB}
                        onChange={(e) =>
                          setTargetKB(Math.max(5, parseInt(e.target.value, 10) || 100))
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Format</label>
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="image/jpeg">JPEG (&lt;100KB)</option>
                        <option value="image/webp">WebP</option>
                        <option value="image/png">PNG (Lossless)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Right Preview & Interactive Stage */}
        <div className="flex-1 flex flex-col overflow-hidden p-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />

          {!sourceImage ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex-1 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Drop your photo or signature here
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1.5">
                Crop interactively, swap backgrounds safely without clipping the face, add DSLR bokeh blur, enhance clarity, and compress under 100KB.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('portrait')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sample Portrait</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('signature')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Sample Signature</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden gap-3.5">
              {/* Telemetry & Quick Actions Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                    {sourceMeta?.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/15 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {outputWidth} × {outputHeight} px
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!cropMode && (
                    <button
                      type="button"
                      onPointerDown={() => setShowOriginalCompare(true)}
                      onPointerUp={() => setShowOriginalCompare(false)}
                      onPointerLeave={() => setShowOriginalCompare(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 select-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Hold: Original</span>
                    </button>
                  )}

                  {compressionStats.isCompressing ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Compressing...
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isWithinTarget
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                      }`}
                    >
                      {isWithinTarget ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {formatBytes(compressionStats.sizeBytes)} / {targetKB} KB
                        {outputFormat !== 'image/png'
                          ? ` (${Math.round(compressionStats.quality * 100)}% Q)`
                          : ''}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Stage: Interactive Cropper OR Live Output Canvas */}
              <div className="flex-1 overflow-auto checkerboard-bg rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 select-none">
                {cropMode ? (
                  <div className="flex flex-col items-center gap-3">
                    <div
                      ref={cropStageRef}
                      className="relative inline-block max-w-full max-h-[58vh] shadow-2xl rounded-lg overflow-hidden bg-slate-900"
                    >
                      <img
                        src={sourceImage.src}
                        alt="Crop source"
                        draggable={false}
                        className="max-h-[58vh] max-w-full block pointer-events-none"
                        style={{
                          transform: `rotate(${rotationDeg + straightenDeg}deg) scaleX(${flipH ? -1 : 1})`,
                        }}
                      />

                      {/* Dimmed exterior overlay via box-shadow */}
                      <div
                        onPointerDown={(e) => startCropDrag(e, 'move')}
                        style={{
                          left: `${cropBox.x * 100}%`,
                          top: `${cropBox.y * 100}%`,
                          width: `${cropBox.w * 100}%`,
                          height: `${cropBox.h * 100}%`,
                          boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.62)',
                        }}
                        className="absolute border-2 border-white cursor-move"
                      >
                        {/* Rule of thirds grid */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                          <div className="border-r border-b border-white/25" />
                          <div className="border-r border-b border-white/25" />
                          <div className="border-b border-white/25" />
                          <div className="border-r border-b border-white/25" />
                          <div className="border-r border-b border-white/25" />
                          <div className="border-b border-white/25" />
                          <div className="border-r border-white/25" />
                          <div className="border-r border-white/25" />
                          <div />
                        </div>

                        {/* 4 Corner Resize Handles */}
                        {['nw', 'ne', 'sw', 'se'].map((corner) => (
                          <div
                            key={corner}
                            onPointerDown={(e) => startCropDrag(e, corner)}
                            className={`absolute w-3.5 h-3.5 bg-indigo-500 border-2 border-white rounded-sm shadow ${
                              corner === 'nw'
                                ? '-top-1.5 -left-1.5 cursor-nwse-resize'
                                : corner === 'ne'
                                ? '-top-1.5 -right-1.5 cursor-nesw-resize'
                                : corner === 'sw'
                                ? '-bottom-1.5 -left-1.5 cursor-nesw-resize'
                                : '-bottom-1.5 -right-1.5 cursor-nwse-resize'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCropBox({ x: 0, y: 0, w: 1, h: 1 })}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        Reset Crop
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropMode(false)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Done Cropping
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-2xl border border-slate-200 dark:border-slate-700">
                      <canvas
                        ref={previewCanvasRef}
                        onPointerDown={handlePreviewPointerDown}
                        onPointerMove={handlePreviewPointerMove}
                        onPointerUp={handlePreviewPointerUp}
                        onPointerLeave={handlePreviewPointerUp}
                        className={`max-w-full max-h-[58vh] block rounded-lg shadow-inner ${
                          brushMode !== 'none' ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
                        }`}
                      />
                    </div>

                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                      {brushMode === 'keep'
                        ? 'Brush active: Paint over face/hair to keep protected'
                        : brushMode === 'erase'
                        ? 'Eraser active: Paint over leftover background spots'
                        : 'Drag preview to pan • Use Crop & Backdrop tabs for touch-ups'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
