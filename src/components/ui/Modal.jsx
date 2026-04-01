import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../../data/transactions'
import styles from './Modal.module.css'

const EMPTY = {
  description: '',
  amount: '',
  category: CATEGORIES[0],
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
}

export default function Modal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const firstRef = useRef(null)

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial, amount: String(initial.amount) } : EMPTY)
      setErrors({})
      setTimeout(() => firstRef.current?.focus(), 50)
    }
  }, [open, initial])

  // trap focus & close on Escape
  useEffect(() => {
    if (!open) return
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.description.trim()) errs.description = 'Required'
    const amt = parseFloat(form.amount)
    if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid amount'
    if (!form.date) errs.date = 'Required'
    return errs
  }

  function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ ...form, amount: parseFloat(form.amount) })
    onClose()
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`${styles.modal} fade-up`} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>{initial ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.typeRow}>
            {['expense', 'income'].map(t => (
              <button
                key={t}
                className={`${styles.typeBtn} ${form.type === t ? styles[`type_${t}`] : ''}`}
                onClick={() => set('type', t)}
              >
                {t === 'income' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>

          <Field label="Description" error={errors.description}>
            <input
              ref={firstRef}
              className={styles.input}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="e.g. Zomato lunch"
            />
          </Field>

          <div className={styles.row}>
            <Field label="Amount (₹)" error={errors.amount}>
              <input
                className={styles.input}
                type="number"
                min="1"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Date" error={errors.date}>
              <input
                className={styles.input}
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Category">
            <select
              className={styles.input}
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>
            {initial ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
    </div>
  )
}