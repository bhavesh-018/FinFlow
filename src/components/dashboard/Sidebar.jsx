import { 
  BarChart3,
  Receipt,
  TrendingUp,
  Moon,
  Sun,
  ChevronRight 
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './Sidebar.module.css'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon:  BarChart3  },
  { id: 'transactions', label: 'Transactions',  Icon: Receipt    },
  { id: 'insights',     label: 'Insights',      Icon: TrendingUp },
]

export default function Sidebar() {
  const { state, dispatch } = useApp()

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <span>FB</span>
        </div>
        <div>
          <div className={styles.logoName}>FinBoard</div>
          <div className={styles.logoSub}>Finance Tracker</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`${styles.navItem} ${state.activeTab === id ? styles.active : ''}`}
            onClick={() => dispatch({ type: 'SET_TAB', payload: id })}
          >
            <Icon size={18} />
            <span>{label}</span>
            {state.activeTab === id && <ChevronRight size={14} className={styles.chevron} />}
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        {/* Role switcher */}
        <div className={styles.roleBox}>
          <span className={styles.roleLabel}>Role</span>
          <select
            className={styles.roleSelect}
            value={state.role}
            onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Theme toggle */}
        <button
          className={styles.themeBtn}
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          aria-label="Toggle theme"
        >
          {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{state.theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </aside>
  )
}