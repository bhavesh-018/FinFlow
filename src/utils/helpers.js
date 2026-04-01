import { MONTHS } from '../data/transactions'

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export function getMonthKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function getMonthLabel(key) {
  const [year, month] = key.split('-')
  return `${MONTHS[parseInt(month) - 1]} ${year.slice(2)}`
}

// Compute summary stats from transactions
export function computeSummary(transactions) {
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return {
    income,
    expense,
    balance: income - expense,
    savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
  }
}

// Group transactions by month, return array sorted ascending
export function groupByMonth(transactions) {
  const map = {}
  transactions.forEach(t => {
    const key = getMonthKey(t.date)
    if (!map[key]) map[key] = { key, label: getMonthLabel(key), income: 0, expense: 0 }
    if (t.type === 'income')  map[key].income  += t.amount
    if (t.type === 'expense') map[key].expense += t.amount
  })
  return Object.values(map)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(m => ({ ...m, balance: m.income - m.expense }))
}

// Group expenses by category
export function groupByCategory(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense')
  const map = {}
  expenses.forEach(t => {
    if (!map[t.category]) map[t.category] = 0
    map[t.category] += t.amount
  })
  const total = Object.values(map).reduce((s, v) => s + v, 0)
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name,
      value,
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
}

// Apply all active filters and sorting to transactions
export function applyFilters(transactions, filters) {
  let result = [...transactions]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
  }

  if (filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type)
  }

  if (filters.category !== 'all') {
    result = result.filter(t => t.category === filters.category)
  }

  if (filters.dateFrom) {
    result = result.filter(t => t.date >= filters.dateFrom)
  }

  if (filters.dateTo) {
    result = result.filter(t => t.date <= filters.dateTo)
  }

  switch (filters.sortBy) {
    case 'date-asc':    result.sort((a, b) => a.date.localeCompare(b.date));     break
    case 'date-desc':   result.sort((a, b) => b.date.localeCompare(a.date));     break
    case 'amount-desc': result.sort((a, b) => b.amount - a.amount);              break
    case 'amount-asc':  result.sort((a, b) => a.amount - b.amount);              break
    default:            result.sort((a, b) => b.date.localeCompare(a.date));
  }

  return result
}

// Compute month-over-month change
export function monthChange(monthData, field) {
  if (monthData.length < 2) return null
  const prev = monthData[monthData.length - 2][field]
  const curr = monthData[monthData.length - 1][field]
  if (prev === 0) return null
  return Math.round(((curr - prev) / prev) * 100)
}

// Generate a simple unique id for new transactions
export function newId() {
  return Date.now()
}