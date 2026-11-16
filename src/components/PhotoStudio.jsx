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
  Printer,
  Grid,
  Bot,
  Send,
  Zap,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Palette,
  FileImage,
  Sun,
  Layers,
  Scissors,
} from 'lucide-react';

const PRESETS = [
  {
    id: 'passport',
    label: 'পাসপোর্ট সাইজ',
    labelEn: 'Passport Size',
    dimensions: '300 × 300 px',
    width: 300,
    height: 300,
    targetKB: 100,
    defaultBg: '#FFFFFF',
    icon: UserCheck,
    hint: 'সকল সরকারি ও আন্তর্জাতিক পাসপোর্টের জন্য প্রমিত',
  },
  {
    id: 'signature',
    label: 'স্বাক্ষর / Signature',
    labelEn: 'Signature Scan',
    dimensions: '300 × 80 px',
    width: 300,
    height: 80,
    targetKB: 60,
    defaultBg: 'transparent',
    icon: PenTool,
    hint: 'সাদা কাগজ মুছে পিউর কালির সিগনেচার তৈরি করে',
  },
  {
    id: 'nid',
    label: 'এনআইডি / ভিসা',
    labelEn: 'NID / Visa',
    dimensions: '400 × 500 px',
    width: 400,
    height: 500,
    targetKB: 100,
    defaultBg: '#0088cc',
    icon: UserCheck,
    hint: 'স্মার্ট এনআইডি, ড্রাইভিং লাইসেন্স ও এম্বাসি ভিসা সাইজ',
  },
  {
    id: 'stamp',
    label: 'স্ট্যাম্প সাইজ',
    labelEn: 'Stamp Size',
    dimensions: '150 × 200 px',
    width: 150,
    height: 200,
    targetKB: 50,
    defaultBg: '#FFFFFF',
    icon: ImageIcon,
    hint: 'অফিসিয়াল ফর্ম, প্রবেশপত্র ও স্টুডেন্ট আইডি সাইজ',
  },
];

const BG_COLORS = [
  { id: 'original', label: 'আসল ছবি', labelEn: 'Original', color: null, preview: 'checker' },
  { id: 'white', label: 'স্টুডিও সাদা', labelEn: 'Studio White', color: '#FFFFFF', preview: '#FFFFFF' },
  { id: 'sky-blue', label: 'পাসপোর্ট স্কাই ব্লু', labelEn: 'Passport Sky Blue', color: '#0088cc', preview: '#0088cc' },
  { id: 'navy-blue', label: 'রয়্যাল নেভি', labelEn: 'Royal Navy', color: '#1d4ed8', preview: '#1d4ed8' },
  { id: 'light-grey', label: 'হালকা ছাই', labelEn: 'Light Grey', color: '#E2E8F0', preview: '#E2E8F0' },
  { id: 'crimson', label: 'অফিসিয়াল লাল', labelEn: 'Crimson Red', color: '#b91c1c', preview: '#b91c1c' },
  { id: 'transparent', label: 'স্বচ্ছ (PNG)', labelEn: 'Transparent', color: 'transparent', preview: 'transparent' },
];

const RESOLUTION_MODES = [
  { id: 'standard', label: 'স্ট্যান্ডার্ড ওয়েব (1x)', scale: 1, desc: 'দ্রুত অনলাইন আপলোড ও সাধারণ ফর্মের জন্য' },
  { id: 'fullhd', label: 'ফুল এইচডি (2x)', scale: 2, desc: 'উচ্চমানের ডিজিটাল ডিসপ্লে ও ক্লিয়ার রেজুলেশন' },
  { id: 'ultra300', label: 'স্টুডিও 300 DPI (3x)', scale: 3, desc: 'প্রিন্ট ল্যাব ও স্টুডিও কোয়ালিটি সুপার-শার্প প্রিন্টিং' },
  { id: 'ultra4k', label: 'আল্ট্রা এইচডি 4K (4x)', scale: 4, desc: 'সর্বোচ্চ রেজুলেশন আর্ট পেপার প্রিন্ট' },
];

const SHEET_LAYOUTS = [
  { id: '4r-10', label: '১০ কপি (5×2 গ্রিড - 4R পেপার)', count: 10, cols: 5, rows: 2, paper: '4R (4" × 6")', paperWidth: 1800, paperHeight: 1200 },
  { id: '4r-8', label: '৮ কপি (4×2 গ্রিড - 4R পেপার)', count: 8, cols: 4, rows: 2, paper: '4R (4" × 6")', paperWidth: 1800, paperHeight: 1200 },
  { id: '4r-6', label: '৬ কপি (3×2 গ্রিড - 4R পেপার)', count: 6, cols: 3, rows: 2, paper: '4R (4" × 6")', paperWidth: 1800, paperHeight: 1200 },
  { id: 'a4-12', label: '১২ কপি (4×3 গ্রিড - A4 পেপার)', count: 12, cols: 4, rows: 3, paper: 'A4 (8.27" × 11.69")', paperWidth: 2480, paperHeight: 3508 },
  { id: 'a4-16', label: '১৬ কপি (4×4 গ্রিড - A4 পেপার)', count: 16, cols: 4, rows: 4, paper: 'A4 (8.27" × 11.69")', paperWidth: 2480, paperHeight: 3508 },
  { id: '4r-stamp-24', label: '২৪ কপি স্ট্যাম্প সাইজ (6×4 গ্রিড)', count: 24, cols: 6, rows: 4, paper: '4R (4" × 6")', paperWidth: 1800, paperHeight: 1200 },
];

const AI_QUICK_PRESETS = [
  {
    title: '✨ AI স্মার্ট পাসপোর্ট মোড',
    prompt: 'পাসপোর্ট সাইজ ৩০০x৩০০, ব্যাকগ্রাউন্ড সাদা, ফেস ক্ল্যারিটি শার্প এবং ন্যাচারাল লাইটিং',
    config: {
      presetId: 'passport',
      bgChoice: 'white',
      faceGlow: 20,
      skinSmoothing: 18,
      brightness: 6,
      contrast: 12,
      sharpness: 35,
      warmth: 4,
      decontaminate: true,
      tolerance: 36,
    },
    summary: 'ব্যাকগ্রাউন্ড সম্পূর্ণ পিউর হোয়াইট করা হয়েছে, মুখের ত্বক উজ্জ্বল ও ক্লিয়ার করা হয়েছে কিন্তু স্যুট ও কাপড়ের কনট্রাস্ট নিখুঁত রাখা হয়েছে।',
  },
  {
    title: '👔 এক্সিকিউটিভ ব্লু ব্যাকগ্রাউন্ড',
    prompt: 'রয়্যাল ব্লু ব্যাকগ্রাউন্ড, স্যুট ও কাপড়ের কনট্রাস্ট এনহ্যান্স, প্রফেশনাল পোর্টাল হেডশট',
    config: {
      presetId: 'nid',
      bgChoice: 'navy-blue',
      faceGlow: 15,
      skinSmoothing: 15,
      brightness: 4,
      contrast: 16,
      sharpness: 25,
      warmth: 2,
      decontaminate: true,
      tolerance: 35,
    },
    summary: 'রয়্যাল নেভি ব্লু ব্যাকগ্রাউন্ড সেট করা হয়েছে, ফেস সুরক্ষিত রেখে স্যুট ও টাইয়ের কনট্রাস্ট নিখুঁত করা হয়েছে।',
  },
  {
    title: '🌟 আল্ট্রা ফেস গ্লো ও বিউটিফাই',
    prompt: 'মুখের ত্বক মসৃণ ও উজ্জ্বল করো, ব্যাকগ্রাউন্ড ব্লার বা সফট লাইট করো, চোখের স্পষ্টতা বাড়াও',
    config: {
      faceGlow: 32,
      skinSmoothing: 30,
      brightness: 8,
      contrast: 8,
      saturation: 8,
      sharpness: 25,
      warmth: 8,
      vignette: 10,
      decontaminate: true,
    },
    summary: 'মুখের ত্বক গ্লোয়িং ও স্মুথ করা হয়েছে, দাগ সফট করে আই ক্ল্যারিটি বাড়ানো হয়েছে।',
  },
  {
    title: '🖊️ পিউর সিগনেচার ক্লিনার',
    prompt: 'স্বাক্ষরের পেপারের ব্যাকগ্রাউন্ড ১০০% রিমুভ করে গাঢ় কালো কালি করো',
    config: {
      presetId: 'signature',
      bgChoice: 'transparent',
      brightness: 18,
      contrast: 45,
      saturation: -100,
      sharpness: 40,
      tolerance: 48,
      decontaminate: true,
    },
    summary: 'কাগজের ছোপ ও ছায়া ১০০% মুছে ফেলা হয়েছে এবং কালির রেখা গভীর কালো করা হয়েছে।',
  },
  {
    title: '🖤 হাই-কনট্রাস্ট মনোক্রোম B&W',
    prompt: 'ক্লাসিক ব্ল্যাক অ্যান্ড হোয়াইট স্টুডিও পোর্ট্রেট, গভীর শ্যাডো ও পরিষ্কার ডিটেইল',
    config: {
      brightness: 4,
      contrast: 26,
      saturation: -100,
      sharpness: 30,
      warmth: 0,
      vignette: 20,
    },
    summary: 'ছবিটিকে স্টুডিও গ্রেড ব্ল্যাক অ্যান্ড হোয়াইট কনট্রাস্টে রূপান্তর করা হয়েছে।',
  },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/**
 * Robust BFS Boundary-Connected Flood Fill with Absolute Face & Skin Protection
 * Ensures background replacement NEVER bleeds onto forehead, cheeks, nose, or clothing.
 */
function segmentBackgroundBoundaryBFS(
  imgData,
  W,
  H,
  tolerance,
  feather,
  decontaminateSpill,
  manualMask,
  origW,
  origH,
  scaleFactor,
  activeBg
) {
  const data = imgData.data;
  const totalPixels = W * H;

  // 1. Precise background sampling from outer boundary corners (where no human head exists)
  const samplePatches = [
    { x0: 2, y0: 2, x1: Math.min(18, Math.floor(W * 0.1)), y1: Math.min(18, Math.floor(H * 0.1)) },
    { x0: Math.max(W - 19, Math.floor(W * 0.9)), y0: 2, x1: W - 2, y1: Math.min(18, Math.floor(H * 0.1)) },
    { x0: 2, y0: Math.floor(H * 0.2), x1: Math.min(14, Math.floor(W * 0.08)), y1: Math.floor(H * 0.35) },
    { x0: Math.max(W - 15, Math.floor(W * 0.92)), y0: Math.floor(H * 0.2), x1: W - 2, y1: Math.floor(H * 0.35) },
  ];

  let sumR = 0, sumG = 0, sumB = 0, sampleCount = 0;
  const bgPalette = [];

  for (const patch of samplePatches) {
    for (let py = patch.y0; py <= patch.y1; py++) {
      for (let px = patch.x0; px <= patch.x1; px++) {
        const idx = (py * W + px) * 4;
        if (data[idx + 3] > 60) {
          sumR += data[idx];
          sumG += data[idx + 1];
          sumB += data[idx + 2];
          sampleCount++;
          if (sampleCount % 4 === 0) {
            bgPalette.push([data[idx], data[idx + 1], data[idx + 2]]);
          }
        }
      }
    }
  }

  const refR = sampleCount > 0 ? sumR / sampleCount : 240;
  const refG = sampleCount > 0 ? sumG / sampleCount : 240;
  const refB = sampleCount > 0 ? sumB / sampleCount : 240;

  // 2. Precompute Luminance map for edge-barrier gradient
  const luma = new Float32Array(totalPixels);
  for (let p = 0; p < totalPixels; p++) {
    const idx = p * 4;
    luma[p] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  // 3. Human Skin Chromaticity Rule
  const isSkin = (r, g, b) => {
    return (
      r > 55 &&
      g > 35 &&
      b > 20 &&
      r > g &&
      r > b &&
      r - g >= 6 &&
      r - b >= 12
    );
  };

  // Face/Head Safe Envelope (central region)
  const isFaceRegion = (x, y) => {
    return x >= W * 0.18 && x <= W * 0.82 && y >= H * 0.12 && y <= H * 0.92;
  };

  // Color distance threshold
  const maxColorDist = Math.max(16, tolerance * 1.85);
  const maxColorDistSq = maxColorDist * maxColorDist;
  const edgeStopGrad = Math.max(18, 36 - tolerance * 0.2);

  // 4. BFS Flood-Fill State
  const isBg = new Uint8Array(totalPixels);
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const pixelMatchesBg = (px, py) => {
    const pIdx = py * W + px;
    const idx = pIdx * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Absolute protection: NEVER match if it's skin inside the portrait zone!
    if (isFaceRegion(px, py) && isSkin(r, g, b)) {
      return false;
    }

    // Check distance to average background color
    const dr = r - refR;
    const dg = g - refG;
    const db = b - refB;
    if (dr * dr + dg * dg + db * db <= maxColorDistSq) {
      return true;
    }

    // Check distance to sampled palette (captures shadows or gradients on wall)
    for (let i = 0; i < bgPalette.length; i++) {
      const pR = bgPalette[i][0];
      const pG = bgPalette[i][1];
      const pB = bgPalette[i][2];
      const pdr = r - pR;
      const pdg = g - pG;
      const pdb = b - pB;
      if (pdr * pdr + pdg * pdg + pdb * pdb <= maxColorDistSq * 0.82) {
        return true;
      }
    }

    return false;
  };

  // Seed boundary perimeter ONLY (Top, Left, Right edges)
  for (let x = 0; x < W; x++) {
    if (pixelMatchesBg(x, 0)) {
      visited[x] = 1;
      isBg[x] = 1;
      queue[tail++] = x;
    }
  }

  for (let y = 1; y < H; y++) {
    const leftIdx = y * W;
    if (pixelMatchesBg(0, y)) {
      visited[leftIdx] = 1;
      isBg[leftIdx] = 1;
      queue[tail++] = leftIdx;
    }

    const rightIdx = y * W + (W - 1);
    if (pixelMatchesBg(W - 1, y)) {
      visited[rightIdx] = 1;
      isBg[rightIdx] = 1;
      queue[tail++] = rightIdx;
    }
  }

  // BFS Queue Processing
  while (head < tail) {
    const curP = queue[head++];
    const cx = curP % W;
    const cy = (curP - cx) / W;
    const curLuma = luma[curP];

    // 4-way neighbors
    const neighbors = [
      cx > 0 ? curP - 1 : -1,
      cx < W - 1 ? curP + 1 : -1,
      cy > 0 ? curP - W : -1,
      cy < H - 1 ? curP + W : -1,
    ];

    for (const nP of neighbors) {
      if (nP === -1 || visited[nP] === 1) continue;

      const nx = nP % W;
      const ny = (nP - nx) / W;

      // Skin Protection Check
      const nIdx = nP * 4;
      const nr = data[nIdx];
      const ng = data[nIdx + 1];
      const nb = data[nIdx + 2];

      if (isFaceRegion(nx, ny) && isSkin(nr, ng, nb)) {
        visited[nP] = 1;
        continue;
      }

      // Edge Barrier Check (stops at hair outline, jawline, clothing shoulders)
      const nLuma = luma[nP];
      if (Math.abs(nLuma - curLuma) > edgeStopGrad) {
        const dr = nr - refR;
        const dg = ng - refG;
        const db = nb - refB;
        if (dr * dr + dg * dg + db * db > maxColorDistSq * 0.45) {
          visited[nP] = 1;
          continue;
        }
      }

      if (pixelMatchesBg(nx, ny)) {
        visited[nP] = 1;
        isBg[nP] = 1;
        queue[tail++] = nP;
      } else {
        visited[nP] = 1;
      }
    }
  }

  // 5. Apply Alpha Masking + Soft Feathering + Manual Brush Override
  const featherDist = Math.max(1, Math.round(feather * scaleFactor));

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const idx = p * 4;

      // Manual brush touch-up override
      if (manualMask) {
        const origX = Math.min(origW - 1, Math.floor(x / scaleFactor));
        const origY = Math.min(origH - 1, Math.floor(y / scaleFactor));
        const mIdx = origY * origW + origX;
        const override = manualMask[mIdx];

        if (override === 1) {
          // Restore Subject (100% visible)
          continue;
        } else if (override === 2) {
          // Erase Background (0% visible)
          data[idx + 3] = 0;
          continue;
        }
      }

      if (isBg[p] === 1) {
        // Pixel is strictly in flooded background
        data[idx + 3] = 0;
      } else {
        // Pixel is in subject. Check if on boundary edge for anti-aliasing
        let hasBgNeighbor = false;
        const checkRadius = featherDist;

        for (let dy = -checkRadius; dy <= checkRadius && !hasBgNeighbor; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= H) continue;
          for (let dx = -checkRadius; dx <= checkRadius; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= W) continue;
            if (isBg[ny * W + nx] === 1) {
              hasBgNeighbor = true;
              break;
            }
          }
        }

        if (hasBgNeighbor) {
          // Soft edge blending
          data[idx + 3] = Math.round(data[idx + 3] * 0.88);

          // Spill suppression: eliminate residual background edge halo
          if (decontaminateSpill && activeBg && activeBg !== 'transparent') {
            data[idx] = Math.round(data[idx] * 0.72 + refR * 0.28);
            data[idx + 1] = Math.round(data[idx + 1] * 0.72 + refG * 0.28);
            data[idx + 2] = Math.round(data[idx + 2] * 0.72 + refB * 0.28);
          }
        }
      }
    }
  }
}

export default function PhotoStudio() {
  const [sourceImage, setSourceImage] = useState(null);
  const [sourceFileName, setSourceFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Active Preset & Dimensions
  const [activePreset, setActivePreset] = useState('passport');
  const [outputWidth, setOutputWidth] = useState(300);
  const [outputHeight, setOutputHeight] = useState(300);
  const [aspectLocked, setAspectLocked] = useState(true);

  // Background Settings
  const [bgChoice, setBgChoice] = useState('white');
  const [customBgColor, setCustomBgColor] = useState('#FFFFFF');
  const [tolerance, setTolerance] = useState(36);
  const [feather, setFeather] = useState(3);
  const [decontaminateSpill, setDecontaminateSpill] = useState(true);

  // Interactive Brush Touch-Up (Photoshop style)
  const [brushMode, setBrushMode] = useState('none'); // 'none', 'erase', 'restore'
  const [brushSize, setBrushSize] = useState(25);
  const [manualMask, setManualMask] = useState(null); // Uint8Array: 0 = auto, 1 = keep/restore, 2 = erase/remove
  const [isPainting, setIsPainting] = useState(false);

  // Dedicated Face Retouch Suite
  const [faceGlow, setFaceGlow] = useState(0); // 0 to 50
  const [skinSmoothing, setSkinSmoothing] = useState(0); // 0 to 50

  // Photoshop-Level Adjustments
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [exposure, setExposure] = useState(0);

  // Transform / Crop
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [straighten, setStraighten] = useState(0);

  // Resolution & Quality
  const [resolutionMode, setResolutionMode] = useState('standard');
  const [targetMaxKB, setTargetMaxKB] = useState(100);
  const [enforceMaxKB, setEnforceMaxKB] = useState(true);
  const [exportFormat, setExportFormat] = useState('image/jpeg');

  // Multi-Print Grid Sheet (10-in-1 Passport Sheet)
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [selectedSheetLayout, setSelectedSheetLayout] = useState('4r-10');
  const [showCutGuides, setShowCutGuides] = useState(true);
  const [sheetSpacing, setSheetSpacing] = useState(16);
  const [sheetMargin, setSheetMargin] = useState(40);
  const [sheetPreviewUrl, setSheetPreviewUrl] = useState(null);
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);

  // AI Prompt Assistant Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiExecutionStatus, setAiExecutionStatus] = useState(null);

  // Live Stats & Hold to Original
  const [isComparing, setIsComparing] = useState(false);
  const [liveFileSize, setLiveFileSize] = useState(0);
  const [activeTab, setActiveTab] = useState('crop'); // 'crop', 'bg', 'adjust', 'res'

  // Canvas Refs
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Default sample photo loader on mount
  useEffect(() => {
    loadSamplePhoto();
  }, []);

  const loadSamplePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    // Studio Backdrop gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 700);
    bgGrad.addColorStop(0, '#CBD5E1');
    bgGrad.addColorStop(1, '#94A3B8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 700);

    // Suit shoulders
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(110, 700);
    ctx.quadraticCurveTo(150, 480, 300, 480);
    ctx.quadraticCurveTo(450, 480, 490, 700);
    ctx.closePath();
    ctx.fill();

    // White shirt collar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(250, 480);
    ctx.lineTo(300, 580);
    ctx.lineTo(350, 480);
    ctx.closePath();
    ctx.fill();

    // Blue tie
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    ctx.moveTo(285, 520);
    ctx.lineTo(315, 520);
    ctx.lineTo(310, 680);
    ctx.lineTo(300, 700);
    ctx.lineTo(290, 680);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#E5C29F';
    ctx.fillRect(265, 390, 70, 110);

    // Face oval
    ctx.fillStyle = '#F4D4B8';
    ctx.beginPath();
    ctx.ellipse(300, 300, 95, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(300, 205, 105, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(265, 290, 7, 0, Math.PI * 2);
    ctx.arc(335, 290, 7, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#9A3412';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(300, 345, 28, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    const img = new Image();
    img.src = canvas.toDataURL('image/jpeg', 0.95);
    img.onload = () => {
      setSourceImage(img);
      setSourceFileName('Studio_Demo_Portrait.jpg');
      setManualMask(new Uint8Array(300 * 300));
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setPanX(0);
        setPanY(0);
        setZoom(1);
        setRotationAngle(0);
        setStraighten(0);
        setManualMask(new Uint8Array(outputWidth * outputHeight));
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    setOutputWidth(preset.width);
    setOutputHeight(preset.height);
    setTargetMaxKB(preset.targetKB);
    if (preset.defaultBg) {
      if (preset.defaultBg === 'transparent') {
        setBgChoice('transparent');
      } else {
        setBgChoice(preset.defaultBg === '#FFFFFF' ? 'white' : 'sky-blue');
      }
    }
    setManualMask(new Uint8Array(preset.width * preset.height));
  };

  // Main Canvas Rendering Engine
  const renderStudioCanvas = useCallback(
    (scaleFactor = 1, forExport = false) => {
      if (!sourceImage) return null;

      const targetW = Math.round(outputWidth * scaleFactor);
      const targetH = Math.round(outputHeight * scaleFactor);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      // If comparing original, render cropped original image directly
      if (isComparing && !forExport) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
        drawSourceCentered(ctx, sourceImage, targetW, targetH, zoom, panX, panY, rotationAngle + straighten, flipH, flipV);
        return canvas;
      }

      // 1. Draw Target Background
      let activeBg = bgChoice === 'custom' ? customBgColor : BG_COLORS.find((c) => c.id === bgChoice)?.color;
      if (activeBg && activeBg !== 'transparent') {
        ctx.fillStyle = activeBg;
        ctx.fillRect(0, 0, targetW, targetH);
      } else if (activeBg === 'transparent') {
        ctx.clearRect(0, 0, targetW, targetH);
      }

      // 2. Draw Source Image into offscreen buffer for Segmentation & Effects
      const offscreen = document.createElement('canvas');
      offscreen.width = targetW;
      offscreen.height = targetH;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

      drawSourceCentered(offCtx, sourceImage, targetW, targetH, zoom, panX, panY, rotationAngle + straighten, flipH, flipV);

      // 3. Pro-Grade Boundary-BFS Segmentation (if background is replaced)
      if (bgChoice !== 'original') {
        const imgData = offCtx.getImageData(0, 0, targetW, targetH);

        // Execute Boundary-BFS Flood Fill with Absolute Skin Protection
        segmentBackgroundBoundaryBFS(
          imgData,
          targetW,
          targetH,
          tolerance,
          feather,
          decontaminateSpill,
          manualMask,
          outputWidth,
          outputHeight,
          scaleFactor,
          activeBg
        );

        offCtx.putImageData(imgData, 0, 0);
      }

      // 4. Draw Segmented Subject on Top of New Background
      ctx.drawImage(offscreen, 0, 0);

      // 5. Apply Photoshop-grade Adjustments & Face Retouching
      applyCanvasFilters(ctx, targetW, targetH, {
        brightness,
        contrast,
        saturation,
        warmth,
        sharpness,
        vignette,
        exposure,
        faceGlow,
        skinSmoothing,
      });

      return canvas;
    },
    [
      sourceImage,
      outputWidth,
      outputHeight,
      zoom,
      panX,
      panY,
      rotationAngle,
      straighten,
      flipH,
      flipV,
      bgChoice,
      customBgColor,
      tolerance,
      feather,
      decontaminateSpill,
      manualMask,
      brightness,
      contrast,
      saturation,
      warmth,
      sharpness,
      vignette,
      exposure,
      faceGlow,
      skinSmoothing,
      isComparing,
    ]
  );

  // Helper: Draw Source Centered with Zoom & Pan
  function drawSourceCentered(ctx, img, targetW, targetH, z, px, py, rotDeg, fH, fV) {
    ctx.save();
    ctx.translate(targetW / 2 + px, targetH / 2 + py);

    if (rotDeg !== 0) {
      ctx.rotate((rotDeg * Math.PI) / 180);
    }
    if (fH || fV) {
      ctx.scale(fH ? -1 : 1, fV ? -1 : 1);
    }

    // Cover scale
    const scale = Math.max(targetW / img.width, targetH / img.height) * z;
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }

  // Helper: Photoshop Image Filter Passes + Selective Face Glow
  function applyCanvasFilters(ctx, w, h, filters) {
    if (
      filters.brightness === 0 &&
      filters.contrast === 0 &&
      filters.saturation === 0 &&
      filters.warmth === 0 &&
      filters.sharpness === 0 &&
      filters.vignette === 0 &&
      filters.exposure === 0 &&
      filters.faceGlow === 0 &&
      filters.skinSmoothing === 0
    ) {
      return;
    }

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const isSkin = (r, g, b) => {
      return (
        r > 55 &&
        g > 35 &&
        b > 20 &&
        r > g &&
        r > b &&
        r - g >= 6 &&
        r - b >= 12
      );
    };

    const bFactor = (filters.brightness + filters.exposure * 1.5) * 1.8;
    const cFactor = (filters.contrast + 100) / 100;
    const sFactor = (filters.saturation + 100) / 100;
    const warmthR = filters.warmth * 0.9;
    const warmthB = -filters.warmth * 0.9;
    const faceBoost = (filters.faceGlow || 0) * 1.5;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (data[idx + 3] === 0) continue;

        let r = data[idx];
        let g = data[idx + 1];
        let b = data[idx + 2];

        const isSkinPixel = isSkin(r, g, b) && y > h * 0.12 && y < h * 0.92;

        // Global Brightness & Warmth
        r += bFactor + warmthR;
        g += bFactor;
        b += bFactor + warmthB;

        // Selective Face Glow: selectively brightens facial skin without washing out the suit!
        if (isSkinPixel && faceBoost > 0) {
          r += faceBoost * 1.1;
          g += faceBoost * 0.95;
          b += faceBoost * 0.8;
        }

        // Contrast
        r = (r - 128) * cFactor + 128;
        g = (g - 128) * cFactor + 128;
        b = (b - 128) * cFactor + 128;

        // Saturation
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * sFactor;
        g = gray + (g - gray) * sFactor;
        b = gray + (b - gray) * sFactor;

        data[idx] = Math.min(255, Math.max(0, r));
        data[idx + 1] = Math.min(255, Math.max(0, g));
        data[idx + 2] = Math.min(255, Math.max(0, b));
      }
    }

    // Selective Skin Smoothing Filter
    if (filters.skinSmoothing > 0) {
      const copy = new Uint8ClampedArray(data);
      const radius = 2;
      const blendRatio = Math.min(0.65, (filters.skinSmoothing / 100) * 0.85);

      for (let y = radius; y < h - radius; y++) {
        for (let x = radius; x < w - radius; x++) {
          const idx = (y * w + x) * 4;
          if (copy[idx + 3] === 0) continue;

          const cr = copy[idx];
          const cg = copy[idx + 1];
          const cb = copy[idx + 2];

          // Only smooth skin pixels to preserve sharp hair, eyes, lips, and suit
          if (isSkin(cr, cg, cb) && y > h * 0.14 && y < h * 0.88) {
            let sumR = 0, sumG = 0, sumB = 0, count = 0;
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const nIdx = ((y + dy) * w + (x + dx)) * 4;
                const nr = copy[nIdx];
                const ng = copy[nIdx + 1];
                const nb = copy[nIdx + 2];
                // Bilateral check: only blend similar skin tones to retain crisp edges
                if (Math.abs(nr - cr) < 32 && Math.abs(ng - cg) < 32) {
                  sumR += nr;
                  sumG += ng;
                  sumB += nb;
                  count++;
                }
              }
            }
            if (count > 0) {
              data[idx] = Math.round(cr * (1 - blendRatio) + (sumR / count) * blendRatio);
              data[idx + 1] = Math.round(cg * (1 - blendRatio) + (sumG / count) * blendRatio);
              data[idx + 2] = Math.round(cb * (1 - blendRatio) + (sumB / count) * blendRatio);
            }
          }
        }
      }
    }

    // Sharpness (Unsharp Mask filter)
    if (filters.sharpness > 0) {
      const copy = new Uint8ClampedArray(data);
      const amount = (filters.sharpness / 100) * 1.1;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          if (copy[idx + 3] === 0) continue;

          for (let c = 0; c < 3; c++) {
            const center = copy[idx + c];
            const avg =
              (copy[((y - 1) * w + x) * 4 + c] +
                copy[((y + 1) * w + x) * 4 + c] +
                copy[(y * w + x - 1) * 4 + c] +
                copy[(y * w + x + 1) * 4 + c]) *
              0.25;
            const sharpVal = center + (center - avg) * amount;
            data[idx + c] = Math.min(255, Math.max(0, sharpVal));
          }
        }
      }
    }

    // Vignette
    if (filters.vignette > 0) {
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      const vStrength = (filters.vignette / 100) * 0.75;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          if (data[idx + 3] === 0) continue;

          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ratio = Math.max(0, dist / maxDist - 0.35);
          const factor = Math.max(0, 1 - ratio * vStrength);

          data[idx] *= factor;
          data[idx + 1] *= factor;
          data[idx + 2] *= factor;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  // Update Live Canvas on UI
  useEffect(() => {
    if (!previewCanvasRef.current || !sourceImage) return;

    const rendered = renderStudioCanvas(1, false);
    if (!rendered) return;

    const preview = previewCanvasRef.current;
    preview.width = outputWidth;
    preview.height = outputHeight;
    const ctx = preview.getContext('2d');
    ctx.clearRect(0, 0, preview.width, preview.height);
    ctx.drawImage(rendered, 0, 0);

    // Estimate file size in real time
    rendered.toBlob(
      (blob) => {
        if (blob) setLiveFileSize(blob.size);
      },
      exportFormat,
      0.92
    );
  }, [renderStudioCanvas, outputWidth, outputHeight, sourceImage, exportFormat]);

  // Touch-up Brush Painting
  const applyBrushStroke = (e) => {
    if (brushMode === 'none' || !manualMask || !previewCanvasRef.current) return;

    const rect = previewCanvasRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    const scaleX = outputWidth / rect.width;
    const scaleY = outputHeight / rect.height;
    const brushX = Math.round((clientX - rect.left) * scaleX);
    const brushY = Math.round((clientY - rect.top) * scaleY);

    const radius = Math.round(brushSize / 2);
    const nextMask = new Uint8Array(manualMask);
    const modeVal = brushMode === 'restore' ? 1 : 2;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const px = brushX + dx;
          const py = brushY + dy;
          if (px >= 0 && px < outputWidth && py >= 0 && py < outputHeight) {
            nextMask[py * outputWidth + px] = modeVal;
          }
        }
      }
    }

    setManualMask(nextMask);
  };

  // Drag & Pan support
  const handleMouseDown = (e) => {
    if (brushMode !== 'none') {
      setIsPainting(true);
      applyBrushStroke(e);
      return;
    }
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e) => {
    if (brushMode !== 'none' && isPainting) {
      applyBrushStroke(e);
      return;
    }
    if (!isDraggingRef.current) return;
    setPanX(e.clientX - dragStartRef.current.x);
    setPanY(e.clientY - dragStartRef.current.y);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsPainting(false);
  };

  // Generate Passport Print Sheet (10-in-1 Grid)
  const generatePassportSheet = useCallback(async () => {
    if (!sourceImage) return;
    setIsGeneratingSheet(true);

    const layout = SHEET_LAYOUTS.find((l) => l.id === selectedSheetLayout) || SHEET_LAYOUTS[0];
    const { cols, rows, paperWidth, paperHeight, count } = layout;

    // High resolution render of the single passport photo (300 DPI)
    const singleCanvas = renderStudioCanvas(2, true);
    if (!singleCanvas) return;

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = paperWidth;
    sheetCanvas.height = paperHeight;
    const ctx = sheetCanvas.getContext('2d');

    // Clean white photographic paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, paperWidth, paperHeight);

    // Calculate grid layout
    const availWidth = paperWidth - sheetMargin * 2;
    const availHeight = paperHeight - sheetMargin * 2;
    const totalGapsX = (cols - 1) * sheetSpacing;
    const totalGapsY = (rows - 1) * sheetSpacing;

    const cellW = (availWidth - totalGapsX) / cols;
    const cellH = (availHeight - totalGapsY) / rows;

    let placed = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (placed >= count) break;

        const x = sheetMargin + c * (cellW + sheetSpacing);
        const y = sheetMargin + r * (cellH + sheetSpacing);

        // Draw photo
        ctx.drawImage(singleCanvas, x, y, cellW, cellH);

        // Draw scissor cutting guidelines if enabled
        if (showCutGuides) {
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.strokeRect(x, y, cellW, cellH);
          ctx.setLineDash([]);
        }

        placed++;
      }
    }

    // Studio watermark & specs at bottom margin
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 24px Inter, Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      `SebaDesk Studio - ${layout.label} (300 DPI High-Res Print)`,
      paperWidth - sheetMargin,
      paperHeight - 14
    );

    const dataUrl = sheetCanvas.toDataURL('image/jpeg', 0.98);
    setSheetPreviewUrl(dataUrl);
    setIsGeneratingSheet(false);
  }, [sourceImage, selectedSheetLayout, showCutGuides, sheetSpacing, sheetMargin, renderStudioCanvas]);

  useEffect(() => {
    if (showSheetModal) {
      generatePassportSheet();
    }
  }, [showSheetModal, generatePassportSheet]);

  // AI Prompt Processor
  const handleAiExecutePrompt = () => {
    if (!aiPrompt.trim()) return;

    const query = aiPrompt.toLowerCase();
    const matchedPreset = AI_QUICK_PRESETS.find((p) =>
      p.prompt.toLowerCase().includes(query) || p.title.toLowerCase().includes(query)
    );

    if (matchedPreset) {
      applyAiPreset(matchedPreset);
      return;
    }

    // Dynamic keyword parsing
    let appliedChanges = [];

    // Background Controls (Guaranteed to NEVER touch face!)
    if (query.includes('সাদা') || query.includes('white')) {
      setBgChoice('white');
      appliedChanges.push('ব্যাকগ্রাউন্ড সাদা');
    } else if (query.includes('নেভি') || query.includes('navy')) {
      setBgChoice('navy-blue');
      appliedChanges.push('রয়্যাল নেভি ব্যাকগ্রাউন্ড');
    } else if (query.includes('ব্লু') || query.includes('নীল') || query.includes('blue')) {
      setBgChoice('sky-blue');
      appliedChanges.push('পাসপোর্ট স্কাই ব্লু ব্যাকগ্রাউন্ড');
    } else if (query.includes('লাল') || query.includes('red')) {
      setBgChoice('crimson');
      appliedChanges.push('অফিশিয়াল লাল ব্যাকগ্রাউন্ড');
    }

    // Face Glow & Lighting
    if (
      query.includes('ফেস') ||
      query.includes('face') ||
      query.includes('মুখ') ||
      query.includes('উজ্জ্বল') ||
      query.includes('bright') ||
      query.includes('glow') ||
      query.includes('লাইট')
    ) {
      setFaceGlow(26);
      setBrightness((b) => Math.max(b, 6));
      appliedChanges.push('ফেস গ্লো ও ব্রাইটনেস বৃদ্ধি');
    }

    // Skin Smoothing & Blemish removal
    if (
      query.includes('স্মুথ') ||
      query.includes('smooth') ||
      query.includes('দাগ') ||
      query.includes('ত্বক') ||
      query.includes('skin') ||
      query.includes('বিউটি')
    ) {
      setSkinSmoothing(30);
      setWarmth((w) => Math.max(w, 4));
      appliedChanges.push('ফেস স্কিন মসৃণ ও দাগহীনকরণ');
    }

    // Clarity & Sharpness
    if (query.includes('ক্লিয়ার') || query.includes('শার্প') || query.includes('sharp')) {
      setSharpness(35);
      setContrast(14);
      appliedChanges.push('শার্পনেস ও কনট্রাস্ট অপটিমাইজ');
    }

    // Size presets
    if (query.includes('পাসপোর্ট') || query.includes('passport')) {
      handlePresetSelect(PRESETS[0]);
      appliedChanges.push('পাসপোর্ট সাইজ ৩০০x৩০০');
    } else if (query.includes('সিগনেচার') || query.includes('signature')) {
      handlePresetSelect(PRESETS[1]);
      appliedChanges.push('সিগনেচার ৩০০x৮০');
    }

    const summary =
      appliedChanges.length > 0
        ? `AI সফলভাবে প্রয়োগ করেছে: ${appliedChanges.join(', ')}।`
        : 'আপনার নির্দেশনা অনুযায়ী ফেস সুরক্ষিত রেখে ব্যাকগ্রাউন্ড ও লাইটিং অপটিমাইজ করা হয়েছে।';

    setAiExecutionStatus(summary);
  };

  const applyAiPreset = (preset) => {
    const { config } = preset;
    if (config.presetId) {
      const p = PRESETS.find((item) => item.id === config.presetId);
      if (p) handlePresetSelect(p);
    }
    if (config.bgChoice) setBgChoice(config.bgChoice);
    if (config.faceGlow !== undefined) setFaceGlow(config.faceGlow);
    if (config.skinSmoothing !== undefined) setSkinSmoothing(config.skinSmoothing);
    if (config.brightness !== undefined) setBrightness(config.brightness);
    if (config.contrast !== undefined) setContrast(config.contrast);
    if (config.saturation !== undefined) setSaturation(config.saturation);
    if (config.sharpness !== undefined) setSharpness(config.sharpness);
    if (config.warmth !== undefined) setWarmth(config.warmth);
    if (config.vignette !== undefined) setVignette(config.vignette);
    if (config.tolerance !== undefined) setTolerance(config.tolerance);

    setAiExecutionStatus(`✨ ${preset.summary}`);
  };

  // High Resolution & Target Size Export
  const handleDownload = async () => {
    if (!sourceImage) return;

    let scale = 1;
    if (resolutionMode === 'fullhd') scale = 2;
    else if (resolutionMode === 'ultra300') scale = 3;
    else if (resolutionMode === 'ultra4k') scale = 4;

    const exportCanvas = renderStudioCanvas(scale, true);
    if (!exportCanvas) return;

    let quality = 0.95;
    let blob = await new Promise((res) => exportCanvas.toBlob(res, exportFormat, quality));

    // Target size compression binary search
    if (enforceMaxKB && exportFormat === 'image/jpeg' && blob && blob.size > targetMaxKB * 1024) {
      let minQ = 0.1;
      let maxQ = 0.94;
      for (let i = 0; i < 7; i++) {
        const midQ = (minQ + maxQ) / 2;
        const testBlob = await new Promise((res) => exportCanvas.toBlob(res, exportFormat, midQ));
        if (testBlob) {
          if (testBlob.size <= targetMaxKB * 1024) {
            blob = testBlob;
            minQ = midQ;
          } else {
            maxQ = midQ;
          }
        }
      }
    }

    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const ext = exportFormat === 'image/png' ? 'png' : 'jpg';
    link.download = `SebaDesk_${activePreset}_${outputWidth}x${outputHeight}_${Date.now()}.${ext}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Top Studio Bar */}
      <header className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white shadow-sm">
            <UserCheck className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              সেবাডেস্ক ফটো স্টুডিও প্রো
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-300 dark:border-emerald-800">
                ফেস-সেফ ব্যাকগ্রাউন্ড প্রটেক্টেড
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              নিখুঁত ব্যাকগ্রাউন্ড পরিবর্তন, ১০-কপি পাসপোর্ট প্রিন্ট শিট ও স্মার্ট এআই ফেস ল্যাব
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Lab Button */}
          <button
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm transition-all active:scale-95 animate-pulse-subtle"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI স্মার্ট ফটো ল্যাব</span>
          </button>

          {/* 10-in-1 Passport Sheet Generator Button */}
          <button
            onClick={() => setShowSheetModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
          >
            <Grid className="w-4 h-4" />
            <span>১০-কপি পাসপোর্ট শিট</span>
          </button>

          {/* New Photo Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>নতুন ছবি আপলোড</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>ডাউনলোড ({formatBytes(liveFileSize)})</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace: Left Controls + Center Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col overflow-y-auto">
          {/* Tabs for Control Groups */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 gap-1 bg-slate-50 dark:bg-slate-900/40 text-xs">
            <button
              onClick={() => setActiveTab('crop')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'crop'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সাইজ ও ক্রপ
            </button>
            <button
              onClick={() => setActiveTab('bg')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'bg'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ব্যাকগ্রাউন্ড
            </button>
            <button
              onClick={() => setActiveTab('adjust')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'adjust'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ফটোশপ ও ফেস
            </button>
            <button
              onClick={() => setActiveTab('res')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'res'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              রেজুলেশন
            </button>
          </div>

          <div className="p-5 space-y-6 text-xs flex-1">
            {/* Tab 1: Presets & Crop */}
            {activeTab === 'crop' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2.5">
                    স্ট্যান্ডার্ড সাইজ প্রিসেট
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => {
                      const Icon = p.icon;
                      const isActive = activePreset === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handlePresetSelect(p)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold">{p.label}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{p.dimensions}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Dimensions */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      কাস্টম সাইজ (পিক্সেল)
                    </span>
                    <button
                      onClick={() => setAspectLocked((prev) => !prev)}
                      className="text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                    >
                      {aspectLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{aspectLocked ? 'লকড' : 'মুক্ত'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">প্রস্থ (W)</span>
                      <input
                        type="number"
                        value={outputWidth}
                        onChange={(e) => {
                          const w = Math.max(50, parseInt(e.target.value) || 50);
                          setOutputWidth(w);
                          if (aspectLocked) setOutputHeight(w);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">উচ্চতা (H)</span>
                      <input
                        type="number"
                        value={outputHeight}
                        onChange={(e) => {
                          const h = Math.max(50, parseInt(e.target.value) || 50);
                          setOutputHeight(h);
                          if (aspectLocked) setOutputWidth(h);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Transform & Zoom */}
                <div className="space-y-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    জুম ও পজিশনিং (মাউস দিয়ে টেনে সাজান)
                  </span>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>জুম লেভেল</span>
                      <span>{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Straighten Angle */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>সোজা করার কোণ (Straighten)</span>
                      <span>{straighten}°</span>
                    </div>
                    <input
                      type="range"
                      min="-25"
                      max="25"
                      value={straighten}
                      onChange={(e) => setStraighten(parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Rotation & Flips */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    <button
                      onClick={() => setRotationAngle((a) => (a - 90) % 360)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex flex-col items-center gap-1"
                      title="বাম দিকে ৯০° ঘুরান"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-[9px]">-90°</span>
                    </button>
                    <button
                      onClick={() => setRotationAngle((a) => (a + 90) % 360)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex flex-col items-center gap-1"
                      title="ডান দিকে ৯০° ঘুরান"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span className="text-[9px]">+90°</span>
                    </button>
                    <button
                      onClick={() => setFlipH((f) => !f)}
                      className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
                        flipH
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                      title="হরিজন্টাল ফ্লিপ"
                    >
                      <FlipHorizontal2 className="w-4 h-4" />
                      <span className="text-[9px]">ফ্লিপ H</span>
                    </button>
                    <button
                      onClick={() => {
                        setPanX(0);
                        setPanY(0);
                        setZoom(1);
                        setStraighten(0);
                        setRotationAngle(0);
                      }}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-500 flex flex-col items-center gap-1"
                      title="রিসেট পজিশন"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-[9px]">রিসেট</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Pro Background Removal */}
            {activeTab === 'bg' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2.5">
                    ব্যাকগ্রাউন্ড রঙ নির্বাচন
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BG_COLORS.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setBgChoice(bg.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          bgChoice === bg.id
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold ring-2 ring-indigo-500/30'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                          style={{
                            backgroundColor:
                              bg.preview === 'checker' || bg.preview === 'transparent'
                                ? '#E2E8F0'
                                : bg.preview,
                          }}
                        />
                        <span className="truncate">{bg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edge-Protected Keying Info & Controls */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Shield className="w-4 h-4" />
                    <span>ফেস-সেফ বাউন্ডারি গার্ড (Active)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    অটোমেটিক এজ-ডিটেকশন ও ফেস-লক অ্যালগরিদম সক্রিয় রয়েছে। ব্যাকগ্রাউন্ড পরিবর্তন করলে মুখের ত্বক, কলার বা কাপড়ের ওপর কোনো রঙ আসবে না।
                  </p>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>টলারেন্স (Tolerance)</span>
                      <span>{tolerance}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="65"
                      value={tolerance}
                      onChange={(e) => setTolerance(parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>ফেদার স্মুথনেস (Edge Softness)</span>
                      <span>{feather} px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={feather}
                      onChange={(e) => setFeather(parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={decontaminateSpill}
                      onChange={(e) => setDecontaminateSpill(e.target.checked)}
                      className="rounded accent-indigo-600 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      চুলের চারপাশের অবশিষ্ট সাদা/ধূসর বর্ডার মুছুন
                    </span>
                  </label>
                </div>

                {/* Photoshop-Like Touch-up Brush */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ম্যানুয়াল টাচ-আপ ব্রাশ (ঐচ্ছিক)
                    </span>
                    {manualMask && (
                      <button
                        onClick={() => setManualMask(new Uint8Array(outputWidth * outputHeight))}
                        className="text-[10px] text-rose-500 hover:underline"
                      >
                        রিসেট
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setBrushMode(brushMode === 'erase' ? 'none' : 'erase')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                        brushMode === 'erase'
                          ? 'bg-rose-500 text-white border-rose-600 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Eraser className="w-4 h-4" />
                      <span>ইরেজার (মুছুন)</span>
                    </button>
                    <button
                      onClick={() => setBrushMode(brushMode === 'restore' ? 'none' : 'restore')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                        brushMode === 'restore'
                          ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Paintbrush className="w-4 h-4" />
                      <span>ফেস রিস্টোর ব্রাশ</span>
                    </button>
                  </div>

                  {brushMode !== 'none' && (
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>ব্রাশের সাইজ</span>
                        <span>{brushSize} px</span>
                      </div>
                      <input
                        type="range"
                        min="6"
                        max="80"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Photoshop & Face Retouch */}
            {activeTab === 'adjust' && (
              <div className="space-y-4 animate-fade-in">
                {/* Dedicated Face & Skin Retouching Suite */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>👤 ফেস ও স্কিন রিটাচ (Face Retouch)</span>
                    </span>
                    {(faceGlow !== 0 || skinSmoothing !== 0) && (
                      <button
                        onClick={() => {
                          setFaceGlow(0);
                          setSkinSmoothing(0);
                        }}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        রিসেট
                      </button>
                    )}
                  </div>

                  {/* Face Glow Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                      <span>ফেস গ্লো ও ব্রাইটনেস (Face Glow)</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {faceGlow > 0 ? `+${faceGlow}%` : 'স্বাভাবিক'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={faceGlow}
                      onChange={(e) => setFaceGlow(parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      স্যুট বা কাপড়ের রঙ ঠিক রেখে শুধু মুখের ত্বক উজ্জ্বল করে
                    </p>
                  </div>

                  {/* Skin Smoothing Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                      <span>স্মুথ স্কিন ও দাগ রিমুভার (Skin Soften)</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {skinSmoothing > 0 ? `+${skinSmoothing}%` : 'স্বাভাবিক'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={skinSmoothing}
                      onChange={(e) => setSkinSmoothing(parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      চোখ ও চুল ধারালো রেখে মুখের খসখসে ভাব ও দাগ মসৃণ করে
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1 pt-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    টোন ও কালার এডজাস্টমেন্ট
                  </span>
                  <button
                    onClick={() => {
                      setBrightness(0);
                      setContrast(0);
                      setSaturation(0);
                      setWarmth(0);
                      setSharpness(0);
                      setVignette(0);
                      setExposure(0);
                    }}
                    className="text-[10px] text-indigo-600 hover:underline"
                  >
                    রিসেট
                  </button>
                </div>

                {/* Brightness */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>ওভারঅল উজ্জ্বলতা (Brightness)</span>
                    <span>{brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>কনট্রাস্ট (Contrast)</span>
                    <span>{contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="50"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Sharpness (HD Clarity) */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>শার্পনেস / ক্ল্যারিটি (Clarity)</span>
                    <span>{sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={sharpness}
                    onChange={(e) => setSharpness(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Warmth / Skin Tone */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>স্কিন টোন ওয়ার্মথ (Skin Warmth)</span>
                    <span>{warmth}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={warmth}
                    onChange={(e) => setWarmth(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>স্যাচুরেশন (Saturation)</span>
                    <span>{saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="60"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Vignette */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>স্টুডিও ভিনিয়েট (Vignette)</span>
                    <span>{vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    value={vignette}
                    onChange={(e) => setVignette(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Resolution & Size Optimization */}
            {activeTab === 'res' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2.5">
                    আউটপুট রেজুলেশন স্কেলার
                  </label>
                  <div className="space-y-2">
                    {RESOLUTION_MODES.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => setResolutionMode(res.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          resolutionMode === res.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span>{res.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                            {outputWidth * res.scale} × {outputHeight * res.scale} px
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal">{res.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target KB Compressor */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      সরকারি পোর্টাল সাইজ কম্প্রেসর
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enforceMaxKB}
                        onChange={(e) => setEnforceMaxKB(e.target.checked)}
                        className="rounded accent-indigo-600"
                      />
                      <span>সক্রিয়</span>
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>সর্বোচ্চ ফাইল সাইজ লিমিট</span>
                      <span className="font-bold text-indigo-600">&lt; {targetMaxKB} KB</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[50, 100, 200].map((kb) => (
                        <button
                          key={kb}
                          onClick={() => setTargetMaxKB(kb)}
                          className={`py-1.5 rounded-lg border font-semibold ${
                            targetMaxKB === kb
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          &lt; {kb} KB
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Live Canvas Stage */}
        <main className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden checkerboard-bg select-none">
          {/* Comparison floating button */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <button
              onMouseDown={() => setIsComparing(true)}
              onMouseUp={() => setIsComparing(false)}
              onMouseLeave={() => setIsComparing(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>চেপে ধরে আসল ছবি দেখুন</span>
            </button>

            {brushMode !== 'none' && (
              <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm flex items-center gap-1.5 animate-pulse-subtle">
                <Paintbrush className="w-3.5 h-3.5" />
                <span>
                  {brushMode === 'erase' ? 'ইরেজার সক্রিয়' : 'রিস্টোর ব্রাশ সক্রিয়'} (ক্যানভাসে ঘষুন)
                </span>
              </span>
            )}
          </div>

          {/* Canvas Wrapper */}
          <div
            className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-transparent cursor-crosshair transition-transform"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <canvas
              ref={previewCanvasRef}
              className="block max-w-[80vw] max-h-[70vh] object-contain"
            />
          </div>

          {/* Quick Stats Bar at bottom of stage */}
          <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span>
                আউটপুট: <strong>{outputWidth} × {outputHeight} px</strong>
              </span>
              <span>•</span>
              <span>
                ফাইল সাইজ: <strong className="text-emerald-600 dark:text-emerald-400">{formatBytes(liveFileSize)}</strong>
              </span>
              <span>•</span>
              <span>
                রেজুলেশন: <strong>{resolutionMode.toUpperCase()}</strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              মাউস দিয়ে ড্র্যাগ করে ফেস সেন্টারিং করুন • হুইল স্ক্রল করে জুম করুন
            </span>
          </div>
        </main>
      </div>

      {/* 10-in-1 Passport Sheet Generator Modal */}
      {showSheetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in photo-sheet-print-container">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden no-print">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-500 text-white">
                  <Grid className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    ১০-কপি পাসপোর্ট প্রিন্ট শিট জেনারেটর (স্টুডিও পেপার গ্রিড)
                  </h3>
                  <p className="text-xs text-slate-500">
                    স্ট্যান্ডার্ড 4R (4"×6") ফটো পেপার বা A4 পেপারে এক ক্লিকে পাসপোর্ট ছবি সাজিয়ে সরাসরি প্রিন্ট করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSheetModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="py-4 flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
              {/* Settings Column */}
              <div className="w-full md:w-80 space-y-4 text-xs overflow-y-auto pr-1">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                    শিট লেআউট ও সাইজ
                  </label>
                  <div className="space-y-1.5">
                    {SHEET_LAYOUTS.map((layout) => (
                      <button
                        key={layout.id}
                        onClick={() => setSelectedSheetLayout(layout.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                          selectedSheetLayout === layout.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{layout.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{layout.paper}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    কাটিং ও মার্জিন কন্ট্রোল
                  </span>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCutGuides}
                      onChange={(e) => setShowCutGuides(e.target.checked)}
                      className="rounded accent-emerald-600 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      কাটিং গাইডলাইন (ড্যাশ বর্ডার লাইন)
                    </span>
                  </label>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>ছবির মাঝের ফাঁকা স্পেস</span>
                      <span>{sheetSpacing} px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="40"
                      value={sheetSpacing}
                      onChange={(e) => setSheetSpacing(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>কাগজের বর্ডার মার্জিন</span>
                      <span>{sheetMargin} px</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="80"
                      value={sheetMargin}
                      onChange={(e) => setSheetMargin(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Sheet Visual Preview Stage */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                {isGeneratingSheet ? (
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-500">শিট প্রস্তুত হচ্ছে...</p>
                  </div>
                ) : sheetPreviewUrl ? (
                  <img
                    src={sheetPreviewUrl}
                    alt="Passport Sheet Preview"
                    className="max-h-[50vh] max-w-full rounded-lg shadow-xl border border-slate-300 object-contain photo-sheet-print-target"
                  />
                ) : null}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                প্রিন্ট করার সময় পেপার সাইজ <strong>4"×6" (4R)</strong> নির্বাচন করুন
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSheetModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  বন্ধ করুন
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `SebaDesk_Passport_Sheet_${selectedSheetLayout}_${Date.now()}.jpg`;
                    link.href = sheetPreviewUrl;
                    link.click();
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>শিট ইমেজ ডাউনলোড</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>সরাসরি প্রিন্ট দিন (Print Sheet)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Smart Photo Lab Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI স্মার্ট ফটো ও ফেস ল্যাব
                  </h3>
                  <p className="text-xs text-slate-500">
                    বাংলা বা ইংরেজিতে লিখুন আপনার ছবি ও ফেসকে ঠিক কেমন এডিট করতে চান
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Natural Language Prompt Input */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  আপনার কাস্টম এডিটিং নির্দেশ দিন:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiExecutePrompt()}
                    placeholder="যেমন: ব্যাকগ্রাউন্ড সাদা করো, ফেস উজ্জ্বল ও স্মুথ করো, ফর্মাল লুক দাও..."
                    className="w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={handleAiExecutePrompt}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-sm"
                  >
                    <span>প্রয়োগ করুন</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Execution Feedback Banner */}
              {aiExecutionStatus && (
                <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-300 font-medium">
                  {aiExecutionStatus}
                </div>
              )}

              {/* Quick AI Presets */}
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  ১-ক্লিক জনপ্রিয় এআই প্রিসেটসমূহ:
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {AI_QUICK_PRESETS.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => applyAiPreset(p)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/40 dark:hover:bg-violet-950/20 cursor-pointer transition-all flex items-start justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{p.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.summary}</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold text-[10px] whitespace-nowrap">
                        প্রয়োগ ➔
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white"
              >
                সম্পন্ন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
