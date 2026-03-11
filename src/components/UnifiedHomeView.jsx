// ─── UnifiedHomeView — Work + Service homes in tabs ───────────────────────────

import { useState } from 'react';
import Admin2HomeView from './Admin2HomeView';
import HomeView from './HomeView';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const TABS = [
  { id: 'work',    label: 'Work'    },
  { id: 'service', label: 'Service' },
];

export default function UnifiedHomeView({ defaultTab = 'work', hideTabs = false, onOpenServiceMode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Tab bar ────────────────────────────────────────────────────── */}
      {!hideTabs && <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 32px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--background)',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                height: 44, padding: '0 12px', fontSize: 13, fontFamily: SFT,
                fontWeight: active ? 500 : 400, cursor: 'pointer',
                background: 'transparent', border: 'none',
                color: active ? 'var(--text)' : 'var(--text-weak)',
                borderBottom: active ? '2px solid var(--selected-background-strong)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-weak)'; }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>}

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'service'
          ? <Admin2HomeView />
          : <HomeView onOpenServiceMode={onOpenServiceMode} />
        }
      </div>

    </div>
  );
}
