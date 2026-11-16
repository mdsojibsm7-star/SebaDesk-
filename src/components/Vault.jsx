import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Archive,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  Pin,
  FileEdit,
  Send,
  Download,
  Upload,
  HardDrive,
  X,
  Tag,
} from 'lucide-react';

export const VAULT_STORAGE_KEY = 'utilitydesk_vault_items';
export const VAULT_INIT_KEY = 'utilitydesk_vault_initialized';

export const DEFAULT_VAULT_ITEMS = [
  {
    id: 'vault-1',
    title: 'Permanent & Present Address Block',
    category: 'Address & ID',
    pinned: true,
    content:
      'Present Address: House #14, Road #05, Sector #07, Uttara, Dhaka-1230\nPermanent Address: Village: Madhyapara, Post Office: Sadar, Upazila: Tangail Sadar, District: Tangail\nMobile: 017XXXXXXXX | Email: applicant@example.com',
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'vault-2',
    title: 'Govt Application Document Checklist',
    category: 'Snippet',
    pinned: true,
    content:
      'Required Documents Checklist:\n1. Recent Passport Size Photo (300×300 px, <100 KB, JPG)\n2. Scanned Signature (300×80 px, <60 KB, JPG)\n3. National ID (NID) Smart Card Copy\n4. SSC, HSC & Honours Certificates + Marksheets\n5. Union/Municipality Citizenship Certificate',
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'vault-3',
    title: 'Formal Email Cover Note',
    category: 'Email',
    pinned: false,
    content:
      'Dear Hiring Manager,\n\nPlease find attached my updated Curriculum Vitae and academic credentials for your review. I would appreciate the opportunity to discuss how my skills align with your team.\n\nBest regards,\n[Your Full Name]\n[Phone Number]',
    updatedAt: Date.now() - 3600000 * 8,
  },
  {
    id: 'vault-4',
    title: 'দাপ্তরিক আবেদন শিরোনাম (বাংলা)',
    category: 'Bengali',
    pinned: false,
    content:
      'বরাবর,\nমহাপরিচালক / প্রধান কর্মকর্তা\n[প্রতিষ্ঠানের নাম]\n[ঠিকানা]\n\nবিষয়: [আবেদনের বিষয় লিখুন]।\n\nজনাব,\nবিনীত নিবেদন এই যে, ...',
    updatedAt: Date.now() - 3600000 * 3,
  },
];

const CATEGORIES = ['All', 'Template', 'Address & ID', 'Snippet', 'Email', 'Bengali'];

export function loadInitialVaultItems() {
  try {
    const initialized = localStorage.getItem(VAULT_INIT_KEY);
    const saved = localStorage.getItem(VAULT_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    if (!initialized) {
      localStorage.setItem(VAULT_INIT_KEY, '1');
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(DEFAULT_VAULT_ITEMS));
      return DEFAULT_VAULT_ITEMS;
    }
  } catch {
    // Ignore storage errors
  }
  return [];
}

export default function Vault({
  items: controlledItems,
  onChangeItems,
  onOpenInEditor,
}) {
  const [localItems, setLocalItems] = useState(loadInitialVaultItems);
  const items = controlledItems ?? localItems;

  const setItems = (updater) => {
    const next = typeof updater === 'function' ? updater(items) : updater;
    if (onChangeItems) {
      onChangeItems(next);
    } else {
      setLocalItems(next);
      try {
        localStorage.setItem(VAULT_INIT_KEY, '1');
        localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore quota errors
      }
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(() => items[0]?.id || null);

  // Composer / Editor Form State
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    id: null,
    title: '',
    category: 'Snippet',
    content: '',
    pinned: false,
  });
  const [copiedId, setCopiedId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const importInputRef = useRef(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...items]
      .filter((item) => {
        const catMatch =
          selectedCategory === 'All' || item.category === selectedCategory;
        if (!catMatch) return false;
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) {
          return a.pinned ? -1 : 1;
        }
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      });
  }, [items, searchQuery, selectedCategory]);

  const activeItem = useMemo(
    () => items.find((i) => i.id === selectedId) || filteredItems[0] || null,
    [items, selectedId, filteredItems]
  );

  useEffect(() => {
    if (!selectedId && filteredItems.length > 0) {
      setSelectedId(filteredItems[0].id);
    }
  }, [selectedId, filteredItems]);

  const showToast = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const startNewSnippet = () => {
    setDraft({
      id: null,
      title: '',
      category: 'Snippet',
      content: '',
      pinned: false,
    });
    setIsEditing(true);
  };

  const startEditSnippet = (item) => {
    setDraft({
      id: item.id,
      title: item.title,
      category: item.category,
      content: item.content,
      pinned: Boolean(item.pinned),
    });
    setIsEditing(true);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;

    if (draft.id) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === draft.id
            ? {
                ...item,
                title: draft.title.trim(),
                category: draft.category,
                content: draft.content,
                pinned: draft.pinned,
                updatedAt: Date.now(),
              }
            : item
        )
      );
      setSelectedId(draft.id);
      showToast('Snippet updated in LocalStorage.');
    } else {
      const created = {
        id: `vault-${Date.now()}`,
        title: draft.title.trim(),
        category: draft.category,
        content: draft.content,
        pinned: draft.pinned,
        updatedAt: Date.now(),
      };
      setItems((prev) => [created, ...prev]);
      setSelectedId(created.id);
      showToast('New snippet saved offline.');
    }
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    if (draft.id === id) {
      setIsEditing(false);
    }
    showToast('Snippet deleted.');
  };

  const handleTogglePin = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback copy method
      const ta = document.createElement('textarea');
      ta.value = item.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handleExportBackup = () => {
    const payload = JSON.stringify(items, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sebadesk-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Vault backup exported.');
  };

  const handleImportBackup = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) {
          showToast('Invalid backup format.');
          return;
        }
        const valid = parsed
          .filter((x) => x && typeof x.title === 'string' && typeof x.content === 'string')
          .map((x, idx) => ({
            id: x.id || `imported-${Date.now()}-${idx}`,
            title: x.title,
            category: x.category || 'Snippet',
            content: x.content,
            pinned: Boolean(x.pinned),
            updatedAt: x.updatedAt || Date.now(),
          }));
        setItems((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const merged = [
            ...valid.filter((v) => !existingIds.has(v.id)),
            ...prev,
          ];
          return merged;
        });
        showToast(`Imported ${valid.length} snippet(s).`);
      } catch {
        showToast('Could not parse JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  const storageBytes = useMemo(
    () => new Blob([JSON.stringify(items)]).size,
    [items]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Header Bar */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Offline Vault
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-emerald-500" />
                {items.length} entries • {(storageBytes / 1024).toFixed(1)} KB in LocalStorage
              </span>
              {statusMessage && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold">
                  {statusMessage}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              handleImportBackup(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup JSON</span>
          </button>

          <button
            type="button"
            onClick={startNewSnippet}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Snippet</span>
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left List Pane */}
        <div className="w-full lg:w-96 shrink-0 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter saved snippets..."
                className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-indigo-600'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No snippets match your filter. Click <strong>New Snippet</strong> to save one offline.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = !isEditing && activeItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedId(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsEditing(false);
                        setSelectedId(item.id);
                      }
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-400 dark:border-indigo-500/60 shadow-sm'
                        : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {item.pinned && (
                            <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h3>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 shrink-0"
                        title="Copy snippet"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail / Editor Pane */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <form
              onSubmit={handleSaveDraft}
              className="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {draft.id ? 'Edit Saved Snippet' : 'Create Offline Snippet / Template'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, title: e.target.value }))
                    }
                    placeholder="e.g., Passport Address Block or Job Cover Template"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, category: e.target.value }))
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Snippet / Template Content
                </label>
                <textarea
                  rows={12}
                  required
                  value={draft.content}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, content: e.target.value }))
                  }
                  placeholder="Write or paste frequently used addresses, ID checklists, Bengali/English templates..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-sans leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.pinned}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, pinned: e.target.checked }))
                    }
                    className="rounded accent-indigo-600"
                  />
                  <span>Pin this snippet to top</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  >
                    Save to Local Vault
                  </button>
                </div>
              </div>
            </form>
          ) : activeItem ? (
            <div className="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                      <Tag className="w-3 h-3" />
                      {activeItem.category}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Updated {new Date(activeItem.updatedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                    {activeItem.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTogglePin(activeItem.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      activeItem.pinned
                        ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-amber-300'
                        : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:text-slate-800'
                    }`}
                    title={activeItem.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className={`w-4 h-4 ${activeItem.pinned ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => startEditSnippet(activeItem)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(activeItem)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  >
                    {copiedId === activeItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  {onOpenInEditor && (
                    <button
                      type="button"
                      onClick={() => onOpenInEditor(activeItem)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Open in Doc Editor</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(activeItem.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    title="Delete snippet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200/70 dark:border-slate-800">
                  {activeItem.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                <Archive className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Your Offline Vault is Empty
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Save frequently used addresses, IDs, cover letters, and Bengali/English templates locally in your browser storage.
              </p>
              <button
                type="button"
                onClick={startNewSnippet}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Snippet</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

