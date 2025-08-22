import { supabase } from './supabaseClient'

export type RealtimeTable = 'kpi' | 'tasks' | 'attendance' | 'shifts' | 'penalties' | 'reports'

export function subscribeToTables(
  tables: RealtimeTable[],
  onChange: (payload: unknown) => void
): () => void {
  const channel = supabase.channel('realtime:app')

  tables.forEach((table) => {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => {
        const next = (payload as { new?: unknown })?.new
        onChange(next ?? payload)
      }
    )
  })

  channel.subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}


