import { Moon, Sun } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './MobileHeader.module.css'

export default function MobileHeader() {
  const { state, dispatch } = useApp()

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>FB</div>
        <span className={styles.logoName}>FinBoard</span>
      </div>
      <div className={styles.right}>
        <select
          className={styles.roleSelect}
          value={state.role}
          onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className={styles.themeBtn}
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
        >
          {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
