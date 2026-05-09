import { getSupabase } from './supabase'

export type ExpenseShareRow = {
  expense_id: string
  user_id: string
  share_amount: number
}

export type ExpenseRow = {
  id: string
  user_id: string
  paid_by_user_id: string
  title: string
  amount: number
  currency: string
  category: string
  split_type: string
  notes: string | null
  expense_date: string
  created_at: string
  expense_shares?: ExpenseShareRow[]
}

function normalizeNum(raw: unknown): number {
  if (typeof raw === 'number') return raw
  if (typeof raw === 'string') return parseFloat(raw)
  return Number(raw)
}

function normalizeExpense(row: Record<string, unknown>): ExpenseRow {
  const sharesRaw = row.expense_shares as Record<string, unknown>[] | undefined
  const expense_shares = sharesRaw?.map((s) => ({
    expense_id: s.expense_id as string,
    user_id: s.user_id as string,
    share_amount: normalizeNum(s.share_amount),
  }))

  return {
    ...(row as unknown as ExpenseRow),
    amount: normalizeNum(row.amount),
    paid_by_user_id: (row.paid_by_user_id as string) ?? (row.user_id as string),
    expense_shares,
  }
}

export async function fetchExpenses(): Promise<ExpenseRow[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('expenses')
    .select('*, expense_shares(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((r) => normalizeExpense(r as Record<string, unknown>))
}

export async function fetchExpenseById(id: string): Promise<ExpenseRow | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('expenses')
    .select('*, expense_shares(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return normalizeExpense(data as Record<string, unknown>)
}

export type NewExpenseInput = {
  user_id: string
  paid_by_user_id: string
  title: string
  amount: number
  currency: string
  category: string
  split_type: string
  notes: string | null
  expense_date: string
}

export async function insertExpenseWithShares(
  input: NewExpenseInput,
  shares: { user_id: string; share_amount: number }[],
): Promise<ExpenseRow> {
  const supabase = getSupabase()
  const { data: exp, error } = await supabase
    .from('expenses')
    .insert({
      user_id: input.user_id,
      paid_by_user_id: input.paid_by_user_id,
      title: input.title,
      amount: input.amount,
      currency: input.currency,
      category: input.category,
      split_type: input.split_type,
      notes: input.notes,
      expense_date: input.expense_date,
    })
    .select('*')
    .single()

  if (error) throw error

  const expenseId = exp.id as string
  const rows = shares.map((s) => ({
    expense_id: expenseId,
    user_id: s.user_id,
    share_amount: s.share_amount,
  }))

  const { error: shareErr } = await supabase.from('expense_shares').insert(rows)
  if (shareErr) throw shareErr

  const full = await fetchExpenseById(expenseId)
  if (!full) throw new Error('Expense created but could not reload.')
  return full
}

/** Equal split across participant ids; fixes rounding on last participant. */
export function equalShares(total: number, participantIds: string[]): { user_id: string; share_amount: number }[] {
  const n = participantIds.length
  if (n === 0) return []
  const cents = Math.round(total * 100)
  const base = Math.floor(cents / n)
  const remainder = cents - base * n
  return participantIds.map((user_id, i) => ({
    user_id,
    share_amount: (base + (i < remainder ? 1 : 0)) / 100,
  }))
}
