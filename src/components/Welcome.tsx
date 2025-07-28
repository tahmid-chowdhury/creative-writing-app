import { useState } from 'react';

const examplePrompts = [
  'Help me brainstorm a fantasy plot about a lost city.',
  'Suggest a unique character flaw for my protagonist.',
  'Give me a writing exercise to overcome writer’s block.',
  'How can I make my dialogue more realistic?',
  'Help me develop a villain with depth and motivation.',
  'Suggest a twist ending for a mystery story.',
];

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

export default function Welcome({ onStart }: { onStart: () => void }) {
  const [favourites, setFavourites] = useState<string[]>(getFavourites());

  const addFavourite = (prompt: string) => {
    if (!prompt.trim() || favourites.includes(prompt)) return;
    const updated = [prompt, ...favourites];
    setFavourites(updated);
    saveFavourites(updated);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: '40px auto',
        padding: '2.5em 2em',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        color: '#fff',
        textAlign: 'left',
        animation: 'fadeIn 1s',
      }}
    >
      <h2 style={{ fontWeight: 700, fontSize: '2em', marginBottom: 8, background: 'linear-gradient(90deg,#a1c4fd,#c2e9fb)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
        Welcome to the Creative Writing Assistant
      </h2>
      <p style={{ fontSize: '1.1em', marginBottom: 24 }}>
        Your AI-powered writing coach for brainstorming, character development, overcoming writer’s block, and refining your craft. Get inspired and make your stories shine!
      </p>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Try an example prompt:</div>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {examplePrompts.map((prompt, i) => (
            <li key={i} style={{ marginBottom: 6, fontSize: '1em', opacity: 0.92, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{prompt}</span>
              <button
                onClick={() => addFavourite(prompt)}
                title={favourites.includes(prompt) ? 'Already in favourites' : 'Add to favourites'}
                disabled={favourites.includes(prompt)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: favourites.includes(prompt) ? '#facc15' : '#a1c4fd',
                  fontSize: 18,
                  cursor: favourites.includes(prompt) ? 'not-allowed' : 'pointer',
                  marginLeft: 2,
                  transition: 'color 0.2s',
                }}
              >
                ★
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onStart}
        style={{
          background: 'linear-gradient(90deg,#a1c4fd,#c2e9fb)',
          color: '#213547',
          fontWeight: 700,
          fontSize: '1.1em',
          border: 'none',
          borderRadius: 12,
          padding: '0.8em 2em',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(161,196,253,0.18)',
          transition: 'transform 0.1s',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Start Chatting
      </button>
    </div>
  );
}
