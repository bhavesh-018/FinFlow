import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { useApp } from '../../context/AppContext'
import {
  groupByMonth, groupByCategory, computeSummary, formatCurrency
} from '../../utils/helpers'
import { CATEGORY_COLORS } from '../../data/transactions'
import styles from './InsightsPanel.module.css'

function StatCard({ label, value, sub, color }) {
  return (
    <div className={styles.statCard} style={{ borderColor: color + '44' }}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue} style={{ color }}>{value}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  )
}

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className={styles.tooltipRow}>
          <span style={{ color: p.fill }}>{p.name}</span>
          <span>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function InsightsPanel() {
  const { state } = useApp()
  const { transactions } = state

  const monthData    = useMemo(() => groupByMonth(transactions), [transactions])
  const categoryData = useMemo(() => groupByCategory(transactions), [transactions])
  const summary      = useMemo(() => computeSummary(transactions), [transactions])

  const topCategory    = categoryData[0]
  const lowestCategory = categoryData[categoryData.length - 1]

  // Last two months comparison
  const lastTwo = monthData.slice(-2)
  const currMonth = lastTwo[lastTwo.length - 1]
  const prevMonth = lastTwo.length > 1 ? lastTwo[0] : null

  const spendingDelta = prevMonth
    ? Math.round(((currMonth.expense - prevMonth.expense) / prevMonth.expense) * 100)
    : null

  const avgMonthlyExpense = monthData.length
    ? Math.round(monthData.reduce((s, m) => s + m.expense, 0) / monthData.length)
    : 0

  const avgMonthlyIncome = monthData.length
    ? Math.round(monthData.reduce((s, m) => s + m.income, 0) / monthData.length)
    : 0

  return (
    <div className={styles.view}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Insights</h1>
        <p className={styles.pageSub}>Patterns and observations from your data</p>
      </div>

      {/* Stat row */}
      <div className={styles.statGrid}>
        <StatCard
          label="Top Spending Category"
          value={topCategory?.name ?? '—'}
          sub={topCategory ? `${formatCurrency(topCategory.value)} (${topCategory.pct}% of expenses)` : ''}
          color={topCategory ? CATEGORY_COLORS[topCategory.name] ?? 'var(--accent)' : 'var(--accent)'}
        />
        <StatCard
          label="Savings Rate"
          value={`${summary.savingsRate}%`}
          sub={summary.savingsRate >= 20 ? '✓ Healthy savings habit' : 'Try to aim for 20%+'}
          color={summary.savingsRate >= 20 ? 'var(--green)' : 'var(--amber)'}
        />
        <StatCard
          label="Avg Monthly Spend"
          value={formatCurrency(avgMonthlyExpense)}
          sub={`Avg income: ${formatCurrency(avgMonthlyIncome)}`}
          color="var(--accent)"
        />
        {spendingDelta !== null && (
          <StatCard
            label="Spending vs Last Month"
            value={`${spendingDelta > 0 ? '+' : ''}${spendingDelta}%`}
            sub={spendingDelta > 0 ? 'Spending increased' : 'Spending decreased — good!'}
            color={spendingDelta > 0 ? 'var(--red)' : 'var(--green)'}
          />
        )}
      </div>

      {/* Monthly comparison bar chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Monthly Comparison</h3>
          <p className={styles.chartSub}>Income vs expenses by month</p>
        </div>
        {monthData.length === 0 ? (
          <div className={styles.empty}>No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
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
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="income"  name="Income"  fill="var(--green)" radius={[4,4,0,0]} maxBarSize={36} />
              <Bar dataKey="expense" name="Expense" fill="var(--red)"   radius={[4,4,0,0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category breakdown */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Category Breakdown</h3>
          <p className={styles.chartSub}>Total spend per category</p>
        </div>
        {categoryData.length === 0 ? (
          <div className={styles.empty}>No expense data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="value" name="Spent" radius={[0,4,4,0]} maxBarSize={20}>
                {categoryData.map(entry => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] ?? 'var(--accent)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}