import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ApiKeyManager from './components/ApiKeyManager'
import Welcome from './components/Welcome'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'

function App() {
  const [count, setCount] = useState(0)
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('cwaHasStarted') !== 'true';
  });
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [model, setModel] = useState('openai/gpt-4o');
  const [genre, setGenre] = useState('general');
  const [sidebarPrompt, setSidebarPrompt] = useState<string | null>(null);
  const [restoredMessages, setRestoredMessages] = useState<any[] | null>(null);

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
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </main>
    </div>
  )
}

export default App
