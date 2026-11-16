import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PortalHub from './components/PortalHub';
import PhotoStudio from './components/PhotoStudio';
import DocEditor from './components/DocEditor';
import Vault, {
  VAULT_STORAGE_KEY,
  VAULT_INIT_KEY,
  loadInitialVaultItems,
} from './components/Vault';

const TAB_STORAGE_KEY = 'utilitydesk_active_tab';
const THEME_STORAGE_KEY = 'utilitydesk_theme';

const VALID_TABS = ['portal', 'photo', 'docs', 'vault'];

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      return VALID_TABS.includes(saved) ? saved : 'portal';
    } catch {
      return 'portal';
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback to light theme
    }
    return 'light';
  });

  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [vaultItems, setVaultItems] = useState(loadInitialVaultItems);
  const [incomingEditorDoc, setIncomingEditorDoc] = useState(null);

  // Persist theme & apply Tailwind dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage error
    }
  }, [theme]);

  // Persist active workspace tab
  useEffect(() => {
    try {
      localStorage.setItem(TAB_STORAGE_KEY, activeTab);
    } catch {
      // Ignore storage error
    }
  }, [activeTab]);

  // Sync Vault items to LocalStorage
  const handleVaultItemsChange = useCallback((nextItems) => {
    setVaultItems(nextItems);
    try {
      localStorage.setItem(VAULT_INIT_KEY, '1');
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(nextItems));
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  // Online / offline network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Desktop keyboard shortcuts: Alt+1 .. Alt+4
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === '1') {
        e.preventDefault();
        setActiveTab('portal');
      } else if (e.key === '2') {
        e.preventDefault();
        setActiveTab('photo');
      } else if (e.key === '3') {
        e.preventDefault();
        setActiveTab('docs');
      } else if (e.key === '4') {
        e.preventDefault();
        setActiveTab('vault');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSaveToVault = useCallback(
    ({ title, category = 'Template', content }) => {
      const entry = {
        id: `vault-${Date.now()}`,
        title,
        category,
        content,
        pinned: false,
        updatedAt: Date.now(),
      };
      handleVaultItemsChange([entry, ...vaultItems]);
    },
    [vaultItems, handleVaultItemsChange]
  );

  const handleOpenInEditor = useCallback((vaultItem) => {
    setIncomingEditorDoc({
      title: vaultItem.title,
      content: vaultItem.content,
      nonce: Date.now(),
    });
    setActiveTab('docs');
  }, []);

  const handleClearIncomingDoc = useCallback(() => {
    setIncomingEditorDoc(null);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 print-reset-layout">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isOnline={isOnline}
        vaultCount={vaultItems.length}
      />

      <main className="flex-1 h-full min-w-0 overflow-hidden relative print-reset-layout">
        <div
          className={`no-print h-full w-full ${
            activeTab === 'portal' ? 'block' : 'hidden'
          }`}
        >
          <PortalHub isOnline={isOnline} />
        </div>

        <div
          className={`no-print h-full w-full ${
            activeTab === 'photo' ? 'block' : 'hidden'
          }`}
        >
          <PhotoStudio />
        </div>

        <div
          className={`h-full w-full print-reset-layout ${
            activeTab === 'docs' ? 'block' : 'hidden no-print'
          }`}
        >
          <DocEditor
            incomingDocument={incomingEditorDoc}
            onClearIncomingDocument={handleClearIncomingDoc}
            onSaveToVault={handleSaveToVault}
          />
        </div>

        <div
          className={`no-print h-full w-full ${
            activeTab === 'vault' ? 'block' : 'hidden'
          }`}
        >
          <Vault
            items={vaultItems}
            onChangeItems={handleVaultItemsChange}
            onOpenInEditor={handleOpenInEditor}
          />
        </div>
      </main>
    </div>
  );
}

