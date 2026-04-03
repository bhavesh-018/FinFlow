import { useMemo, useState, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, Plus, Pencil, Trash2, Download, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { applyFilters, formatCurrency, formatDate } from '../../utils/helpers'
import { CATEGORIES, CATEGORY_COLORS } from '../../data/transactions'
import Modal from '../ui/Modal'
import styles from './TransactionsList.module.css'

function exportCSV(transactions) {
  const header = 'Date,Description,Category,Type,Amount\n'
  const rows = transactions.map(t =>
    `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
  ).join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function TransactionList() {
  const { state, dispatch } = useApp()
  const { filters, transactions, role } = state
  const isAdmin = role === 'admin'

  const [showFilters, setShowFilters] = useState(false)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)
  const [toast, setToast] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
      function handleOutsideClick() {
        if (openMenuId !== null) {
          setOpenMenuId(null)
        }
      }

      document.addEventListener("click", handleOutsideClick)

      return () => {
        document.removeEventListener("click", handleOutsideClick)
      }
    }, [openMenuId])

  const filtered = useMemo(() => applyFilters(transactions, filters), [transactions, filters])

  function setFilter(patch) {
    dispatch({ type: 'SET_FILTER', payload: patch })
  }

  function openAdd() {
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(tx) {
    setEditTarget(tx)
    setModalOpen(true)
  }

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(""), 2500)
  }

  function handleSave(data) {
    if (editTarget) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...data, id: editTarget.id } })
      showToast("Transaction updated successfully")
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: data })
      showToast("Transaction added successfully")
    }
  }

  function handleDelete() {
    if (!deleteTarget) return

    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: deleteTarget.id
    })

    showToast("Transaction deleted successfully")
    setDeleteTarget(null)
  }

  const hasFilters = filters.search || filters.type !== 'all' ||
    filters.category !== 'all' || filters.dateFrom || filters.dateTo

  return (
    <div className={styles.view}>
      {toast && (
          <div className={styles.toast}>
            {toast}
          </div>
        )}
      <div className={styles.pageHeader}>
  <div>
    <h1 className={styles.pageTitle}>Transactions</h1>
    <p className={styles.pageSub}>
      {filtered.length} records {hasFilters ? '(filtered)' : ''}
    </p>
  </div>
</div>

<div className={styles.searchRow}>
  <div className={styles.searchWrap}>
    <Search size={15} className={styles.searchIcon} />
    <input
      className={styles.searchInput}
      placeholder="Search transactions..."
      value={filters.search}
      onChange={(e) => setFilter({ search: e.target.value })}
    />
    {filters.search && (
      <button
        className={styles.clearBtn}
        onClick={() => setFilter({ search: '' })}
      >
        <X size={13} />
      </button>
    )}
  </div>

  <div className={styles.searchActions}>
    <button
      className={`${styles.iconBtn} ${
        hasFilters ? styles.active : ''
      }`}
      onClick={() => setShowFilters((v) => !v)}
      title="Filters"
    >
      <SlidersHorizontal size={16} />
    </button>

    <button
      className={styles.iconBtn}
      onClick={() => exportCSV(filtered)}
      title="Export CSV"
    >
      <Download size={16} />
    </button>

    {isAdmin && (
      <button className={styles.addBtn} onClick={openAdd}>
        <Plus size={15} />
      </button>
    )}
  </div>
</div>

      {/* Filter panel */}
      {showFilters && (
        <div className={`${styles.filterPanel} fade-up`}>
          <div className={styles.filterRow}>
            <label className={styles.filterLabel}>Type</label>
            <div className={styles.pills}>
              {['all', 'income', 'expense'].map(t => (
                <button
                  key={t}
                  className={`${styles.pill} ${filters.type === t ? styles.pillActive : ''}`}
                  onClick={() => setFilter({ type: t })}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterRow}>
            <label className={styles.filterLabel}>Category</label>
            <select
              className={styles.select}
              value={filters.category}
              onChange={e => setFilter({ category: e.target.value })}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.filterRow}>
            <label className={styles.filterLabel}>Date range</label>
            <div className={styles.dateRange}>
              <input
                className={styles.dateInput}
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilter({ dateFrom: e.target.value })}
              />
              <span className={styles.dateSep}>—</span>
              <input
                className={styles.dateInput}
                type="date"
                value={filters.dateTo}
                onChange={e => setFilter({ dateTo: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.filterRow}>
            <label className={styles.filterLabel}>Sort by</label>
            <select
              className={styles.select}
              value={filters.sortBy}
              onChange={e => setFilter({ sortBy: e.target.value })}
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
          </div>

          {hasFilters && (
            <button
              className={styles.resetBtn}
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            >
              Reset filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No transactions match your filters.</p>
          {hasFilters && (
            <button
              className={styles.resetBtn}
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className={styles.tableWrap}>
  {/* Desktop table */}
  <div className={styles.desktopTable}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Type</th>
          <th className={styles.right}>Amount</th>
          {isAdmin && <th className={styles.center}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filtered.map((tx, i) => (
          <tr
            key={tx.id}
            className={styles.row}
            style={{ animationDelay: `${Math.min(i * 20, 300)}ms` }}
          >
            <td className={styles.dateCell}>{formatDate(tx.date)}</td>
            <td className={styles.descCell}>{tx.description}</td>
            <td>
              <span className={styles.catChip}
              style={{
                  background: (CATEGORY_COLORS[tx.category] ?? 'var(--accent)') + '22',
                  color: CATEGORY_COLORS[tx.category] ?? 'var(--accent)',
                }}>
                {tx.category}
              </span>
            </td>
            <td>
              <span className={`${styles.typePill} ${tx.type === 'income' ? styles.inc : styles.exp}`}>
                {tx.type === 'income' ? '↑' : '↓'} {tx.type}
              </span>
            </td>
            <td className={`${styles.right} ${styles.amount}`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </td>
            {isAdmin && (
              <td className={styles.center}>
                <div className={styles.rowActions}>
                  <button className={styles.editBtn} onClick={() => openEdit(tx)}>
                    <Pencil size={13} />
                  </button>
                  <button className={styles.deleteBtn} onClick={() => setDeleteTarget(tx)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Mobile list */}
  <div className={styles.mobileList}>
    {filtered.map((tx) => (
      <div key={tx.id} className={styles.mobileRow}>
        <div className={styles.mobileInfo}>
            <p className={styles.mobileName}>{tx.description}</p>

            <p className={styles.mobileMeta}>
              <span className={styles.mobileCategory} style={{
    color: CATEGORY_COLORS[tx.category] ?? 'var(--accent)',
  }}>
                {tx.category}
              </span>
              <span className={styles.mobileDot}>•</span>
              <span className={styles.mobileDate}>
                {formatDate(tx.date)}
              </span>
            </p>

            <p
              className={`${styles.mobilePrice} ${
                tx.type === 'income' ? styles.incAmt : ''
              }`}
            >
              {tx.type === 'income' ? '+' : '-'}
              {formatCurrency(tx.amount)}
            </p>
          </div>

        <div className={styles.mobileMenuWrap}>
          <button
            className={styles.mobileMenuBtn}
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === tx.id ? null : tx.id)
            }}
          >
            ⋮
          </button>

          {openMenuId === tx.id && (
            <div className={styles.mobileDropdown}>
              <button onClick={() => openEdit(tx)}>Edit</button>
              <button onClick={() => setDeleteTarget(tx)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
      )}
      
{deleteTarget && (
        <div className={styles.deleteOverlay}>
          <div className={styles.deleteModal}>
            <h3>Delete Transaction</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.description}</strong>?
            </p>

            <div className={styles.deleteActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmDeleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
    </div>
    
  )
}