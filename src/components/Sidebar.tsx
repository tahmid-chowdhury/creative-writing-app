import React from 'react';
import FavouritePrompts from './FavouritePrompts';
import SessionHistory from './SessionHistory';

export default function Sidebar({
  onPromptSelect,
  onSessionSelect
}: {
  onPromptSelect: (prompt: string) => void;
  onSessionSelect: (messages: any[]) => void;
}) {
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
      </div>
      {/* Footer or admin panel link can go here */}
    </aside>
  );
}
