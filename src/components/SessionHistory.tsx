import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'sessionHistory';

function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
}

export default function SessionHistory({ onSessionSelect }: { onSessionSelect: (messages: any[]) => void }) {
  const [sessions, setSessions] = useState<{ id: string, messages: any[], created: number }[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#a1c4fd' }}>Session History</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sessions.length === 0 && <li style={{ color: '#aaa', fontSize: 14 }}>No sessions yet.</li>}
        {sessions.map(session => (
          <li key={session.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => onSessionSelect(session.messages)}
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
              title="Restore this session"
            >
              {new Date(session.created).toLocaleString()} ({session.messages.length} msgs)
            </button>
            <button
              onClick={() => handleDelete(session.id)}
              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 16, cursor: 'pointer', padding: 2 }}
              title="Delete session"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

