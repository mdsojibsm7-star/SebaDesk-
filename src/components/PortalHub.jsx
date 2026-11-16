import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  Landmark,
  CreditCard,
  BookOpen,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ExternalLink,
  Home,
  Star,
  Plus,
  X,
  Lock,
  ShieldCheck,
  WifiOff,
  Trash2,
  Compass,
  Eye,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Govt Services',
  'NID',
  'Passport',
  'Jobs',
  'Education',
];

const DEFAULT_PORTALS = [
  {
    id: 'mygov-bd',
    title: 'MyGov Citizen Services',
    category: 'Govt Services',
    url: 'https://www.mygov.bd',
    description: 'Single-window digital platform for government certificates and citizen applications.',
    tags: ['mygov', 'services', 'certificate'],
    embeddable: true,
  },
  {
    id: 'eksheba-bd',
    title: 'EkSheba Citizen Portal',
    category: 'Govt Services',
    url: 'https://eksheba.gov.bd',
    description: 'Unified government service delivery and Union Digital Center portal.',
    tags: ['eksheba', 'udc', 'services'],
    embeddable: true,
  },
  {
    id: 'land-portal',
    title: 'Smart Land Services',
    category: 'Govt Services',
    url: 'https://land.gov.bd',
    description: 'E-mutation, khatian lookup, and online land development tax portal.',
    tags: ['land', 'khatian', 'mutation', 'tax'],
    embeddable: true,
  },
  {
    id: 'police-clearance',
    title: 'Online Police Clearance',
    category: 'Govt Services',
    url: 'https://pcc.police.gov.bd',
    description: 'Apply and track police clearance certificates for travel or employment.',
    tags: ['police', 'clearance', 'pcc'],
    embeddable: true,
  },
  {
    id: 'brta-bsp',
    title: 'BRTA Service Portal (BSP)',
    category: 'Govt Services',
    url: 'https://bsp.brta.gov.bd',
    description: 'Driving license, learner card, and vehicle registration online portal.',
    tags: ['brta', 'license', 'driving', 'vehicle'],
    embeddable: true,
  },
  {
    id: 'bd-national-portal',
    title: 'Bangladesh National Portal',
    category: 'Govt Services',
    url: 'https://bangladesh.gov.bd',
    description: 'Central directory of all ministries, districts, e-services, and public forms.',
    tags: ['bangladesh', 'govt', 'portal', 'forms'],
    embeddable: false,
  },
  {
    id: 'bdris-birth',
    title: 'Birth & Death Registration (BDRIS)',
    category: 'Govt Services',
    url: 'https://bdris.gov.bd/br/application',
    description: 'Online birth registration application, correction, and verification portal.',
    tags: ['birth', 'death', 'bdris', 'certificate'],
    embeddable: false,
  },
  {
    id: 'nbr-etax',
    title: 'e-Return & Income Tax (NBR)',
    category: 'Govt Services',
    url: 'https://etaxnbr.gov.bd',
    description: 'Official NBR online income tax return filing and e-TIN portal.',
    tags: ['tin', 'tax', 'nbr', 'return'],
    embeddable: false,
  },
  {
    id: 'nid-services',
    title: 'NID Services Wing (Smart Card)',
    category: 'NID',
    url: 'https://services.nidw.gov.bd/nid-pub/',
    description: 'National ID card registration, correction, re-issue, and online download.',
    tags: ['nid', 'voter', 'smart card', 'correction'],
    embeddable: false,
  },
  {
    id: 'ecs-portal',
    title: 'Election Commission Secretariat',
    category: 'NID',
    url: 'https://ecs.gov.bd',
    description: 'Official voter list notices, election updates, and NID circulars.',
    tags: ['ecs', 'election', 'nid', 'voter'],
    embeddable: false,
  },
  {
    id: 'epassport-portal',
    title: 'e-Passport Online Portal',
    category: 'Passport',
    url: 'https://www.epassport.gov.bd',
    description: 'Apply for a new e-Passport, book biometric slots, and view fee structure.',
    tags: ['passport', 'epassport', 'biometric', 'travel'],
    embeddable: false,
  },
  {
    id: 'epassport-status',
    title: 'e-Passport Status Check',
    category: 'Passport',
    url: 'https://www.epassport.gov.bd/authorization/application-status',
    description: 'Track passport printing, police verification, and delivery progress.',
    tags: ['passport', 'status', 'track'],
    embeddable: false,
  },
  {
    id: 'teletalk-alljobs',
    title: 'All Jobs (Teletalk)',
    category: 'Jobs',
    url: 'https://alljobs.teletalk.com.bd',
    description: 'Central government job application portal, admit cards, and fee payment.',
    tags: ['jobs', 'teletalk', 'govt', 'admit card'],
    embeddable: true,
  },
  {
    id: 'bdjobs-portal',
    title: 'Bdjobs Career Hub',
    category: 'Jobs',
    url: 'https://www.bdjobs.com',
    description: 'Private sector, NGO, banking, and corporate job listings across Bangladesh.',
    tags: ['bdjobs', 'private', 'career', 'cv'],
    embeddable: true,
  },
  {
    id: 'bpsc-portal',
    title: 'BPSC (BCS & Cadre Exams)',
    category: 'Jobs',
    url: 'https://bpsc.gov.bd',
    description: 'Bangladesh Public Service Commission circulars, BCS notices, and results.',
    tags: ['bcs', 'bpsc', 'cadre', 'exam'],
    embeddable: false,
  },
  {
    id: 'muktopaath',
    title: 'Muktopaath e-Learning',
    category: 'Education',
    url: 'https://muktopaath.gov.bd',
    description: 'Free government-certified online courses and vocational training.',
    tags: ['course', 'training', 'certificate', 'learning'],
    embeddable: true,
  },
  {
    id: 'eboard-results',
    title: 'Education Board Results',
    category: 'Education',
    url: 'https://eboardresults.com/v2/home',
    description: 'SSC, HSC, Dakhil, and Alim exam results with full marksheet lookup.',
    tags: ['ssc', 'hsc', 'result', 'board', 'marksheet'],
    embeddable: false,
  },
  {
    id: 'nu-portal',
    title: 'National University (NU)',
    category: 'Education',
    url: 'https://www.nu.ac.bd',
    description: 'Admission circulars, honours/degree form fill-up, and academic notices.',
    tags: ['nu', 'university', 'admission', 'degree'],
    embeddable: false,
  },
  {
    id: 'shed-portal',
    title: 'Secondary & Higher Edu (SHED)',
    category: 'Education',
    url: 'https://shed.gov.bd',
    description: 'Ministry of Education circulars, scholarships, and academic notifications.',
    tags: ['shed', 'moedu', 'scholarship', 'education'],
    embeddable: false,
  },
];

const CUSTOM_PORTALS_KEY = 'utilitydesk_custom_portals';
const FAVORITE_PORTALS_KEY = 'utilitydesk_favorite_portals';

const CATEGORY_META = {
  'Govt Services': {
    icon: Landmark,
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
    iconBg: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-300',
  },
  NID: {
    icon: CreditCard,
    badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30',
    iconBg: 'bg-gradient-to-br from-sky-500/15 to-blue-500/15 text-sky-600 dark:text-sky-300',
  },
  Passport: {
    icon: BookOpen,
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30',
    iconBg: 'bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-300',
  },
  Jobs: {
    icon: Briefcase,
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
    iconBg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-300',
  },
  Education: {
    icon: GraduationCap,
    badge: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30',
    iconBg: 'bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-violet-600 dark:text-violet-300',
  },
};

function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function PortalHub({ isOnline = true }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [customPortals, setCustomPortals] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PORTALS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITE_PORTALS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Embedded webview / iframe browser state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [addressInput, setAddressInput] = useState('');
  const [reloadNonce, setReloadNonce] = useState(0);
  const [isFrameLoading, setIsFrameLoading] = useState(false);
  const [forceEmbed, setForceEmbed] = useState(false);

  // Add Portal Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPortal, setNewPortal] = useState({
    title: '',
    category: 'Govt Services',
    url: '',
    description: '',
  });
  const [formError, setFormError] = useState('');

  const iframeRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PORTALS_KEY, JSON.stringify(customPortals));
    } catch {
      // Ignore storage quota issues
    }
  }, [customPortals]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_PORTALS_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage quota issues
    }
  }, [favorites]);

  const allPortals = useMemo(
    () => [...customPortals, ...DEFAULT_PORTALS],
    [customPortals]
  );

  const filteredPortals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPortals.filter((portal) => {
      const matchesCat =
        selectedCategory === 'All' || portal.category === selectedCategory;
      const matchesFav = !onlyFavorites || favorites.includes(portal.id);
      if (!matchesCat || !matchesFav) return false;
      if (!q) return true;
      return (
        portal.title.toLowerCase().includes(q) ||
        portal.description.toLowerCase().includes(q) ||
        portal.category.toLowerCase().includes(q) ||
        portal.url.toLowerCase().includes(q) ||
        (portal.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [allPortals, searchQuery, selectedCategory, onlyFavorites, favorites]);

  const activeEntry = historyIndex >= 0 ? history[historyIndex] : null;
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  useEffect(() => {
    if (activeEntry) {
      setAddressInput(activeEntry.url);
    }
  }, [activeEntry]);

  const openInViewer = (portal) => {
    const entry = {
      id: portal.id || `url-${Date.now()}`,
      title: portal.title || portal.url,
      url: normalizeUrl(portal.url),
      category: portal.category || 'Custom',
      description: portal.description || '',
      embeddable: portal.embeddable !== false,
    };
    const nextHistory = history.slice(0, historyIndex + 1);
    const current = nextHistory[nextHistory.length - 1];
    if (!current || current.url !== entry.url) {
      nextHistory.push(entry);
    }
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setAddressInput(entry.url);
    setForceEmbed(false);
    setIsFrameLoading(entry.embeddable);
    setIsViewerOpen(true);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    try {
      if (iframeRef.current?.contentWindow?.history?.length > 1) {
        iframeRef.current.contentWindow.history.back();
      }
    } catch {
      // Cross-origin frame access restricted
    }
    setForceEmbed(false);
    setHistoryIndex((idx) => Math.max(0, idx - 1));
    setIsFrameLoading(true);
    setReloadNonce((n) => n + 1);
  };

  const handleForward = () => {
    if (!canGoForward) return;
    setForceEmbed(false);
    setHistoryIndex((idx) => Math.min(history.length - 1, idx + 1));
    setIsFrameLoading(true);
    setReloadNonce((n) => n + 1);
  };

  const handleReload = () => {
    if (!activeEntry) return;
    setIsFrameLoading(true);
    setReloadNonce((n) => n + 1);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const url = normalizeUrl(addressInput);
    if (!url) return;
    openInViewer({
      id: `nav-${Date.now()}`,
      title: url.replace(/^https?:\/\//, ''),
      url,
      category: 'Browser',
      embeddable: true,
    });
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddPortal = (e) => {
    e.preventDefault();
    const normalized = normalizeUrl(newPortal.url);
    if (!newPortal.title.trim() || !normalized) {
      setFormError('Please provide both a portal name and a valid URL.');
      return;
    }
    const created = {
      id: `custom-${Date.now()}`,
      title: newPortal.title.trim(),
      category: newPortal.category,
      url: normalized,
      description:
        newPortal.description.trim() || 'User-saved custom portal shortcut.',
      tags: ['custom', newPortal.category.toLowerCase()],
      isCustom: true,
      embeddable: true,
    };
    setCustomPortals((prev) => [created, ...prev]);
    setNewPortal({
      title: '',
      category: 'Govt Services',
      url: '',
      description: '',
    });
    setFormError('');
    setShowAddModal(false);
  };

  const handleDeleteCustom = (e, id) => {
    e.stopPropagation();
    setCustomPortals((prev) => prev.filter((p) => p.id !== id));
    setFavorites((prev) => prev.filter((fid) => fid !== id));
  };

  // Embedded Webview / Iframe Window
  if (isViewerOpen && activeEntry) {
    const shouldRenderIframe = activeEntry.embeddable || forceEmbed;

    return (
      <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-950">
        {/* Browser Navigation Bar */}
        <div className="px-4 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2.5 shadow-sm">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Return to Portal Grid"
            >
              <Home className="w-3.5 h-3.5" />
              <span>All Portals</span>
            </button>

            <button
              type="button"
              onClick={handleBack}
              disabled={!canGoBack}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none transition-colors"
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleForward}
              disabled={!canGoForward}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none transition-colors"
              title="Forward"
              aria-label="Forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReload}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reload"
              aria-label="Reload"
            >
              <RotateCw
                className={`w-4 h-4 ${
                  isFrameLoading && shouldRenderIframe ? 'animate-spin text-indigo-600' : ''
                }`}
              />
            </button>
          </div>

          {/* Address Bar */}
          <form onSubmit={handleAddressSubmit} className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500 transition-all">
              <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
                placeholder="Enter URL..."
                aria-label="Portal URL"
              />
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 shrink-0">
                {activeEntry.category}
              </span>
            </div>
          </form>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-2">
            {!activeEntry.embeddable && (
              <button
                type="button"
                onClick={() => {
                  setForceEmbed((v) => !v);
                  setIsFrameLoading(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{forceEmbed ? 'Safe Card' : 'Try Frame'}</span>
              </button>
            )}
            <a
              href={activeEntry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Live Tab</span>
            </a>
          </div>
        </div>

        {/* Frame Body */}
        <div className="relative flex-1 bg-white dark:bg-slate-900 overflow-hidden">
          {!isOnline ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <WifiOff className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                You are currently offline
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1.5">
                Live portals require internet access. Photo Studio, Document Studio, and Vault continue working 100% offline.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={handleReload}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Retry Connection
                </button>
                <button
                  type="button"
                  onClick={() => setIsViewerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Back to Portal Hub
                </button>
              </div>
            </div>
          ) : !shouldRenderIframe ? (
            /* Clean Smart Launcher Card for X-Frame-Options / WAF Protected Govt Sites */
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
              <div className="max-w-lg w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/25">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 mb-3">
                  {activeEntry.category} • Security-Protected Portal
                </span>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {activeEntry.title}
                </h3>

                <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1 break-all">
                  {activeEntry.url}
                </p>

                {activeEntry.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {activeEntry.description}
                  </p>
                )}

                <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 text-left leading-relaxed">
                  This official server enforces browser security headers (<code className="font-mono text-indigo-600 dark:text-indigo-400">X-Frame-Options</code> / Cloudflare protection) that prevent embedding inside a sub-frame. Launch it directly in a secure browser tab for full login, OTP, and form upload support.
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <a
                    href={activeEntry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Official Portal</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setForceEmbed(true);
                      setIsFrameLoading(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Try Embedded Frame</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isFrameLoading && (
                <div className="absolute inset-x-0 top-0 h-1 bg-indigo-100 dark:bg-indigo-950 overflow-hidden z-10">
                  <div className="h-full w-1/3 bg-indigo-600 animate-pulse rounded-r-full" />
                </div>
              )}
              <iframe
                ref={iframeRef}
                key={`${activeEntry.url}-${reloadNonce}`}
                src={activeEntry.url}
                title={activeEntry.title}
                onLoad={() => setIsFrameLoading(false)}
                className="w-full h-full border-0 bg-white"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </>
          )}
        </div>
      </div>
    );
  }

  // Portal Hub Grid View
  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/70 dark:bg-slate-950">
      {/* Header & Search Controls */}
      <div className="px-6 py-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Portal Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified gateway for Govt Services, NID, Passport, Jobs & Education
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search portals, NID, passport, jobs..."
                className="w-full pl-10 pr-8 py-2 rounded-xl text-sm bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOnlyFavorites((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                onlyFavorites
                  ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : ''}`}
              />
              <span>Starred</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portal</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            const count =
              category === 'All'
                ? allPortals.length
                : allPortals.filter((p) => p.category === category).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredPortals.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <Globe className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching portals found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try clearing your search filter or add a custom portal URL.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPortals.map((portal) => {
              const meta = CATEGORY_META[portal.category] || {
                icon: Globe,
                badge:
                  'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                iconBg:
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
              };
              const CatIcon = meta.icon;
              const isFav = favorites.includes(portal.id);

              return (
                <div
                  key={portal.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openInViewer(portal)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openInViewer(portal);
                    }
                  }}
                  className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-150 cursor-pointer text-left p-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl shrink-0 ${meta.iconBg}`}>
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${meta.badge}`}
                            >
                              {portal.category}
                            </span>
                            {portal.embeddable !== false ? (
                              <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                In-App Frame
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Secure Launch
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {portal.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(e, portal.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title={isFav ? 'Remove bookmark' : 'Bookmark portal'}
                          aria-label="Toggle favorite"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isFav ? 'fill-amber-400 text-amber-500' : ''
                            }`}
                          />
                        </button>
                        {portal.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustom(e, portal.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            title="Delete custom portal"
                            aria-label="Delete portal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                      {portal.url.replace(/^https?:\/\//, '')}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                        title="Open directly in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Portal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Custom Portal
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setFormError('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPortal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portal Name
                </label>
                <input
                  type="text"
                  value={newPortal.title}
                  onChange={(e) =>
                    setNewPortal((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g., District E-Services"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newPortal.category}
                  onChange={(e) =>
                    setNewPortal((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portal URL
                </label>
                <input
                  type="text"
                  value={newPortal.url}
                  onChange={(e) =>
                    setNewPortal((p) => ({ ...p, url: e.target.value }))
                  }
                  placeholder="https://example.gov.bd"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newPortal.description}
                  onChange={(e) =>
                    setNewPortal((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Optional notes for this portal..."
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save Offline Shortcut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
