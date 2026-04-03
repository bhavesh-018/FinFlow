import {BarChart3, Receipt, TrendingUp, } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './MobileNav.module.css'
import { Bar } from 'recharts'

const TABS = [
  { id: 'dashboard',    label: 'Home',    Icon: BarChart3  },
  { id: 'transactions', label: 'Transactions',    Icon: Receipt   },
  { id: 'insights',     label: 'Insights',Icon: TrendingUp        },
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
