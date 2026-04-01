import styles from './Badge.module.css'

export default function Badge({ type }) {
  return (
    <span className={`${styles.badge} ${type === 'income' ? styles.income : styles.expense}`}>
      {type === 'income' ? '↑ Income' : '↓ Expense'}
    </span>
  )
}