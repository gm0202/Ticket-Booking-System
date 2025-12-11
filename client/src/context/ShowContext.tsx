import { createContext, useContext, useMemo, useReducer } from 'react';
import type { Booking } from '../types';

type SelectionState = Record<string, number[]>;

interface ShowState {
  selectedShowId?: string;
  selections: SelectionState;
  lastBooking?: Booking;
}

type Action =
  | { type: 'select-show'; showId: string }
  | { type: 'toggle-seat'; showId: string; seat: number }
  | { type: 'clear-selection'; showId: string }
  | { type: 'set-booking'; booking: Booking | undefined };

const initialState: ShowState = {
  selections: {},
};

function reducer(state: ShowState, action: Action): ShowState {
  switch (action.type) {
    case 'select-show':
      return { ...state, selectedShowId: action.showId };
    case 'toggle-seat': {
      const current = state.selections[action.showId] || [];
      const exists = current.includes(action.seat);
      const nextSeats = exists
        ? current.filter((s) => s !== action.seat)
        : [...current, action.seat].sort((a, b) => a - b);
      return {
        ...state,
        selections: { ...state.selections, [action.showId]: nextSeats },
      };
    }
    case 'clear-selection': {
      const next = { ...state.selections };
      delete next[action.showId];
      return { ...state, selections: next };
    }
    case 'set-booking':
      return { ...state, lastBooking: action.booking };
    default:
      return state;
  }
}

interface ShowContextValue {
  selectedShowId?: string;
  selectedSeats: (showId: string | number) => number[];
  toggleSeat: (showId: string | number, seat: number) => void;
  clearSelection: (showId: string | number) => void;
  setSelectedShow: (showId: string | number) => void;
  lastBooking?: Booking;
  setLastBooking: (booking: Booking | undefined) => void;
}

const ShowContext = createContext<ShowContextValue | undefined>(undefined);

export function ShowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<ShowContextValue>(
    () => ({
      selectedShowId: state.selectedShowId,
      selectedSeats: (showId) => state.selections[String(showId)] || [],
      toggleSeat: (showId, seat) =>
        dispatch({ type: 'toggle-seat', showId: String(showId), seat }),
      clearSelection: (showId) => dispatch({ type: 'clear-selection', showId: String(showId) }),
      setSelectedShow: (showId) => dispatch({ type: 'select-show', showId: String(showId) }),
      lastBooking: state.lastBooking,
      setLastBooking: (booking) => dispatch({ type: 'set-booking', booking }),
    }),
    [state],
  );

  return <ShowContext.Provider value={value}>{children}</ShowContext.Provider>;
}

export function useShowContext() {
  const ctx = useContext(ShowContext);
  if (!ctx) throw new Error('useShowContext must be used inside ShowProvider');
  return ctx;
}

