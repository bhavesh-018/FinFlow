import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import styles from './BalanceTrend.module.css'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className={styles.tooltipRow}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function BalanceTrend({ data }) {
  return (
    <div className={`${styles.wrap} fade-up`} style={{ animationDelay: '120ms' }}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Balance Trend</h3>
          <p className={styles.sub}>Income vs expenses over time</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className={styles.empty}>No data to display</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--red)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
              width={46}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="var(--green)"
              strokeWidth={2}
              fill="url(#gradIncome)"
              dot={false}
              activeDot={{ r: 5, fill: 'var(--green)', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="var(--red)"
              strokeWidth={2}
              fill="url(#gradExpense)"
              dot={false}
              activeDot={{ r: 5, fill: 'var(--red)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div className={styles.legend}>
        <span className={styles.legendItem}><i style={{ background: 'var(--green)' }} /> Income</span>
        <span className={styles.legendItem}><i style={{ background: 'var(--red)' }} /> Expense</span>
      </div>
    </div>
  )
}