import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const RELATIONS = [
  { value: 'friend',    label: 'Friend' },
  { value: 'family',    label: 'Family' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'partner',   label: 'Partner / S.O.' },
  { value: 'other',     label: 'Other' },
]

function toEntry(row) {
  return {
    id:       row.id,
    name:     row.name,
    relation: row.relation,
    date:     new Date(row.created_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    msg: row.message,
  }
}

export default function GuestBook() {
  const [entries,  setEntries]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [name,     setName]     = useState('')
  const [relation, setRelation] = useState('friend')
  const [message,  setMessage]  = useState('')
  const [saving,   setSaving]   = useState(false)

  /* ── Load messages from Supabase on mount ── */
  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase
      .from('guest_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setEntries(data.map(toEntry))
        setLoading(false)
      })
  }, [])

  /* ── Real-time: insert new rows from OTHER visitors ── */
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('guest_messages_live')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guest_messages' },
        ({ new: row }) => {
          setEntries(prev =>
            prev.find(e => e.id === row.id) ? prev : [toEntry(row), ...prev]
          )
        })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    const relLabel = RELATIONS.find(r => r.value === relation)?.label ?? 'Guest'
    setSaving(true)

    if (supabase) {
      /* Save to DB — the real-time subscription will add it to the list */
      const { data, error } = await supabase
        .from('guest_messages')
        .insert({ name: name.trim(), relation: relLabel, message: message.trim() })
        .select()
        .single()

      if (!error && data) {
        /* Optimistically add immediately in case real-time is slow */
        setEntries(prev =>
          prev.find(e => e.id === data.id) ? prev : [toEntry(data), ...prev]
        )
      }
    } else {
      /* No Supabase — add to local state (won't persist across reloads) */
      setEntries(prev => [{
        id:       Date.now().toString(),
        name:     name.trim(),
        relation: relLabel,
        date:     new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        msg:      message.trim(),
      }, ...prev])
    }

    setSaving(false)
    setName(''); setRelation('friend'); setMessage('')
  }

  return (
    <section id="guestbook" className="py-28 bg-cream-dark">
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-tag reveal">Leave your mark</p>
        <h2 className="section-title reveal">Guest <em className="italic text-rose">Book</em></h2>
        <p className="section-desc reveal">
          Share a birthday wish for Dara — a memory, a kind word, or something from the heart.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Form */}
          <form onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 shadow-sm reveal">
            <Field label="Your Name">
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Sarah M." required className="input-base" />
            </Field>
            <Field label="How do you know Dara?">
              <select value={relation} onChange={e => setRelation(e.target.value)} className="input-base">
                {RELATIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </Field>
            <Field label="Your Message">
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                rows={5} placeholder="Write something from the heart…"
                required className="input-base resize-y" />
            </Field>
            <button type="submit" disabled={saving}
              className="btn-primary w-full justify-center mt-4 disabled:opacity-60">
              {saving ? 'Saving…' : 'Post Message ✦'}
            </button>
          </form>

          {/* Entries */}
          <div className="flex flex-col gap-4 max-h-[680px] overflow-y-auto pr-1 reveal">
            {loading && (
              <p className="text-sm text-ink-muted italic text-center py-8">Loading messages…</p>
            )}
            {!loading && entries.length === 0 && (
              <p className="text-sm text-ink-muted italic text-center py-8">
                Be the first to leave a message for Dara ✦
              </p>
            )}
            {entries.map(entry => (
              <div key={entry.id} className="gb-entry bg-white rounded-2xl p-6 shadow-sm border-l-4 border-rose">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-rose-dark font-semibold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#f9d5d3,#d4a5b5)' }}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-sm text-ink">{entry.name}</strong>
                    <span className="text-xs text-ink-muted">{entry.relation}</span>
                  </div>
                  <time className="text-xs text-ink-muted">{entry.date}</time>
                </div>
                <p className="italic text-ink-soft text-sm leading-relaxed">"{entry.msg}"</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-medium tracking-widest uppercase text-ink-soft mb-2">{label}</label>
      {children}
    </div>
  )
}
