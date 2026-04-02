import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import styles from './SummaryCards.module.css'

export default function SummaryCards({ summary, monthChange }) {
  const cards = [
    {
      label:   'Total Balance',
      value:   summary.balance,
      icon:    Wallet,
      color:   summary.balance >= 0 ? 'green' : 'red',
      change:  monthChange?.balance,
      prefix:  '',
    },
    {
      label:   'Monthly Income',
      value:   summary.income,
      icon:    TrendingUp,
      color:   'green',
      change:  monthChange?.income,
    },
    {
      label:   'Monthly Expenses',
      value:   summary.expense,
      icon:    TrendingDown,
      color:   'red',
      change:  monthChange?.expense,
      invert:  true,   // lower expense = good
    },
    {
      label:   'Savings Rate',
      value:   null,
      display: `${summary.savingsRate}%`,
      icon:    PiggyBank,
      color:   summary.savingsRate >= 30 ? 'green' : summary.savingsRate >= 15 ? 'amber' : 'red',
    },
  ]

  return (
    <div className={styles.grid}>
      {cards.map((card, i) => {
        const Icon = card.icon
        const changeVal = card.change
        const isPositive = card.invert ? changeVal < 0 : changeVal > 0
        const isNeutral  = changeVal === 0 || changeVal == null

        return (
          <div
            key={card.label}
            className={`${styles.card} fade-up`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={styles.top}>
              <span className={styles.label}>{card.label}</span>
              <span className={`${styles.iconWrap} ${styles[card.color]}`}>
                <Icon size={16} />
              </span>
            </div>

            <div className={styles.value}>
              {card.display ?? formatCurrency(card.value)}
            </div>

            {!isNeutral && (
              <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                {changeVal > 0 ? '▲' : '▼'} {Math.abs(changeVal)}% vs last month
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}