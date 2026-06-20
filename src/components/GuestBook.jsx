import { useState } from 'react'

const SEED_ENTRIES = [
  {
    id: 'seed-1',
    name: 'Mia Clarke',
    relation: 'Best Friend',
    date: 'June 18, 2026',
    msg: 'To the woman who turns every ordinary Tuesday into something worth remembering — may this birthday be as luminous and extraordinary as you are. The world is simply lovelier with you in it.',
  },
  {
    id: 'seed-2',
    name: 'James Rivera',
    relation: 'Family',
    date: 'June 18, 2026',
    msg: "Watching you bloom into the remarkable person you are today has been one of the greatest joys of my life. Happy Birthday — here's to another year of adventures, laughter, and everything wonderful.",
  },
  {
    id: 'seed-3',
    name: 'Amara Osei',
    relation: 'Colleague',
    date: 'June 18, 2026',
    msg: 'Your warmth and brilliance light up every room and every project we share. Wishing you a birthday filled with the same joy and energy you so generously give to everyone around you.',
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

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    const relLabel = RELATIONS.find(r => r.value === relation)?.label ?? 'Guest'
    const date = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    setEntries(prev => [{
      id: Date.now().toString(),
      name: name.trim(),
      relation: relLabel,
      date,
      msg: message.trim(),
    }, ...prev])

    setName(''); setRelation('friend'); setMessage('')
  }

  return (
    <section id="guestbook" className="py-28 bg-cream-dark">
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-tag reveal">Leave your mark</p>
        <h2 className="section-title reveal">Guest <em className="italic text-rose">Book</em></h2>
        <p className="section-desc reveal">
          Share a birthday wish for Dara — a memory, a message, or something from the heart.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm reveal">
            <Field label="Your Name">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sarah M."
                required
                className="input-base"
              />
            </Field>

            <Field label="How do you know Dara?">
              <select value={relation} onChange={e => setRelation(e.target.value)} className="input-base">
                {RELATIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </Field>

            <Field label="Your Message">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                placeholder="Write a birthday wish, a memory, or something from the heart…"
                required
                className="input-base resize-y"
              />
            </Field>

            <button type="submit" className="btn-primary w-full justify-center mt-2">
              Post Message ✦
            </button>
          </form>

          {/* ── ENTRIES ── */}
          <div className="flex flex-col gap-4 max-h-[680px] overflow-y-auto pr-1 reveal">
            {entries.map(entry => (
              <div key={entry.id} className="gb-entry bg-white rounded-2xl p-6 shadow-sm border-l-4 border-rose">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-rose-dark font-semibold text-base flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f9d5d3, #d4a5b5)' }}
                  >
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-sm text-ink">{entry.name}</strong>
                    <span className="text-xs text-ink-muted capitalize">{entry.relation}</span>
                  </div>
                  <time className="ml-auto text-xs text-ink-muted">{entry.date}</time>
                </div>
                <p className="italic text-ink-soft leading-relaxed text-sm">"{entry.msg}"</p>
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
