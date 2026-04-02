import { useApp } from '../../context/AppContext'
import { formatCurrency, formatShortDate } from '../../utils/helpers'
import { CATEGORY_COLORS } from '../../data/transactions'
import Badge from '../ui/Badge'
import styles from './RecentActivity.module.css'

export default function RecentActivity() {
  const { state, dispatch } = useApp()

  const recent = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <div className={`${styles.wrap} fade-up`} style={{ animationDelay: '240ms' }}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Recent Transactions</h3>
          <p className={styles.sub}>Last 6 activities</p>
        </div>
        <button
          className={styles.viewAll}
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className={styles.empty}>No transactions yet</div>
      ) : (
        <div className={styles.list}>
          {recent.map(tx => (
            <div key={tx.id} className={styles.row}>
              <div
                className={styles.catDot}
                style={{ background: CATEGORY_COLORS[tx.category] ?? 'var(--accent)' }}
              />
              <div className={styles.info}>
                <span className={styles.desc}>{tx.description}</span>
                <span className={styles.cat}>{tx.category}</span>
              </div>
              <div className={styles.right}>
                <span className={`${styles.amount} ${tx.type === 'income' ? styles.inc : styles.exp}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <span className={styles.date}>{formatShortDate(tx.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
