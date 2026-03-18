// ─── useTicketStats — live KPI counts derived from ticket store ───────────────
// Used by Dashboard and Home to show numbers that actually reflect state changes.

import { useTickets } from './useTickets';
import { useAppStore } from './AppStore';

const RESOLVED_STATUSES = new Set(['Resolved', 'Closed']);

export function useTicketStats() {
  const tickets = useTickets();
  const { state } = useAppStore();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTs = todayStart.getTime();

  const open   = tickets.filter(t => !RESOLVED_STATUSES.has(t.status));
  const urgent = open.filter(t => t.priority === 'Critical' || t.priority === 'Urgent');

  // Count tickets explicitly resolved today via the store
  const resolvedToday = Object.values(state.ticketOverrides)
    .filter(o => o.resolvedAt && o.resolvedAt >= todayTs && RESOLVED_STATUSES.has(o.status))
    .length;

  const slaBreached = open.filter(t => t.slaType === 'warning').length;

  // Automation coverage: % of automations currently enabled
  const autoEntries = Object.values(state.automationStates);
  const autoEnabled = autoEntries.filter(Boolean).length;
  // Default: all automations are enabled; only count overrides as disabled
  const autoDisabled = autoEntries.filter(v => v === false).length;

  return {
    totalOpen:      open.length,
    urgent:         urgent.length,
    resolvedToday,
    slaBreached,
    total:          tickets.length,
    autoDisabled,   // how many have been explicitly turned off
  };
}
