// ─── useTickets — live ticket array with overrides merged in ──────────────────
// Reads TICKETS from mock data, overlays any mutations from the store.
// Always use this instead of importing TICKETS directly in components.

import { TICKETS } from '../data/tickets';
import { useAppStore } from './AppStore';

export function useTickets() {
  const { state } = useAppStore();
  const { ticketOverrides } = state;

  return TICKETS.map(t => {
    const override = ticketOverrides[t.id];
    if (!override) return t;

    const { extraPublicComments, extraInternalComments, ...statusOverrides } = override;

    return {
      ...t,
      ...statusOverrides,
      initPublic: extraPublicComments?.length
        ? [...(t.initPublic ?? []), ...extraPublicComments]
        : t.initPublic,
      initInternal: extraInternalComments?.length
        ? [...(t.initInternal ?? []), ...extraInternalComments]
        : t.initInternal,
    };
  });
}

// Single ticket by id
export function useTicket(id) {
  const tickets = useTickets();
  return tickets.find(t => t.id === id) ?? null;
}
