import { useRef, useEffect, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const SYSTEM_PROMPT = `You are a creative writing coach and brainstorming partner. Help writers with story ideas, character development, overcoming writer's block, and refining their craft. Be encouraging, insightful, and creative.`;

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

export default function Chat({ apiKey, model, genre, sidebarPrompt, onPromptUsed, initialMessages, onSessionLoaded }: {
  apiKey: string,
  model: string,
  genre: string,
  sidebarPrompt?: string | null,
  onPromptUsed?: () => void,
  initialMessages?: any[] | null,
  onSessionLoaded?: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favourites, setFavourites] = useState<string[]>(getFavourites());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (sidebarPrompt) {
      setInput(sidebarPrompt);
      if (onPromptUsed) onPromptUsed();
    }
  }, [sidebarPrompt, onPromptUsed]);

  useEffect(() => {
    if (initialMessages && Array.isArray(initialMessages)) {
      setMessages(initialMessages);
      if (onSessionLoaded) onSessionLoaded();
    }
  }, [initialMessages, onSessionLoaded]);

  // Genre-aware system prompt
  const getSystemPrompt = () => {
    if (genre && genre !== 'general') {
      return `You are a creative writing coach and brainstorming partner. Specialize your advice for the ${genre} genre. Help writers with story ideas, character development, overcoming writer's block, and refining their craft. Be encouraging, insightful, and creative.`;
    }
    return SYSTEM_PROMPT;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setError(null);
    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...[...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
          ],
          max_tokens: 512,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const aiMsg: Message = {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'No response from model.',
        timestamp: Date.now(),
      };
      setMessages(msgs => [...msgs, aiMsg]);
    } catch (e: any) {
      setError(e.message || 'Failed to get response from OpenRouter.');
      setMessages(msgs => [...msgs, {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: 'Sorry, there was an error contacting the AI. Please check your API key and model.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Session history logic
  const SESSION_HISTORY_KEY = 'sessionHistory';
  function getSessions() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  }
  function saveSession(messages: any[]) {
    if (!messages || messages.length === 0) return;
    const sessions = getSessions();
    const newSession = { id: Math.random().toString(36).slice(2), messages, created: Date.now() };
    localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify([newSession, ...sessions]));
  }

  const handleClear = () => {
    if (messages.length > 0) saveSession(messages);
    setMessages([]);
  };
  const handleExport = (type: 'txt' | 'json') => {
    if (messages.length === 0) return;
    saveSession(messages);
    let content = '';
    let filename = 'conversation.' + type;
    if (type === 'json') {
      content = JSON.stringify(messages, null, 2);
    } else {
      content = messages.map(m => {
        const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `[${time}] ${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`;
      }).join('\n\n');
    }
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const addFavourite = (prompt: string) => {
    if (!prompt.trim() || favourites.includes(prompt)) return;
    const updated = [prompt, ...favourites];
    setFavourites(updated);
    saveFavourites(updated);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: '2em 1.5em 1em 1.5em',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.13)',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        color: '#fff',
        position: 'relative',
        minHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.7s',
      }}
    >
      {/* Genre badge/header */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg,#a1c4fd,#c2e9fb)',
          color: '#213547',
          borderRadius: 8,
          padding: '0.3em 1em',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: 1,
          marginBottom: 2,
        }}>
          Genre: {genre.charAt(0).toUpperCase() + genre.slice(1)}
        </span>
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: 16,
        paddingRight: 4,
        scrollbarWidth: 'thin',
      }}>
        {messages.length === 0 && (
          <div style={{ opacity: 0.7, textAlign: 'center', marginTop: 60, fontSize: 18 }}>
            Start a conversation with your creative writing coach!
          </div>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              marginBottom: 12,
              gap: 8,
            }}
          >
            <div
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(90deg,#a1c4fd,#c2e9fb)'
                  : 'rgba(255,255,255,0.18)',
                color: msg.role === 'user' ? '#213547' : '#fff',
                borderRadius: 16,
                padding: '0.7em 1.1em',
                maxWidth: 340,
                fontSize: 16,
                boxShadow: msg.role === 'user' ? '0 2px 8px #a1c4fd33' : '0 2px 8px #0002',
                position: 'relative',
                transition: 'background 0.2s',
                wordBreak: 'break-word',
                borderTopRightRadius: msg.role === 'user' ? 4 : 16,
                borderTopLeftRadius: msg.role === 'assistant' ? 4 : 16,
                animation: 'popIn 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ flex: 1 }}>{msg.content}</span>
              {msg.role === 'user' && (
                <button
                  onClick={() => addFavourite(msg.content)}
                  title={favourites.includes(msg.content) ? 'Already in favourites' : 'Add to favourites'}
                  disabled={favourites.includes(msg.content)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: favourites.includes(msg.content) ? '#facc15' : '#a1c4fd',
                    fontSize: 18,
                    cursor: favourites.includes(msg.content) ? 'not-allowed' : 'pointer',
                    marginLeft: 2,
                    transition: 'color 0.2s',
                  }}
                >
                  ★
                </button>
              )}
              <span style={{
                display: 'block',
                fontSize: 12,
                opacity: 0.6,
                marginTop: 4,
                textAlign: msg.role === 'user' ? 'right' : 'left',
              }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              background: 'rgba(255,255,255,0.18)',
              color: '#fff',
              borderRadius: 16,
              padding: '0.7em 1.1em',
              maxWidth: 340,
              fontSize: 16,
              boxShadow: '0 2px 8px #0002',
              position: 'relative',
              animation: 'popIn 0.3s',
            }}>
              <span className="typing-indicator">
                <span style={{ animation: 'blink 1s infinite' }}>●</span>
                <span style={{ animation: 'blink 1s 0.2s infinite' }}>●</span>
                <span style={{ animation: 'blink 1s 0.4s infinite' }}>●</span>
              </span>
            </div>
          </div>
        )}
        {error && (
          <div style={{ color: '#f87171', marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '0.7em 1em',
            borderRadius: 12,
            border: '1px solid #a1c4fd',
            fontSize: 16,
            background: 'rgba(255,255,255,0.18)',
            color: '#fff',
            outline: 'none',
            transition: 'border 0.2s',
          }}
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          style={{
            background: 'linear-gradient(90deg,#a1c4fd,#c2e9fb)',
            color: '#213547',
            fontWeight: 700,
            fontSize: '1.1em',
            border: 'none',
            borderRadius: 12,
            padding: '0.7em 1.5em',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(161,196,253,0.18)',
            transition: 'transform 0.1s',
          }}
        >
          Send
        </button>
        <button
          type="button"
          onClick={handleClear}
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '0.7em 1.1em',
            marginLeft: 4,
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          Clear
        </button>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => handleExport('txt')}
            style={{
              background: 'rgba(161,196,253,0.18)',
              color: '#a1c4fd',
              border: 'none',
              borderRadius: 12,
              padding: '0.7em 1.1em',
              marginLeft: 4,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 15,
              transition: 'background 0.2s',
            }}
            title="Export as .txt"
          >
            Export TXT
          </button>
          <button
            type="button"
            onClick={() => handleExport('json')}
            style={{
              background: 'rgba(161,196,253,0.18)',
              color: '#a1c4fd',
              border: 'none',
              borderRadius: 12,
              padding: '0.7em 1.1em',
              marginLeft: 4,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 15,
              transition: 'background 0.2s',
            }}
            title="Export as .json"
          >
            Export JSON
          </button>
        </div>
      </form>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        .typing-indicator span {
          font-size: 2em;
          margin-right: 2px;
          color: #a1c4fd;
        }
      `}</style>
    </div>
  );
}
