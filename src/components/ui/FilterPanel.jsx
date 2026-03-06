// ─── FilterPanel — Asana-style filter panel with quick filters + structured rows
//
// Props:
//   fields        {id, label, type:'select'|'text', options?:string[]}[]
//   quickFilters  {id, label, rules:{field,op,value}[]}[]
//   filters       {id, field, op, value}[]    ← controlled
//   onChange      (newFilters) => void
//   align         'left' | 'right'           (panel anchor side, default:'right')
//
// Named export:
//   applyFilters(items, filters, accessors)   ← wire into data filtering

import { useState, useRef, useEffect } from 'react';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ─── Icons ─────────────────────────────────────────────────────────────────────

function FilterBtnIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M2 4h12M5 8h6M7 12h2" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true">
      <path d="M9.09 3.93L6 6.52 2.91 3.93a.75.75 0 10-.97 1.14l3.58 3a.75.75 0 001.0 0l3.57-3a.75.75 0 10-.97-1.14z" />
    </svg>
  );
}

function SmXIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M2 2l8 8M10 2L2 10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 1v10M1 6h10" />
    </svg>
  );
}

// ─── CellDropdown — select cell used inside filter rows ───────────────────────

function CellDropdown({ value, options, onChange, placeholder = 'Select…', minWidth = 120 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (open && !ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', minWidth }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          width: '100%', height: 34, padding: '0 8px',
          border: `1px solid ${open ? 'var(--border-strong)' : 'var(--border)'}`,
          borderRadius: 6,
          background: open ? 'var(--background-medium)' : 'var(--background-weak)',
          cursor: 'pointer', fontFamily: SFT, fontSize: 13,
          color: value ? 'var(--text)' : 'var(--text-disabled)',
          transition: 'border-color 0.1s, background 0.1s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || placeholder}
        </span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          background: 'var(--background-weak)', border: '1px solid var(--border)',
          borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          zIndex: 200, minWidth: '100%', maxHeight: 200, overflowY: 'auto', paddingBlock: 4,
        }}>
          {options.map(opt => {
            const label = typeof opt === 'string' ? opt : opt.label;
            const val   = typeof opt === 'string' ? opt : opt.value;
            const active = val === value;
            return (
              <button
                key={val}
                type="button"
                onMouseDown={e => { e.preventDefault(); onChange(val); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  width: '100%', textAlign: 'left', padding: '7px 12px',
                  fontFamily: SFT, fontSize: 13,
                  color: active ? 'var(--text)' : 'var(--text-weak)',
                  fontWeight: active ? 500 : 400,
                  background: active ? 'var(--background-medium)' : 'transparent',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {active ? <CheckIcon /> : <span style={{ width: 11, flexShrink: 0 }} />}
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── FilterRow ─────────────────────────────────────────────────────────────────

const OPS_SELECT = ['is', 'is not'];
const OPS_TEXT   = ['contains', 'does not contain', 'is'];

function FilterRow({ filter, fields, onUpdate, onRemove }) {
  const field = fields.find(f => f.id === filter.field) ?? fields[0];
  const ops   = field?.type === 'select' ? OPS_SELECT : OPS_TEXT;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      {/* Field */}
      <CellDropdown
        value={fields.find(f => f.id === filter.field)?.label}
        options={fields.map(f => ({ label: f.label, value: f.id }))}
        onChange={fieldId => onUpdate(filter.id, { field: fieldId, op: 'is', value: '' })}
        placeholder="Field"
        minWidth={140}
      />
      {/* Operator */}
      <CellDropdown
        value={filter.op}
        options={ops}
        onChange={op => onUpdate(filter.id, { op })}
        placeholder="is"
        minWidth={100}
      />
      {/* Value */}
      {field?.type === 'select' ? (
        <CellDropdown
          value={filter.value}
          options={field.options ?? []}
          onChange={value => onUpdate(filter.id, { value })}
          placeholder="Value"
          minWidth={140}
        />
      ) : (
        <input
          type="text"
          value={filter.value}
          onChange={e => onUpdate(filter.id, { value: e.target.value })}
          placeholder="Value"
          style={{
            flex: 1, height: 34, minWidth: 140, padding: '0 10px',
            border: '1px solid var(--border)', borderRadius: 6,
            fontFamily: SFT, fontSize: 13, color: 'var(--text)',
            background: 'var(--background-weak)', outline: 'none',
            transition: 'border-color 0.1s',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--selected-background-strong)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        />
      )}
      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(filter.id)}
        style={{
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0,
          background: 'transparent', color: 'var(--text-disabled)', transition: 'all 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
      >
        <SmXIcon />
      </button>
    </div>
  );
}

// ─── applyFilters — generic filter utility ─────────────────────────────────────
// accessors: { fieldId: item => string|number }
export function applyFilters(items, filters, accessors) {
  const active = filters.filter(f => f.value !== '');
  if (active.length === 0) return items;
  return items.filter(item =>
    active.every(f => {
      const accessor = accessors[f.field];
      if (!accessor) return true;
      const itemVal   = String(accessor(item) ?? '').toLowerCase();
      const filterVal = f.value.toLowerCase();
      switch (f.op) {
        case 'is':                 return itemVal === filterVal;
        case 'is not':             return itemVal !== filterVal;
        case 'contains':           return itemVal.includes(filterVal);
        case 'does not contain':   return !itemVal.includes(filterVal);
        default:                   return true;
      }
    })
  );
}

// ─── FilterPanel ───────────────────────────────────────────────────────────────

export default function FilterPanel({ fields = [], quickFilters = [], filters = [], onChange, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (open && !wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const activeCount = filters.filter(f => f.value !== '').length;
  const btnActive   = open || activeCount > 0;

  function addFilter() {
    onChange([...filters, { id: Date.now(), field: fields[0]?.id ?? '', op: 'is', value: '' }]);
  }
  function removeFilter(id) {
    onChange(filters.filter(f => f.id !== id));
  }
  function updateFilter(id, updates) {
    onChange(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  }
  function clearAll() {
    onChange([]);
    setOpen(false);
  }

  function isQuickActive(qf) {
    return qf.rules.every(r =>
      filters.some(f => f.field === r.field && f.op === r.op && f.value === r.value)
    );
  }
  function toggleQuick(qf) {
    if (isQuickActive(qf)) {
      onChange(filters.filter(f =>
        !qf.rules.some(r => r.field === f.field && r.op === f.op && r.value === f.value)
      ));
    } else {
      const withoutOverlap = filters.filter(f => !qf.rules.some(r => r.field === f.field));
      onChange([
        ...withoutOverlap,
        ...qf.rules.map(r => ({ id: Date.now() + Math.random(), ...r })),
      ]);
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>

      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          height: 32, padding: '0 10px',
          fontFamily: SFT, fontSize: 13, fontWeight: activeCount > 0 ? 500 : 400,
          border: 'none', borderRadius: 6, cursor: 'pointer',
          background: btnActive ? 'var(--background-medium)' : 'transparent',
          color: activeCount > 0 ? 'var(--text)' : 'var(--text-weak)',
          transition: 'all 0.1s',
        }}
        onMouseEnter={e => { if (!btnActive) { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; } }}
        onMouseLeave={e => { if (!btnActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; } }}
      >
        <FilterBtnIcon />
        Filter
        {activeCount > 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 18, height: 18, padding: '0 4px', borderRadius: 4,
            fontSize: 11, fontWeight: 600, lineHeight: 1,
            background: 'var(--selected-background-strong)', color: 'var(--selected-text-strong)',
          }}>
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)',
          [align === 'left' ? 'left' : 'right']: 0,
          width: 560,
          background: 'var(--background-weak)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 50,
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
            <span style={{ fontFamily: SFT, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Filters</span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                style={{ fontFamily: SFT, fontSize: 13, color: 'var(--text-weak)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-weak)'; }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ padding: '0 20px 20px' }}>

            {/* Quick filters */}
            {quickFilters.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text-disabled)', letterSpacing: '0.03em', margin: '0 0 10px' }}>
                  Quick filters
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {quickFilters.map(qf => {
                    const active = isQuickActive(qf);
                    return (
                      <button
                        key={qf.id}
                        type="button"
                        onClick={() => toggleQuick(qf)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          height: 32, padding: '0 14px', borderRadius: 999,
                          fontFamily: SFT, fontSize: 13, cursor: 'pointer',
                          border: `1px solid ${active ? 'var(--selected-background-strong)' : 'var(--border)'}`,
                          background: active ? 'var(--selected-background)' : 'transparent',
                          color: active ? 'var(--selected-text)' : 'var(--text-weak)',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)'; } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-weak)'; } }}
                      >
                        {active && <CheckIcon />}
                        {qf.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All filters */}
            <div>
              {quickFilters.length > 0 && (
                <p style={{ fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text-disabled)', letterSpacing: '0.03em', margin: '0 0 12px' }}>
                  All filters
                </p>
              )}
              {filters.map(filter => (
                <FilterRow
                  key={filter.id}
                  filter={filter}
                  fields={fields}
                  onUpdate={updateFilter}
                  onRemove={removeFilter}
                />
              ))}
              <button
                type="button"
                onClick={addFilter}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 30, padding: '0 8px', marginTop: filters.length > 0 ? 4 : 0,
                  fontFamily: SFT, fontSize: 13, color: 'var(--text-weak)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderRadius: 6, transition: 'all 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
              >
                <PlusIcon />
                Add filter
                <ChevronDownIcon />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
