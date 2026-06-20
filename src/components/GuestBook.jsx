import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SEED_ENTRIES = [
  {
    id: 'seed-1', name: 'Mia Clarke', relation: 'Best Friend', date: 'June 18, 2026',
    msg: 'To the woman who turns every ordinary Tuesday into something worth remembering — may this birthday be as luminous and extraordinary as you are.',
  },
  {
    id: 'seed-2', name: 'James Rivera', relation: 'Family', date: 'June 18, 2026',
    msg: "Watching you bloom into the remarkable person you are today has been one of the greatest joys of my life. Happy Birthday, Dara!",
  },
  {
    id: 'seed-3', name: 'Amara Osei', relation: 'Colleague', date: 'June 18, 2026',
    msg: 'Your warmth and brilliance light up every room. Wishing you a birthday filled with the same joy and energy you give to everyone around you.',
  },
]

const RELATIONS = [
  { value: 'friend',    label: 'Friend' },
  { value: 'family',    label: 'Family' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'partner',   label: 'Partner / S.O.' },
  { value: 'other',     label: 'Other' },
]

export default function GuestBook() {
  const [entries,  setEntries]  = useState(SEED_ENTRIES)
  const [name,     setName]     = useState('')
  const [relation, setRelation] = useState('friend')
  const [message,  setMessage]  = useState('')
  const [saving,   setSaving]   = useState(false)
  const [loaded,   setLoaded]   = useState(false)

  /* ── Fetch saved messages from Supabase ── */
  useEffect(() => {
    if (!supabase) return
    supabase
      .from('guest_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setEntries(data.map(d => ({
            id:       d.id,
            name:     d.name,
            relation: d.relation,
            date:     new Date(d.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            }),
            msg: d.message,
          })))
        }
        setLoaded(true)
      })
  }, [])

  /* ── Real-time updates ── */
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('guest_messages_live')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guest_messages' },
        ({ new: row }) => {
          setEntries(prev => {
            if (prev.find(e => e.id === row.id)) return prev
            return [{
              id:       row.id,
              name:     row.name,
              relation: row.relation,
              date:     new Date(row.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              }),
              msg: row.message,
            }, ...prev]
          })
        })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    const relLabel = RELATIONS.find(r => r.value === relation)?.label ?? 'Guest'
    const date     = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    const newEntry = {
      id:       Date.now().toString(),
      name:     name.trim(),
      relation: relLabel,
      date,
      msg:      message.trim(),
    }

    setSaving(true)

    if (supabase) {
      const { error } = await supabase.from('guest_messages').insert({
        name:     name.trim(),
        relation: relLabel,
        message:  message.trim(),
      })
      if (!error) {
        /* Real-time subscription will add it — only add locally if no realtime */
      } else {
        setEntries(prev => [newEntry, ...prev])
      }
    } else {
      setEntries(prev => [newEntry, ...prev])
    }

    setSaving(false)
    setName(''); setRelation('friend'); setMessage('')
  }

  return (
    <section className="slide-section guestbook-slide">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col h-full">

        {/* Header */}
        <div className="pt-24 pb-6 flex-shrink-0">
          <p className="section-tag reveal-slide">Leave your mark</p>
          <h2 className="section-title reveal-slide">
            Guest <em className="italic text-rose">Book</em>
          </h2>
          <p className="text-sm text-ink-soft max-w-lg reveal-slide">
            Share a birthday wish for Dara — a memory, a kind word, or something from the heart.
            {!supabase && (
              <span className="block mt-1 text-ink-muted text-xs">
                (Messages saved locally — connect Supabase to persist across visitors)
              </span>
            )}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 flex-1 pb-24 min-h-0">

          {/* Form */}
          <form onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4 reveal-slide self-start">
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
                rows={4} placeholder="Write something from the heart…"
                required className="input-base resize-none" />
            </Field>
            <button type="submit" disabled={saving}
              className="btn-primary justify-center disabled:opacity-60">
              {saving ? 'Saving…' : 'Post Message ✦'}
            </button>
          </form>

          {/* Entries */}
          <div className="entries-scroll reveal-slide">
            {entries.map(entry => (
              <div key={entry.id} className="gb-entry bg-white rounded-2xl p-5 shadow-sm border-l-4 border-rose">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-rose-dark font-semibold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#f9d5d3,#d4a5b5)' }}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-sm text-ink leading-tight">{entry.name}</strong>
                    <span className="text-xs text-ink-muted">{entry.relation}</span>
                  </div>
                  <time className="text-xs text-ink-muted flex-shrink-0">{entry.date}</time>
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
    <div>
      <label className="block text-xs font-medium tracking-widest uppercase text-ink-soft mb-1.5">{label}</label>
      {children}
    </div>
  )
}
