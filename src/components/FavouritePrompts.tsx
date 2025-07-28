import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'favouritePrompts';

function getFavourites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavourites(favs: string[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favs));
}

export default function FavouritePrompts({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState('');

  useEffect(() => {
    setFavourites(getFavourites());
  }, []);

  const addFavourite = (prompt: string) => {
    if (!prompt.trim() || favourites.includes(prompt)) return;
    const updated = [prompt, ...favourites];
    setFavourites(updated);
    saveFavourites(updated);
  };

  const removeFavourite = (prompt: string) => {
    const updated = favourites.filter(f => f !== prompt);
    setFavourites(updated);
    saveFavourites(updated);
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#a1c4fd' }}>Favourite Prompts</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input
          type="text"
          value={newPrompt}
          onChange={e => setNewPrompt(e.target.value)}
          placeholder="Add a new favourite prompt..."
          style={{ flex: 1, borderRadius: 8, border: '1px solid #888', padding: '0.4em 0.7em', fontSize: 14 }}
        />
        <button
          onClick={() => { addFavourite(newPrompt); setNewPrompt(''); }}
          disabled={!newPrompt.trim()}
          style={{ borderRadius: 8, background: '#646cff', color: '#fff', border: 'none', padding: '0.4em 1em', fontWeight: 600 }}
        >
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {favourites.length === 0 && <li style={{ color: '#aaa', fontSize: 14 }}>No favourites yet.</li>}
        {favourites.map((prompt, i) => (
          <li key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => onPromptSelect(prompt)}
              style={{
                background: 'rgba(161,196,253,0.13)',
                color: '#a1c4fd',
                border: 'none',
                borderRadius: 8,
                padding: '0.4em 0.8em',
                fontSize: 14,
                cursor: 'pointer',
                flex: 1,
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              title="Insert this prompt into chat"
            >
              {prompt}
            </button>
            <button
              onClick={() => removeFavourite(prompt)}
              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 16, cursor: 'pointer', padding: 2 }}
              title="Remove from favourites"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
