/** Placeholder aggregates until Supabase + API are wired. */
export const demoBalances = {
  youOwe: 1240.5,
  owedToYou: 890.0,
  currency: 'INR' as const,
}

export const demoRecent = [
  {
    id: '1',
    title: 'Dinner at Olive',
    amount: 3200,
    currency: 'INR',
    group: 'Weekend Trip',
    when: '2h ago',
  },
  {
    id: '2',
    title: 'Uber split',
    amount: 450,
    currency: 'INR',
    group: 'Flatmates',
    when: 'Yesterday',
  },
  {
    id: '3',
    title: 'Groceries',
    amount: 2100,
    currency: 'INR',
    group: 'Flatmates',
    when: '3 days ago',
  },
] as const

export const demoGroups = [
  { id: 'g1', name: 'Weekend Trip', emoji: '🏕️', balance: -420 },
  { id: 'g2', name: 'Flatmates', emoji: '🏠', balance: 180 },
] as const

export const demoFriends = [
  { id: 'f1', name: 'Alex Kumar', email: 'alex@example.com', balance: -120 },
  { id: 'f2', name: 'Sam Rao', email: 'sam@example.com', balance: 340 },
] as const
