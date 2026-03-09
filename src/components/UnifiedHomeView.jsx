// ─── UnifiedHomeView — Service + CWM homes combined with tabs ────────────────

import { useState } from 'react';
import Admin2HomeView from './Admin2HomeView';
import HomeView from './HomeView';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateStr() {
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

const TABS = [
  { id: 'service', label: 'Service' },
  { id: 'cwm',     label: 'CWM'     },
];

export default function UnifiedHomeView({ defaultTab = 'service', onOpenServiceMode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background-weak)' }}>

      {/* ── Greeting ──────────────────────────────────────────────────── */}
      <div style={{ padding: '40px 32px 20px', flexShrink: 0 }}>
        <p style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '18px', marginBottom: 6 }}>{getDateStr()}</p>
        <p style={{ fontFamily: '"SF Pro Display"', fontSize: 32, fontWeight: 400, color: 'var(--text)', letterSpacing: '0.38px', lineHeight: '40px', fontFeatureSettings: "'liga' off, 'clig' off", margin: 0 }}>
          {getGreeting()}, Anubhuti
        </p>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 32px' }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  height: 44, padding: '0 10px', fontSize: 13, fontFamily: SFT,
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
        </div>
        {/* Inset border — aligns with greeting text */}
        <div style={{ position: 'absolute', bottom: 0, left: 32, right: 32, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'service'
          ? <Admin2HomeView hideGreeting />
          : <HomeView hideGreeting onOpenServiceMode={onOpenServiceMode} />
        }
      </div>

    </div>
  );
}
