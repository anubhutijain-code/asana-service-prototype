// ─── AppStore — central mutable state with localStorage persistence ────────────
// All service-mode state changes flow through here.
// Components read via useAppStore(); dispatch actions to mutate.

import { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'asana-service-state-v1';

// ─── Initial state shape ──────────────────────────────────────────────────────

const initialState = {
  // { [ticketId]: { status?, priority?, routedToHR?, resolvedAt?, extraPublicComments?, extraInternalComments? } }
  ticketOverrides: {},
  // { [automationId]: boolean }
  automationStates: {},
  // { [gapId]: 'open' | 'done' | 'dismissed' }
  gapStatuses: {},
  // { [learningId]: 'new' | 'reviewed' | 'dismissed' }
  learningStatuses: {},
  // { [approvalId]: 'pending' | 'approved' | 'denied' }
  approvalStatuses: {},
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    return { ...initialState, ...JSON.parse(saved) };
  } catch {
    return initialState;
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    case 'UPDATE_TICKET': {
      const prev = state.ticketOverrides[action.id] ?? {};
      return {
        ...state,
        ticketOverrides: {
          ...state.ticketOverrides,
          [action.id]: { ...prev, ...action.patch },
        },
      };
    }

    case 'ADD_COMMENT': {
      const prev = state.ticketOverrides[action.id] ?? {};
      const key = action.tab === 'internal' ? 'extraInternalComments' : 'extraPublicComments';
      return {
        ...state,
        ticketOverrides: {
          ...state.ticketOverrides,
          [action.id]: {
            ...prev,
            [key]: [...(prev[key] ?? []), action.comment],
          },
        },
      };
    }

    case 'TOGGLE_AUTOMATION': {
      // Automations default to enabled (true); first toggle flips to false
      const current = state.automationStates[action.id];
      const next = current === undefined ? false : !current;
      return {
        ...state,
        automationStates: { ...state.automationStates, [action.id]: next },
      };
    }

    case 'SET_AUTOMATION': {
      return {
        ...state,
        automationStates: { ...state.automationStates, [action.id]: action.enabled },
      };
    }

    case 'UPDATE_GAP': {
      return {
        ...state,
        gapStatuses: { ...state.gapStatuses, [action.id]: action.status },
      };
    }

    case 'UPDATE_LEARNING': {
      return {
        ...state,
        learningStatuses: { ...state.learningStatuses, [action.id]: action.status },
      };
    }

    case 'UPDATE_APPROVAL': {
      return {
        ...state,
        approvalStatuses: { ...state.approvalStatuses, [action.id]: action.status },
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ─── Context + Provider ───────────────────────────────────────────────────────

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Sync to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }, [state]);

  return (
    <AppStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used inside <AppStoreProvider>');
  return ctx;
}
