import { useState, useEffect } from 'react'
import './App.css'
import ApiKeyManager from './components/ApiKeyManager'
import Welcome from './components/Welcome'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'

function SettingsModal({ open, onClose, theme, setTheme, mode, setMode }: {
  open: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (t: string) => void;
  mode: string;
  setMode: (m: string) => void;
}) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.35)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#23243a', color: '#fff', borderRadius: 16, padding: 32, minWidth: 320, minHeight: 180, boxShadow: '0 8px 32px #0006', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#f87171', fontSize: 22, cursor: 'pointer' }}>✕</button>
        <h2 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Settings</h2>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Theme</div>
          <select value={theme} onChange={e => setTheme(e.target.value)} style={{ borderRadius: 8, padding: '0.4em 1em', fontSize: 15 }}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Interface Mode</div>
          <select value={mode} onChange={e => setMode(e.target.value)} style={{ borderRadius: 8, padding: '0.4em 1em', fontSize: 15 }}>
            <option value="cozy">Cozy</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('cwaHasStarted') !== 'true';
  });
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [model, setModel] = useState('openai/gpt-4o');
  const [genre, setGenre] = useState('general');
  const [sidebarPrompt, setSidebarPrompt] = useState<string | null>(null);
  const [restoredMessages, setRestoredMessages] = useState<any[] | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setThemeState] = useState(() => localStorage.getItem('cwaTheme') || 'system');
  const [mode, setModeState] = useState(() => localStorage.getItem('cwaMode') || 'cozy');

  useEffect(() => {
    localStorage.setItem('cwaTheme', theme);
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);
  useEffect(() => {
    localStorage.setItem('cwaMode', mode);
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  if (showWelcome) {
    return (
      <Welcome onStart={() => {
        setShowWelcome(false);
        localStorage.setItem('cwaHasStarted', 'true');
      }} />
    );
  }
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        onPromptSelect={prompt => setSidebarPrompt(prompt)}
        onSessionSelect={msgs => setRestoredMessages(msgs)}
      />
      <main style={{ flex: 1, marginLeft: 260, minHeight: '100vh', background: 'none' }}>
        {/* Chat header with settings button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '1.2em 2em 0.5em 0', minHeight: 40 }}>
          <button onClick={() => setSettingsOpen(true)} title="Settings" style={{ background: 'none', border: 'none', color: '#a1c4fd', fontSize: 24, cursor: 'pointer', padding: 4 }}>
            <span role="img" aria-label="settings">⚙️</span>
          </button>
        </div>
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} setTheme={setThemeState} mode={mode} setMode={setModeState} />
        <div style={{ marginBottom: 32 }}>
          <ApiKeyManager
            onApiKeySet={setApiKey}
            onModelChange={setModel}
            selectedModel={model}
            onGenreChange={setGenre}
            selectedGenre={genre}
          />
        </div>
        {apiKey ? (
          <Chat
            apiKey={apiKey}
            model={model}
            genre={genre}
            sidebarPrompt={sidebarPrompt}
            onPromptUsed={() => setSidebarPrompt(null)}
            initialMessages={restoredMessages}
            onSessionLoaded={() => setRestoredMessages(null)}
          />
        ) : (
          <div style={{ color: '#f87171', marginTop: 40, fontSize: 18 }}>
            Please enter your API key to start chatting.
          </div>
        )}
      </main>
    </div>
  )
}

export default App
