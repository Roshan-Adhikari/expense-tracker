import { getSupabase } from './supabase'

export type ExpenseRow = {
  id: string
  user_id: string
  title: string
  amount: number
  currency: string
  category: string
  split_type: string
  notes: string | null
  expense_date: string
  created_at: string
}

function normalizeExpense(row: Record<string, unknown>): ExpenseRow {
  const raw = row.amount
  const amount =
    typeof raw === 'number' ? raw : typeof raw === 'string' ? parseFloat(raw) : Number(raw)
  return {
    ...row,
    amount,
  } as ExpenseRow
}

export async function fetchExpenses(): Promise<ExpenseRow[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((r) => normalizeExpense(r as Record<string, unknown>))
}

export async function fetchExpenseById(id: string): Promise<ExpenseRow | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('expenses').select('*').eq('id', id).maybeSingle()

  if (error) throw error
  if (!data) return null
  return normalizeExpense(data as Record<string, unknown>)
}

export type NewExpenseInput = {
  user_id: string
  title: string
  amount: number
  currency: string
  category: string
  split_type: string
  notes: string | null
  expense_date: string
}

export async function insertExpense(input: NewExpenseInput): Promise<ExpenseRow> {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('expenses').insert(input).select('*').single()

  if (error) throw error
  return normalizeExpense(data as Record<string, unknown>)
}
