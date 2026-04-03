import { useEffect } from 'react'
import { useApp } from './context/AppContext'
import Sidebar          from './components/dashboard/Sidebar'
import MobileNav        from './components/dashboard/MobileNav'
import MobileHeader     from './components/dashboard/MobileHeader'
import DashboardView    from './components/dashboard/DashboardView'
import TransactionsList  from './components/transactions/TransactionsList'
import InsightsPanel    from './components/insights/InsightsPanel'
import styles from './App.module.css'

function TabContent({ tab }) {
  switch (tab) {
    case 'dashboard':    return <DashboardView />
    case 'transactions': return <TransactionsList />
    case 'insights':     return <InsightsPanel />
    default:             return <DashboardView />
  }
}

export default function App() {
  const { state } = useApp()

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.main}>
        <MobileHeader />
        <div className={styles.content}>
          <TabContent tab={state.activeTab} />
        </div>
      </div>
      <MobileNav />
    </div>
  )
}