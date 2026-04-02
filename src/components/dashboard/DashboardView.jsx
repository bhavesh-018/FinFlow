import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import {
  computeSummary, groupByMonth, groupByCategory, monthChange
} from '../../utils/helpers'
import SummaryCards    from './SummaryCards'
import BalanceTrend    from './BalanceTrend'
import SpendingBreakdown from './SpendingBreakdown'
import RecentActivity  from '../transactions/RecentActivity'
import styles from './DashboardView.module.css'

export default function DashboardView() {
  const { state } = useApp()
  const { transactions } = state

  const monthData    = useMemo(() => groupByMonth(transactions), [transactions])
  const categoryData = useMemo(() => groupByCategory(transactions), [transactions])

  // Summary over ALL data
  const summary = useMemo(() => computeSummary(transactions), [transactions])

  // Month-over-month change (last two months)
  const change = useMemo(() => {
    if (monthData.length < 2) return {}
    const prev = monthData[monthData.length - 2]
    const curr = monthData[monthData.length - 1]
    function pct(a, b) {
      if (!a) return null
      return Math.round(((b - a) / a) * 100)
    }
    return {
      income:  pct(prev.income,  curr.income),
      expense: pct(prev.expense, curr.expense),
      balance: pct(Math.abs(prev.balance), Math.abs(curr.balance)),
    }
  }, [monthData])

  return (
    <div className={styles.view}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSub}>Your financial overview at a glance</p>
      </div>

      <SummaryCards summary={summary} monthChange={change} />

      <div className={styles.charts}>
        <div className={styles.chartMain}>
          <BalanceTrend data={monthData} />
        </div>
        <div className={styles.chartSide}>
          <SpendingBreakdown data={categoryData} />
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}