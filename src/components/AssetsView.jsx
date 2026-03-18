import { useState } from 'react';
import Pill from './Pill';
import RightPanelOverlay from './RightPanelOverlay';
import Avatar from './ui/Avatar';
import { ASSETS } from '../data/assets';
import FilterPanel, { applyFilters } from './ui/FilterPanel';
import { SFT, LIGA } from '../constants/typography';

// ─── Filter config ────────────────────────────────────────────────────────────
const ASSET_FIELDS = [
  { id: 'os',         label: 'OS',         type: 'select', options: ['macOS', 'Windows', 'iOS'] },
  { id: 'status',     label: 'Status',     type: 'select', options: ['Active', 'EOL grace period', 'EOL planned', 'Inactive'] },
  { id: 'compliance', label: 'Compliance', type: 'select', options: ['Compliant', 'Non compliant'] },
  { id: 'location',   label: 'Location',   type: 'text' },
];

const ASSET_QUICK_FILTERS = [
  { id: 'compliant',    label: 'Compliant',     rules: [{ field: 'compliance', op: 'is', value: 'Compliant' }] },
  { id: 'noncompliant', label: 'Non-compliant', rules: [{ field: 'compliance', op: 'is', value: 'Non compliant' }] },
  { id: 'eol',          label: 'EOL devices',   rules: [{ field: 'status', op: 'is', value: 'EOL grace period' }] },
];

const ASSET_ACCESSORS = {
  os:         a => a.os,
  status:     a => a.status,
  compliance: a => a.compliance,
  location:   a => a.location,
};

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_BADGE = {
  'Active':           { bg: 'var(--success-background)', color: 'var(--success-text)' },
  'EOL grace period': { bg: 'var(--warning-background)', color: 'var(--warning-text)' },
  'EOL planned':      { bg: 'var(--danger-background)',  color: 'var(--danger-text)' },
  'Inactive':         { bg: 'var(--background-medium)',  color: 'var(--text-weak)' },
};

const COMPLIANCE_DOT = {
  'Compliant':     'var(--success-text)',
  'Non compliant': 'var(--danger-text)',
};

const MDM_BADGE = {
  'Active':   { bg: 'var(--success-background)', color: 'var(--success-text)' },
  'Inactive': { bg: 'var(--background-medium)',  color: 'var(--text-weak)' },
};

// ─── Shared typography ────────────────────────────────────────────────────────
const typoCell = { fontFamily: SFT, fontSize: '14px', fontWeight: 400, lineHeight: '20px', color: 'var(--text)', ...LIGA };
const typoMeta = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA };
const COL = 'text-xs font-medium text-text-weak px-2 py-2 text-left whitespace-nowrap flex items-center';
const CELL = 'px-2 flex items-center';
const divStyle = { borderRight: '1px solid var(--border)' };

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="5" /><path d="M12 12l-2.5-2.5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true">
      <path d="M9.09 3.93L6 6.52 2.91 3.93a.75.75 0 10-.97 1.14l3.58 3a.75.75 0 001.0 0l3.57-3a.75.75 0 10-.97-1.14z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

function TableViewIcon({ active }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke={active ? 'var(--text)' : 'var(--text-disabled)'} strokeWidth="1.5">
      <rect x="1" y="1" width="14" height="14" rx="1.5" /><path d="M1 5h14M1 9h14M6 5v9" />
    </svg>
  );
}

function CardViewIcon({ active }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke={active ? 'var(--text)' : 'var(--text-disabled)'} strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function macOSIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="#626364" aria-label="macOS">
      <path d="M11.182 9.04c.028-.823.462-1.56 1.137-2.01-.441-.631-1.122-1.022-1.853-1.056-1.032-.108-2.03.619-2.556.619-.537 0-1.35-.607-2.223-.59-1.14.018-2.195.675-2.774 1.71-1.192 2.064-.307 5.113.848 6.788.566.824 1.237 1.746 2.118 1.713.854-.035 1.177-.55 2.21-.55 1.025 0 1.322.55 2.217.533.92-.018 1.498-.83 2.055-1.659.405-.59.72-1.238.933-1.924a3.166 3.166 0 01-1.912-2.574zM9.83 4.76a3.07 3.07 0 00.703-2.196 3.12 3.12 0 00-2.02 1.046 2.924 2.924 0 00-.722 2.122A2.586 2.586 0 009.83 4.76z"/>
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="#0078D4" aria-label="Windows">
      <path d="M0 2.357L6.533 1.5v6.357H0zm7.2-.952L16 0v7.857H7.2zM0 8.786h6.533V15.5L0 14.643zm7.2.714H16V16l-8.8-1.286z"/>
    </svg>
  );
}

function iOSIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="#626364" aria-label="iOS">
      <rect x="4" y="1" width="8" height="14" rx="2" stroke="#626364" strokeWidth="1.2" fill="none"/>
      <circle cx="8" cy="12.5" r="0.8" fill="#626364"/>
    </svg>
  );
}

const OS_ICONS = { macOS: macOSIcon, Windows: WindowsIcon, iOS: iOSIcon };

// ─── KPI card ─────────────────────────────────────────────────────────────────

const KPI_ICON_COLORS = {
  warning: { bg: 'var(--warning-background)', stroke: 'var(--warning-text)' },
  danger:  { bg: 'var(--danger-background)',  stroke: 'var(--danger-text)' },
  neutral: { bg: 'var(--background-medium)',  stroke: 'var(--text-weak)' },
};

function AssetKpiCard({ value, label }) {
  return (
    <div className="flex-1 min-w-0 bg-background-weak border border-border rounded-lg" style={{ padding: '18px 20px' }}>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: 'var(--text)', margin: 0 }}>{value}</p>
    </div>
  );
}

function UnassignedIcon(stroke) {
  return <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke={stroke} strokeWidth="1.5"><circle cx="10" cy="7" r="4"/><path d="M2 18c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/><path d="M14 3l2 2-2 2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function EolIcon(stroke) {
  return <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke={stroke} strokeWidth="1.5"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function NonCompliantIcon(stroke) {
  return <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke={stroke} strokeWidth="1.5"><path d="M10 2L2 17h16L10 2z" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" strokeLinecap="round"/></svg>;
}
function TotalIcon(stroke) {
  return <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke={stroke} strokeWidth="1.5"><rect x="3" y="4" width="14" height="10" rx="1.5"/><path d="M3 8h14M6 4v10M3 15h14" strokeLinecap="round"/></svg>;
}

// ─── Table header ─────────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <div className="flex items-stretch w-full bg-[var(--surface)] sticky top-0 z-[2]"
         style={{ borderBottom: '1px solid var(--border)' }}>
      <div className={`${COL} w-[44px] shrink-0 justify-center`}>#</div>
      <div className={`${COL} sticky left-[44px] bg-[var(--surface)] z-[3] w-[210px] shrink-0`} style={divStyle}>Asset</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Status</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Model</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>OS</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Location</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Compliance</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>MDM Status</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>EOL Date</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Warranty End</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Assignee</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Last seen</div>
      <div className={`${COL} flex-1 min-w-[80px]`}>Age</div>
    </div>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

function TableRow({ asset, index, onOpen }) {
  const OsIcon = OS_ICONS[asset.os];
  const { bg: sBg, color: sColor } = STATUS_BADGE[asset.status] ?? STATUS_BADGE['Inactive'];
  const { bg: mBg, color: mColor } = MDM_BADGE[asset.mdmStatus] ?? MDM_BADGE['Inactive'];
  const compColor = COMPLIANCE_DOT[asset.compliance] ?? 'var(--text-weak)';

  return (
    <div
      onClick={onOpen}
      className="group flex items-stretch w-full bg-background-weak hover:bg-background-medium transition-colors cursor-pointer"
      style={{ height: 56, borderBottom: '1px solid var(--border)' }}
    >
      {/* # */}
      <div className={`${CELL} w-[44px] shrink-0 justify-center`} style={{ ...typoMeta, fontSize: 11 }}>{index + 1}</div>
      {/* Asset name + type */}
      <div className={`${CELL} sticky left-[44px] z-[1] bg-background-weak group-hover:bg-background-medium w-[210px] shrink-0`} style={divStyle}>
        <div>
          <div style={{ ...typoCell, fontWeight: 500 }} className="truncate max-w-[180px]">{asset.name}</div>
          <div style={typoMeta}>{asset.type}</div>
        </div>
      </div>
      {/* Status */}
      <div className={`${CELL} w-[120px] shrink-0`} style={divStyle}>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: SFT, background: sBg, color: sColor, whiteSpace: 'nowrap' }}>
          {asset.status}
        </span>
      </div>
      {/* Model */}
      <div className={`${CELL} w-[120px] shrink-0`} style={{ ...divStyle, ...typoCell }}>
        <div>
          <div className="truncate max-w-[100px]" style={{ fontSize: 13 }}>{asset.model}</div>
          <div style={typoMeta}>{asset.manufacturer}</div>
        </div>
      </div>
      {/* OS */}
      <div className={`${CELL} w-[120px] shrink-0 gap-1.5`} style={{ ...divStyle, ...typoMeta }}>
        {OsIcon && <OsIcon />} {asset.os}
      </div>
      {/* Location */}
      <div className={`${CELL} w-[120px] shrink-0`} style={{ ...divStyle, ...typoCell, fontSize: 12 }}>
        <span className="truncate max-w-[100px]">{asset.location}</span>
      </div>
      {/* Compliance */}
      <div className={`${CELL} w-[120px] shrink-0 gap-1.5`} style={{ ...divStyle, ...typoCell, fontSize: 12 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: compColor, flexShrink: 0, display: 'inline-block' }} />
        {asset.compliance}
      </div>
      {/* MDM Status */}
      <div className={`${CELL} w-[120px] shrink-0`} style={divStyle}>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: SFT, background: mBg, color: mColor }}>
          {asset.mdmStatus}
        </span>
      </div>
      {/* EOL Date */}
      <div className={`${CELL} w-[120px] shrink-0`} style={{ ...divStyle, ...typoCell, fontSize: 12, color: asset.eolDate !== '--' ? 'var(--danger-text)' : 'var(--text-weak)' }}>
        {asset.eolDate}
      </div>
      {/* Warranty End */}
      <div className={`${CELL} w-[120px] shrink-0`} style={{ ...divStyle, ...typoCell, fontSize: 12, color: 'var(--text-weak)' }}>
        {asset.warrantyEnd}
      </div>
      {/* Assignee */}
      <div className={`${CELL} w-[120px] shrink-0 gap-2`} style={{ ...divStyle, ...typoCell, fontSize: 13 }}>
        {asset.assignee
          ? <>
              <Avatar name={asset.assignee.name} size={24} bg={asset.assignee.bg ? `#${asset.assignee.bg}` : undefined} />
              <span className="truncate max-w-[80px]">{asset.assignee.name}</span>
            </>
          : <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>Unassigned</span>
        }
      </div>
      {/* Last seen */}
      <div className={`${CELL} w-[120px] shrink-0`} style={{ ...divStyle, ...typoMeta, fontSize: 12 }}>
        {asset.lastSeen}
      </div>
      {/* Age */}
      <div className={`${CELL} flex-1 min-w-[80px]`} style={{ ...typoMeta, fontSize: 12 }}>
        {asset.age}
      </div>
    </div>
  );
}

// ─── Asset slide-over content ─────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      minHeight: 40,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: '42%', flexShrink: 0, paddingLeft: 2, paddingRight: 12,
        fontSize: 13, fontFamily: SFT, color: 'var(--text-weak)',
      }}>
        {label}
      </div>
      <div style={{
        flex: 1, paddingLeft: 16, borderLeft: '1px solid var(--border)',
        fontSize: 13, fontFamily: SFT, color: 'var(--text)',
        paddingBlock: 10,
      }}>
        {children ?? <span style={{ color: 'var(--text-disabled)' }}>—</span>}
      </div>
    </div>
  );
}

function SubSection({ title }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600, fontFamily: SFT, color: 'var(--text)',
      padding: '18px 0 8px',
    }}>
      {title}
    </div>
  );
}

function AssetDetail({ asset, onClose }) {
  const OsIcon = OS_ICONS[asset.os];
  const { bg: sBg, color: sColor } = STATUS_BADGE[asset.status] ?? STATUS_BADGE['Inactive'];
  const compColor = COMPLIANCE_DOT[asset.compliance] ?? 'var(--text-weak)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0, fontFamily: SFT, lineHeight: '22px' }}>
                {asset.name}
              </h2>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: SFT, background: sBg, color: sColor, flexShrink: 0 }}>
                {asset.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{asset.type}</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{asset.model}</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>ID: {asset.serial}</span>
            </div>
          </div>
          <button type="button" onClick={onClose}
            style={{ color: 'var(--text-disabled)', border: 'none', background: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-disabled)'}>
            <CloseIcon />
          </button>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: SFT, color: 'var(--text-disabled)', marginBottom: 1 }}>Location</div>
            <div style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text)', fontWeight: 500 }}>{asset.location}</div>
          </div>
          <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 10, fontFamily: SFT, color: 'var(--text-disabled)', marginBottom: 1 }}>Source</div>
            <div style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text)', fontWeight: 500 }}>{asset.source}</div>
          </div>
          <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 10, fontFamily: SFT, color: 'var(--text-disabled)', marginBottom: 1 }}>Last seen</div>
            <div style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text-weak)' }}>{asset.lastSeen}</div>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>

        <SubSection title="Asset details" />
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <Field label="Compliance status">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: compColor, flexShrink: 0, display: 'inline-block' }} />
              {asset.compliance}
            </span>
          </Field>
          <Field label="Ownership">{asset.ownership}</Field>
          <Field label="Assigned to">
            {asset.assignee
              ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Avatar name={asset.assignee.name} size={20} bg={asset.assignee.bg ? `#${asset.assignee.bg}` : undefined} />
                  {asset.assignee.name}
                </span>
              : <span style={{ color: 'var(--text-disabled)' }}>Unassigned</span>
            }
          </Field>
          <Field label="Asset ID">{asset.id}</Field>
          <Field label="Department">{asset.department}</Field>
          <Field label="MDM status">{asset.mdmStatus}</Field>
          <Field label="EOL date"><span style={{ color: asset.eolDate !== '--' ? 'var(--danger-text)' : 'inherit' }}>{asset.eolDate}</span></Field>
        </div>

        <SubSection title="Purchase details" />
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <Field label="Order number">{asset.orderNumber}</Field>
          <Field label="Price">{asset.price}</Field>
          <Field label="Purchase date">{asset.purchaseDate}</Field>
          <Field label="Warranty type">{asset.warrantyType}</Field>
          <Field label="Warranty end">{asset.warrantyEnd}</Field>
          <Field label="Supplier">{asset.supplier}</Field>
        </div>

        <SubSection title="Device specifications" />
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <Field label="Model">{asset.model}</Field>
          <Field label="Serial number">{asset.serial}</Field>
          <Field label="OS version">
            {OsIcon
              ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><OsIcon />{asset.osVersion}</span>
              : asset.osVersion}
          </Field>
          <Field label="MAC address">{asset.macAddress}</Field>
          <Field label="IP address">{asset.ipAddress}</Field>
          <Field label="Disk encryption">{asset.diskEncryption ? 'True' : 'False'}</Field>
        </div>

        <SubSection title="Hardware specifications" />
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <Field label="CPU">{asset.cpu}</Field>
          <Field label="Memory">{asset.memory}</Field>
          <Field label="Storage">{asset.storage}</Field>
          <Field label="Battery health">{asset.batteryHealth}</Field>
          <Field label="Network interfaces">{asset.networkInterfaces}</Field>
          <Field label="Manufacturer">{asset.manufacturer}</Field>
        </div>

        {/* ── Recent activity ── */}
        <SubSection title="Recent activity" />
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { time: '2 days ago',   text: 'MDM enrollment verified' },
            { time: '5 days ago',   text: 'OS version check completed' },
            { time: '2 weeks ago',  text: 'Asset assigned to current user' },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 10, paddingBlock: 10, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, whiteSpace: 'nowrap', paddingTop: 1, minWidth: 84 }}>{item.time}</span>
              <span style={{ fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT }}>{item.text}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── AssetsView ───────────────────────────────────────────────────────────────

export default function AssetsView() {
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState([]);
  const [slideOver, setSlideOver] = useState(null);

  // KPI counts
  const unassigned   = ASSETS.filter(a => !a.assignee).length;
  const eolCount     = ASSETS.filter(a => a.status === 'EOL grace period' || a.status === 'EOL planned').length;
  const nonCompliant = ASSETS.filter(a => a.compliance === 'Non compliant').length;
  const total        = ASSETS.length;

  // Filtered rows
  const searchFiltered = search
    ? ASSETS.filter(a => {
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.model.toLowerCase().includes(q);
      })
    : ASSETS;
  const filtered = applyFilters(searchFiltered, filters, ASSET_ACCESSORS);

  const locations = [...new Set(ASSETS.map(a => a.location))].sort();

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-background-weak">

      {/* ── KPI bar ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 pt-8 pb-5">
        <div className="flex gap-4">
          <AssetKpiCard value={unassigned}   label="Unassigned assets" />
          <AssetKpiCard value={eolCount}     label="Assets reached EOL" />
          <AssetKpiCard value={nonCompliant} label="Non-compliant" />
          <AssetKpiCard value={total}        label="Total assets" />
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 pb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left: search */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search assets…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  height: 32, paddingLeft: 32, paddingRight: 12, fontSize: 13, fontFamily: SFT,
                  border: '1px solid var(--border)', borderRadius: 6, outline: 'none',
                  color: 'var(--text)', background: 'var(--background-weak)', width: 220,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--icon)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Right: filter + import */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FilterPanel
              fields={ASSET_FIELDS}
              quickFilters={ASSET_QUICK_FILTERS}
              filters={filters}
              onChange={setFilters}
            />
            {/* Import button */}
            <button
              type="button"
              style={{
                height: 32, padding: '0 14px', fontSize: 13, fontWeight: 500, fontFamily: SFT,
                borderRadius: 6, border: 'none', background: 'var(--selected-background-strong)', color: 'var(--selected-text-strong)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--selected-background-strong-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--selected-background-strong)'}
            >
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 1v7M3 5l3 3 3-3M2 10h8" />
              </svg>
              Import assets
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <div className="h-full overflow-auto" style={{ overscrollBehavior: 'none' }}>
          <div style={{ minWidth: '100%', width: 'max-content' }}>
            <TableHeader />
            {filtered.length > 0
              ? filtered.map((asset, i) => (
                  <TableRow
                    key={asset.id}
                    asset={asset}
                    index={i}
                    onOpen={() => setSlideOver(asset)}
                  />
                ))
              : (
                <div className="flex items-center justify-center py-16 w-full text-sm text-text-disabled"
                     style={{ borderBottom: '1px solid var(--border)' }}>
                  No assets match your filters.
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* ── Slide-over ───────────────────────────────────────────────────── */}
      <RightPanelOverlay open={!!slideOver} onClose={() => setSlideOver(null)} width="min(660px, 72%)">
        {slideOver && <AssetDetail asset={slideOver} onClose={() => setSlideOver(null)} />}
      </RightPanelOverlay>



    </div>
  );
}
