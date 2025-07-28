import React, { useState } from 'react';
import FavouritePrompts from './FavouritePrompts';
import SessionHistory from './SessionHistory';

function AdminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#23243a', color: '#fff', borderRadius: 16, padding: 32, minWidth: 340, minHeight: 220, boxShadow: '0 8px 32px #0006', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#f87171', fontSize: 22, cursor: 'pointer' }}>✕</button>
        <h2 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Workspace Admin</h2>
        <div style={{ color: '#a1c4fd', fontSize: 15, marginBottom: 12 }}>Custom Model/Coach management coming soon...</div>
        {/* Here you will add the custom model management UI */}
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
