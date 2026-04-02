import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CATEGORY_COLORS } from '../../data/transactions'
import { formatCurrency } from '../../utils/helpers'
import styles from './SpendingBreakdown.module.css'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <span style={{ color: CATEGORY_COLORS[d.name] ?? 'var(--accent)' }}>{d.name}</span>
      <span>{formatCurrency(d.value)} ({d.pct}%)</span>
    </div>
  )
}

export default function SpendingBreakdown({ data }) {
  const top = data.slice(0, 6)

  return (
    <div className={`${styles.wrap} fade-up`} style={{ animationDelay: '180ms' }}>
      <div className={styles.header}>
        <h3 className={styles.title}>Spending by Category</h3>
        <p className={styles.sub}>Where your money goes</p>
      </div>

      {top.length === 0 ? (
        <div className={styles.empty}>No expense data</div>
      ) : (
        <div className={styles.inner}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={top}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {top.map(entry => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] ?? 'var(--accent)'}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.list}>
            {top.map(item => (
              <div key={item.name} className={styles.listItem}>
                <div className={styles.listLeft}>
                  <span
                    className={styles.dot}
                    style={{ background: CATEGORY_COLORS[item.name] ?? 'var(--accent)' }}
                  />
                  <span className={styles.catName}>{item.name}</span>
                </div>
                <div className={styles.listRight}>
                  <span className={styles.catAmt}>{formatCurrency(item.value)}</span>
                  <span className={styles.catPct}>{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}