import { useState } from 'react';
import FavouritePrompts from './FavouritePrompts';
import SessionHistory from './SessionHistory';

function AdminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Custom model management state
  const LOCAL_STORAGE_KEY = 'customModels';
  const GENRES = [
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'scifi', name: 'Sci-Fi' },
    { id: 'mystery', name: 'Mystery' },
    { id: 'romance', name: 'Romance' },
    { id: 'nonfiction', name: 'Nonfiction' },
    { id: 'horror', name: 'Horror' },
    { id: 'historical', name: 'Historical' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'ya', name: 'Young Adult' },
    { id: 'childrens', name: "Children's" },
    { id: 'poetry', name: 'Poetry' },
    { id: 'satire', name: 'Satire' },
    { id: 'dystopian', name: 'Dystopian' },
    { id: 'general', name: 'General' },
  ];
  function getModels() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
  function saveModels(models: any[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
  }
  const [models, setModels] = useState<any[]>(getModels());
  const [form, setForm] = useState({
    name: '',
    desc: '',
    systemPrompt: '',
    genres: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!form.name.trim() || !form.systemPrompt.trim()) return;
    const newModel = {
      id: Math.random().toString(36).slice(2),
      ...form,
    };
    const updated = [newModel, ...models];
    setModels(updated);
    saveModels(updated);
    setForm({ name: '', desc: '', systemPrompt: '', genres: [] });
  };
  const handleDelete = (id: string) => {
    const updated = models.filter(m => m.id !== id);
    setModels(updated);
    saveModels(updated);
  };
  const handleEdit = (model: any) => {
    setEditingId(model.id);
    setForm({ name: model.name, desc: model.desc, systemPrompt: model.systemPrompt, genres: model.genres || [] });
  };
  const handleUpdate = () => {
    if (!editingId) return;
    const updated = models.map(m => m.id === editingId ? { ...m, ...form } : m);
    setModels(updated);
    saveModels(updated);
    setEditingId(null);
    setForm({ name: '', desc: '', systemPrompt: '', genres: [] });
  };
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#23243a', color: '#fff', borderRadius: 16, padding: 32, minWidth: 380, minHeight: 320, boxShadow: '0 8px 32px #0006', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#f87171', fontSize: 22, cursor: 'pointer' }}>✕</button>
        <h2 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Workspace Admin</h2>
        <div style={{ color: '#a1c4fd', fontSize: 15, marginBottom: 12 }}>Custom Model/Coach Management</div>
        {/* Model Form */}
        <div style={{ marginBottom: 18, background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{editingId ? 'Edit Model/Coach' : 'Add New Model/Coach'}</div>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ width: '100%', marginBottom: 8, borderRadius: 6, border: '1px solid #888', padding: '0.4em 0.7em', fontSize: 15 }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            style={{ width: '100%', marginBottom: 8, borderRadius: 6, border: '1px solid #888', padding: '0.4em 0.7em', fontSize: 15 }}
          />
          <textarea
            placeholder="System Prompt (required)"
            value={form.systemPrompt}
            onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
            style={{ width: '100%', marginBottom: 8, borderRadius: 6, border: '1px solid #888', padding: '0.4em 0.7em', fontSize: 15, minHeight: 60 }}
          />
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Assign to genres:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {GENRES.map(g => (
                <label key={g.id} style={{ fontSize: 13, color: '#a1c4fd', marginRight: 8 }}>
                  <input
                    type="checkbox"
                    checked={form.genres.includes(g.id)}
                    onChange={e => {
                      setForm(f => ({
                        ...f,
                        genres: e.target.checked
                          ? [...f.genres, g.id]
                          : f.genres.filter(id => id !== g.id)
                      }));
                    }}
                  /> {g.name}
                </label>
              ))}
            </div>
          </div>
          {editingId ? (
            <button onClick={handleUpdate} style={{ background: '#4ade80', color: '#213547', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.5em 1.2em', marginRight: 8 }}>Update</button>
          ) : (
            <button onClick={handleAdd} style={{ background: '#646cff', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.5em 1.2em' }}>Add</button>
          )}
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ name: '', desc: '', systemPrompt: '', genres: [] }); }} style={{ marginLeft: 8, background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5em 1.2em' }}>Cancel</button>
          )}
        </div>
        {/* Model List */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Your Custom Models/Coaches</div>
          {models.length === 0 && <div style={{ color: '#aaa', fontSize: 14 }}>No custom models yet.</div>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {models.map((model: any) => (
              <li key={model.id} style={{ marginBottom: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{model.name}</div>
                {model.desc && <div style={{ fontSize: 13, color: '#a1c4fd' }}>{model.desc}</div>}
                <div style={{ fontSize: 13, color: '#facc15', margin: '2px 0' }}><b>Genres:</b> {model.genres && model.genres.length > 0 ? model.genres.map((gid: string) => GENRES.find(g => g.id === gid)?.name).filter(Boolean).join(', ') : 'None'}</div>
                <div style={{ fontSize: 13, color: '#fff', opacity: 0.8, margin: '2px 0' }}><b>System Prompt:</b> {model.systemPrompt}</div>
                <div style={{ marginTop: 4, display: 'flex', gap: 8 }}>
                  <button onClick={() => handleEdit(model)} style={{ background: '#4ade80', color: '#213547', border: 'none', borderRadius: 6, padding: '0.3em 1em', fontWeight: 600, fontSize: 14 }}>Edit</button>
                  <button onClick={() => handleDelete(model.id)} style={{ background: '#f87171', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3em 1em', fontWeight: 600, fontSize: 14 }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  onPromptSelect,
  onSessionSelect
}: {
  onPromptSelect: (prompt: string) => void;
  onSessionSelect: (messages: any[]) => void;
}) {
  const [adminOpen, setAdminOpen] = useState(false);
  return (
    <aside
      style={{
        width: 260,
        minWidth: 200,
        maxWidth: 320,
        background: 'rgba(36,36,48,0.96)',
        color: '#fff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1.5px solid #222',
        boxShadow: '2px 0 16px #0002',
        zIndex: 2,
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <div style={{ padding: '1.5em 1em 0.5em 1em', fontWeight: 700, fontSize: 20, letterSpacing: 1, color: '#a1c4fd' }}>
        Creative Writing
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5em 1em' }}>
        <FavouritePrompts onPromptSelect={onPromptSelect} />
        <SessionHistory onSessionSelect={onSessionSelect} />
        <div style={{ marginTop: 32, borderTop: '1px solid #333', paddingTop: 16 }}>
          <button onClick={() => setAdminOpen(true)} style={{ width: '100%', background: '#23243a', color: '#a1c4fd', border: 'none', borderRadius: 8, padding: '0.7em 0', fontWeight: 600, fontSize: 15, marginBottom: 4, cursor: 'pointer' }}>
            Workspace Admin
          </button>
        </div>
      </div>
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </aside>
  );
}
