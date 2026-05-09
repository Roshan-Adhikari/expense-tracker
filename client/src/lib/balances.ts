import type { ExpenseRow } from './expenses'

/**
 * Net balance from current user's perspective with `friendId`.
 * Positive ⇒ friend owes you; negative ⇒ you owe friend.
 */
export function netBalanceWithFriend(myUserId: string, friendId: string, expenses: ExpenseRow[]): number {
  let net = 0

  for (const exp of expenses) {
    const shares = exp.expense_shares
    if (!shares?.length) continue

    const mine = shares.find((s) => s.user_id === myUserId)
    const theirs = shares.find((s) => s.user_id === friendId)
    if (!mine || !theirs) continue

    const paidBy = exp.paid_by_user_id
    const myShare = mine.share_amount
    const theirShare = theirs.share_amount

    // Requires payer to be one of the two for net between this pair (see Add expense UI).
    if (paidBy === myUserId) net += theirShare
    else if (paidBy === friendId) net -= myShare
  }

  return Math.round(net * 100) / 100
}
