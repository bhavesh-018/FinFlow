import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './MobileNav.module.css'

const TABS = [
  { id: 'dashboard',    label: 'Home',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',    Icon: ArrowLeftRight   },
  { id: 'insights',     label: 'Insights',Icon: Lightbulb        },
]

export default function MobileNav() {
  const { state, dispatch } = useApp()

  return (
    <nav className={styles.nav}>
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`${styles.tab} ${state.activeTab === id ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'SET_TAB', payload: id })}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
