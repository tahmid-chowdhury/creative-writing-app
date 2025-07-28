import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'sessionHistory';
const FOLDER_KEY = 'sessionFolders';

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
function getFolders() {
  try {
    return JSON.parse(localStorage.getItem(FOLDER_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveFolders(folders) {
  localStorage.setItem(FOLDER_KEY, JSON.stringify(folders));
}

export default function SessionHistory({ onSessionSelect }: { onSessionSelect: (messages: any[]) => void }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [folders, setFolders] = useState<{ id: string, name: string, expanded: boolean }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newFolder, setNewFolder] = useState('');

  useEffect(() => {
    setSessions(getSessions());
    setFolders(getFolders());
  }, []);

  const handleDelete = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
  };

  const handleRename = (id: string, name: string) => {
    const updated = sessions.map(s => s.id === id ? { ...s, name } : s);
    setSessions(updated);
    saveSessions(updated);
    setEditingId(null);
  };

  const handleFolderCreate = () => {
    if (!newFolder.trim()) return;
    const folder = { id: Math.random().toString(36).slice(2), name: newFolder.trim(), expanded: true };
    const updated = [...folders, folder];
    setFolders(updated);
    saveFolders(updated);
    setNewFolder('');
  };

  const handleFolderRename = (id: string, name: string) => {
    const updated = folders.map(f => f.id === id ? { ...f, name } : f);
    setFolders(updated);
    saveFolders(updated);
  };

  const handleFolderDelete = (id: string) => {
    setFolders(folders.filter(f => f.id !== id));
    saveFolders(folders.filter(f => f.id !== id));
    // Move sessions out of deleted folder
    const updatedSessions = sessions.map(s => s.folder === id ? { ...s, folder: undefined } : s);
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
  };

  const handleMoveToFolder = (sessionId: string, folderId: string | undefined) => {
    const updated = sessions.map(s => s.id === sessionId ? { ...s, folder: folderId } : s);
    setSessions(updated);
    saveSessions(updated);
  };

  const toggleFolder = (id: string) => {
    const updated = folders.map(f => f.id === id ? { ...f, expanded: !f.expanded } : f);
    setFolders(updated);
    saveFolders(updated);
  };

  // Sessions not in any folder
  const rootSessions = sessions.filter(s => !s.folder);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#a1c4fd' }}>Session History</div>
      {/* Folders */}
      <div style={{ marginBottom: 10 }}>
        {folders.map(folder => (
          <div key={folder.id} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => toggleFolder(folder.id)} style={{ background: 'none', border: 'none', color: '#a1c4fd', fontSize: 16, cursor: 'pointer' }}>{folder.expanded ? '▼' : '▶'}</button>
              {editingId === folder.id ? (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => handleFolderRename(folder.id, editValue)}
                  onKeyDown={e => e.key === 'Enter' && handleFolderRename(folder.id, editValue)}
                  autoFocus
                  style={{ borderRadius: 6, border: '1px solid #888', fontSize: 14, padding: '0.2em 0.5em', flex: 1 }}
                />
              ) : (
                <span style={{ fontWeight: 600, fontSize: 15, flex: 1 }}>{folder.name}</span>
              )}
              <button onClick={() => { setEditingId(folder.id); setEditValue(folder.name); }} style={{ background: 'none', border: 'none', color: '#a1c4fd', fontSize: 15, cursor: 'pointer' }} title="Rename folder">✎</button>
              <button onClick={() => handleFolderDelete(folder.id)} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 16, cursor: 'pointer' }} title="Delete folder">✕</button>
            </div>
            {folder.expanded && (
              <ul style={{ listStyle: 'none', padding: '0 0 0 18px', margin: 0 }}>
                {sessions.filter(s => s.folder === folder.id).length === 0 && <li style={{ color: '#aaa', fontSize: 14 }}>No sessions</li>}
                {sessions.filter(s => s.folder === folder.id).map(session => (
                  <li key={session.id} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => onSessionSelect(session.messages)}
                      style={{ background: 'rgba(161,196,253,0.13)', color: '#a1c4fd', border: 'none', borderRadius: 8, padding: '0.4em 0.8em', fontSize: 14, cursor: 'pointer', flex: 1, textAlign: 'left', transition: 'background 0.2s' }}
                      title="Restore this session"
                    >
                      {editingId === session.id ? (
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={() => handleRename(session.id, editValue)}
                          onKeyDown={e => e.key === 'Enter' && handleRename(session.id, editValue)}
                          autoFocus
                          style={{ borderRadius: 6, border: '1px solid #888', fontSize: 14, padding: '0.2em 0.5em', flex: 1 }}
                        />
                      ) : (
                        <span>{session.name || new Date(session.created).toLocaleString()}</span>
                      )}
                    </button>
                    <button onClick={() => { setEditingId(session.id); setEditValue(session.name || ''); }} style={{ background: 'none', border: 'none', color: '#a1c4fd', fontSize: 15, cursor: 'pointer' }} title="Rename session">✎</button>
                    <select value={session.folder || ''} onChange={e => handleMoveToFolder(session.id, e.target.value || undefined)} style={{ borderRadius: 6, fontSize: 13, padding: '0.1em 0.4em' }}>
                      <option value="">No Folder</option>
                      {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <button onClick={() => handleDelete(session.id)} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 16, cursor: 'pointer' }} title="Delete session">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {/* New folder input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <input
            value={newFolder}
            onChange={e => setNewFolder(e.target.value)}
            placeholder="New folder name"
            style={{ borderRadius: 6, border: '1px solid #888', fontSize: 14, padding: '0.2em 0.5em', flex: 1 }}
          />
          <button onClick={handleFolderCreate} style={{ background: '#646cff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.3em 0.8em', fontWeight: 600, fontSize: 15 }}>Add</button>
        </div>
      </div>
      {/* Root sessions (not in folders) */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {rootSessions.length === 0 && <li style={{ color: '#aaa', fontSize: 14 }}>No sessions yet.</li>}
        {rootSessions.map(session => (
          <li key={session.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => onSessionSelect(session.messages)}
              style={{ background: 'rgba(161,196,253,0.13)', color: '#a1c4fd', border: 'none', borderRadius: 8, padding: '0.4em 0.8em', fontSize: 14, cursor: 'pointer', flex: 1, textAlign: 'left', transition: 'background 0.2s' }}
              title="Restore this session"
            >
              {editingId === session.id ? (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => handleRename(session.id, editValue)}
                  onKeyDown={e => e.key === 'Enter' && handleRename(session.id, editValue)}
                  autoFocus
                  style={{ borderRadius: 6, border: '1px solid #888', fontSize: 14, padding: '0.2em 0.5em', flex: 1 }}
                />
              ) : (
                <span>{session.name || new Date(session.created).toLocaleString()}</span>
              )}
            </button>
            <button onClick={() => { setEditingId(session.id); setEditValue(session.name || ''); }} style={{ background: 'none', border: 'none', color: '#a1c4fd', fontSize: 15, cursor: 'pointer' }} title="Rename session">✎</button>
            <select value={session.folder || ''} onChange={e => handleMoveToFolder(session.id, e.target.value || undefined)} style={{ borderRadius: 6, fontSize: 13, padding: '0.1em 0.4em' }}>
              <option value="">No Folder</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <button onClick={() => handleDelete(session.id)} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 16, cursor: 'pointer' }} title="Delete session">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
