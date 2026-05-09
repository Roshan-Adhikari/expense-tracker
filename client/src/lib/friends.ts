import { getSupabase } from './supabase'

export type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
}

export type FriendWithProfile = {
  friend_user_id: string
  profile: ProfileRow | null
}

/** Friend connections where user_id is the current user (other column is the friend). */
export async function fetchFriends(myUserId: string): Promise<FriendWithProfile[]> {
  const supabase = getSupabase()
  const { data: links, error } = await supabase
    .from('friends')
    .select('friend_user_id')
    .eq('user_id', myUserId)

  if (error) throw error
  const ids = (links ?? []).map((r) => r.friend_user_id as string)
  if (ids.length === 0) return []

  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').in('id', ids)
  if (pErr) throw pErr

  const byId = new Map((profiles ?? []).map((p) => [p.id as string, p as ProfileRow]))
  return ids.map((friend_user_id) => ({
    friend_user_id,
    profile: byId.get(friend_user_id) ?? null,
  }))
}

export async function lookupProfileByEmail(email: string): Promise<ProfileRow | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('lookup_profile_by_email', {
    search_email: email.trim(),
  })

  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return null
  return {
    id: row.profile_id as string,
    email: row.email as string | null,
    full_name: row.full_name as string | null,
  }
}

/** Link two accounts immediately, or save a pending invite if no account exists yet. */
export async function addFriendByEmail(myUserId: string, rawEmail: string): Promise<
  | { kind: 'linked'; profile: ProfileRow }
  | { kind: 'pending'; email: string }
  | { kind: 'self' }
  | { kind: 'already' }
> {
  const email = rawEmail.trim().toLowerCase()
  if (!email) throw new Error('Enter an email.')

  const supabase = getSupabase()

  const { data: me } = await supabase.from('profiles').select('email').eq('id', myUserId).maybeSingle()
  const myEmail = ((me?.email as string) ?? '').toLowerCase()
  if (email === myEmail) return { kind: 'self' }

  const existing = await lookupProfileByEmail(email)
  if (existing) {
    if (existing.id === myUserId) return { kind: 'self' }

    const { data: dup } = await supabase
      .from('friends')
      .select('friend_user_id')
      .eq('user_id', myUserId)
      .eq('friend_user_id', existing.id)
      .maybeSingle()

    if (dup) return { kind: 'already' }

    const { error: e1 } = await supabase.from('friends').insert([
      { user_id: myUserId, friend_user_id: existing.id },
      { user_id: existing.id, friend_user_id: myUserId },
    ])
    if (e1) throw e1
    return { kind: 'linked', profile: existing }
  }

  const { error: invErr } = await supabase.from('friend_invites').insert({
    inviter_id: myUserId,
    invitee_email: email,
    status: 'pending',
  })
  if (invErr) {
    if (invErr.code === '23505') throw new Error('You already invited this email.')
    throw invErr
  }

  return { kind: 'pending', email }
}
