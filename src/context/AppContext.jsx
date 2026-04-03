import { createContext, useContext, useReducer, useEffect } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/transactions'

const AppContext = createContext(null)

const STORAGE_KEY = 'finboard_data'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function getInitialState() {
  const saved = loadFromStorage()
  return {
    transactions: saved?.transactions ?? INITIAL_TRANSACTIONS,
    role: saved?.role ?? 'viewer',       // 'viewer' | 'admin'
    theme: saved?.theme ?? 'dark',       // 'dark' | 'light'
    filters: {
      search: '',
      type: 'all',                       // 'all' | 'income' | 'expense'
      category: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date-desc',              // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
    },
    activeTab: 'dashboard',             // 'dashboard' | 'transactions' | 'insights'
    nextId: saved?.nextId ?? (INITIAL_TRANSACTIONS.length + 1),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }

    case 'SET_TAB':
      return { ...state, activeTab: action.payload }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          search: '',
          type: 'all',
          category: 'all',
          dateFrom: '',
          dateTo: '',
          sortBy: 'date-desc',
        },
      }

    case 'ADD_TRANSACTION': {
      const newTx = { ...action.payload, id: state.nextId }
      return {
        ...state,
        transactions: [newTx, ...state.transactions],
        nextId: state.nextId + 1,
      }
    }

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.id === action.payload.id ? { ...tx, ...action.payload } : tx
        ),
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(tx => tx.id !== action.payload),
      }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  // persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transactions: state.transactions,
          role: state.role,
          theme: state.theme,
          nextId: state.nextId,
        })
      )
    } catch {
      // storage quota exceeded or disabled — silently ignore
    }
  }, [state.transactions, state.role, state.theme, state.nextId])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}