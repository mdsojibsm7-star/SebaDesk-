import React, { useState } from 'react';
import {
  Globe,
  Image as ImageIcon,
  FileText,
  Archive,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    id: 'portal',
    label: 'Portal Hub',
    subtitle: 'Govt, NID & Jobs',
    icon: Globe,
    shortcut: 'Alt+1',
  },
  {
    id: 'photo',
    label: 'Photo Studio',
    subtitle: 'Crop, BG & Enhance',
    icon: ImageIcon,
    shortcut: 'Alt+2',
  },
  {
    id: 'docs',
    label: 'Doc Studio',
    subtitle: 'Multi-Page & Print',
    icon: FileText,
    shortcut: 'Alt+3',
  },
  {
    id: 'vault',
    label: 'Vault',
    subtitle: 'Offline Snippets',
    icon: Archive,
    shortcut: 'Alt+4',
  },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  isOnline = true,
  vaultCount = 0,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const isDark = theme === 'dark';

  return (
    <aside
      className={`no-print shrink-0 h-screen flex flex-col justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 select-none transition-all duration-200 ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
      aria-label="Primary Navigation"
    >
      {/* Top Brand & Collapse Toggle */}
      <div>
        <div className="px-3.5 py-4 border-b border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? 'mx-auto' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  SebaDesk
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  সেবাডেস্ক স্টুডিও
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <div className="flex justify-center pt-2.5">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="px-2.5 py-4">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Workspace
            </p>
          )}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? `${item.label} (${item.shortcut})` : undefined}
                  className={`group relative w-full flex items-center ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'
                  } rounded-xl text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {!collapsed && (
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight truncate">
                          {item.label}
                        </div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isActive
                              ? 'text-indigo-100'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    )}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.id === 'vault' && vaultCount > 0 && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {vaultCount}
                        </span>
                      )}
                      <span
                        className={`hidden xl:inline-block text-[10px] font-mono ${
                          isActive ? 'text-indigo-100/80' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {item.shortcut}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Controls & Status */}
      <div className="p-2.5 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2">
        <div
          className={`flex items-center ${
            collapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
          } rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50`}
          title={isOnline ? 'Online Mode' : 'Offline Mode'}
        >
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            {!collapsed && (
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {isOnline ? 'Online Ready' : 'Offline Mode'}
              </span>
            )}
          </div>
          {!collapsed && (
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
          } rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors`}
        >
          <div className="flex items-center gap-2.5">
            {isDark ? (
              <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            {!collapsed && (
              <span className="text-xs font-semibold">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            )}
          </div>

          {!collapsed && (
            <div
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${
                isDark ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform ${
                  isDark ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
