// ─── AgentsView — connected agent integrations ────────────────────────────────

import { useState } from 'react';

const CONNECTED = [
  {
    key: 'crowdstrike',
    name: 'CrowdStrike Charlotte AI',
    desc: 'Security orchestration & SOAR',
    abbr: 'CS',
    bg: '#E01B22',
    protocol: 'REST API',
    playbookCount: 3,
    lastCalled: '2 min ago',
    connectedBy: 'Jordan Ellis',
    connectedOn: 'Mar 12, 2026',
  },
  {
    key: 'hpe',
    name: 'HPE GreenLake Intelligence',
    desc: 'IT ops & device management',
    abbr: 'H',
    bg: '#01A982',
    protocol: 'MCP',
    playbookCount: 1,
    lastCalled: '14 min ago',
    connectedBy: 'Marcus Rivera',
    connectedOn: 'Feb 28, 2026',
  },
];

const AVAILABLE = [
  { key: 'servicenow', name: 'ServiceNow AI',       desc: 'ITSM workflow automation',      abbr: 'SN', bg: '#62D84E' },
  { key: 'okta',       name: 'Okta AI Governance',  desc: 'Identity & access management',  abbr: 'Ok', bg: '#007DC1' },
  { key: 'ms',         name: 'Microsoft Copilot',   desc: 'Enterprise AI assistant',        abbr: 'MS', bg: '#0078D4' },
];

function AgentLogo({ abbr, bg, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size === 34 ? 12 : 11, fontWeight: 700, color: '#fff', letterSpacing: '0.03em',
    }}>
      {abbr}
    </div>
  );
}

function ConnectedRow({ agent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '10px 0', borderBottom: '1px solid var(--border)',
        background: hovered ? 'var(--background-weak)' : 'transparent',
        borderRadius: 6, marginLeft: -8, paddingLeft: 8, paddingRight: 8,
        transition: 'background 0.1s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AgentLogo abbr={agent.abbr} bg={agent.bg} />

      {/* Name + desc */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{agent.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-weak)' }}>{agent.desc}</div>
      </div>

      {/* Protocol */}
      <span style={{
        fontSize: 11, padding: '2px 8px', borderRadius: 100,
        border: '1px solid var(--border)', color: 'var(--text-weak)',
        background: 'var(--background-medium)', flexShrink: 0,
      }}>{agent.protocol}</span>

      {/* Playbooks count */}
      <span style={{ fontSize: 12, color: 'var(--text-weak)', flexShrink: 0, width: 100, textAlign: 'right' }}>
        {agent.playbookCount} {agent.playbookCount === 1 ? 'playbook' : 'playbooks'}
      </span>

      {/* Last called */}
      <span style={{ fontSize: 12, color: 'var(--text-disabled)', flexShrink: 0, width: 100, textAlign: 'right' }}>
        {agent.lastCalled}
      </span>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, width: 90 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-text)', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--success-text)', fontWeight: 500 }}>Connected</span>
      </div>

      {/* Configure */}
      <button
        style={{
          height: 28, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 6,
          fontSize: 12, color: 'var(--text-weak)', background: 'none', cursor: 'pointer', flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-weak)'; }}
      >Configure</button>
    </div>
  );
}

function AvailableRow({ agent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '10px 0', borderBottom: '1px solid var(--border)',
        background: hovered ? 'var(--background-weak)' : 'transparent',
        borderRadius: 6, marginLeft: -8, paddingLeft: 8, paddingRight: 8,
        transition: 'background 0.1s', opacity: 0.7,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AgentLogo abbr={agent.abbr} bg={agent.bg} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{agent.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-weak)' }}>{agent.desc}</div>
      </div>

      <button
        style={{
          height: 28, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 6,
          fontSize: 12, color: 'var(--text-weak)', background: 'none', cursor: 'pointer', flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-weak)'; }}
      >Connect</button>
    </div>
  );
}

export default function AgentsView() {
  return (
    <div style={{ padding: '32px 32px 64px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>Agents</h1>
        <p style={{ fontSize: 14, color: 'var(--text-weak)', margin: 0 }}>
          Third-party AI agents connected to your workspace. Use them as steps in playbooks.
        </p>
      </div>

      {/* Connected agents */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Connected</span>
          <span style={{ fontSize: 11, color: '#10B981', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 100, padding: '1px 8px', fontWeight: 600 }}>
            {CONNECTED.length} active
          </span>
        </div>

        {/* Column headers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 8px', marginBottom: 0 }}>
          <div style={{ width: 34, flexShrink: 0 }} />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', flexShrink: 0, width: 70 }}>Protocol</span>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', flexShrink: 0, width: 100, textAlign: 'right' }}>In playbooks</span>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', flexShrink: 0, width: 100, textAlign: 'right' }}>Last called</span>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', flexShrink: 0, width: 90 }}>Status</span>
          <div style={{ width: 76, flexShrink: 0 }} />
        </div>

        {CONNECTED.map(a => <ConnectedRow key={a.key} agent={a} />)}
      </div>

      {/* Available to connect */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Available to connect</span>
          <button style={{
            height: 28, padding: '0 12px', border: 'none', borderRadius: 6,
            fontSize: 12, fontWeight: 500, color: '#fff', background: 'var(--selected-background-strong)', cursor: 'pointer',
          }}>
            + Add agent
          </button>
        </div>
        {AVAILABLE.map(a => <AvailableRow key={a.key} agent={a} />)}
      </div>

    </div>
  );
}
