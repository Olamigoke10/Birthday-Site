import { useState, useEffect, useRef } from 'react'

const SEED_ENTRIES = [
  {
    id: 'seed-1',
    name: 'Mia Clarke',
    relation: 'Best Friend',
    date: 'June 18, 2026',
    msg: 'To the woman who turns every ordinary Tuesday into something worth remembering — may this birthday be as luminous and extraordinary as you are. The world is simply lovelier with you in it.',
    polished: true,
  },
  {
    id: 'seed-2',
    name: 'James Rivera',
    relation: 'Family',
    date: 'June 18, 2026',
    msg: 'Watching you bloom into the remarkable person you are today has been one of the greatest joys of my life. Happy Birthday — here\'s to another year of adventures, laughter, and everything wonderful.',
    polished: true,
  },
  {
    id: 'seed-3',
    name: 'Amara Osei',
    relation: 'Colleague',
    date: 'June 18, 2026',
    msg: 'Your warmth and brilliance light up every room and every project we share. Wishing you a birthday filled with the same joy and energy you so generously give to everyone around you.',
    polished: true,
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
  const [entries,   setEntries]   = useState(SEED_ENTRIES)
  const [name,      setName]      = useState('')
  const [relation,  setRelation]  = useState('friend')
  const [message,   setMessage]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [preview,   setPreview]   = useState(null)   // polished text
  const [error,     setError]     = useState('')
  const sectionRef = useRef(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal') ?? []
    const io = new IntersectionObserver(entries =>
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('visible'); io.unobserve(target) }
      }), { threshold: 0.08 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relation, rawMessage: message }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setPreview(data.polished || message)
    } catch {
      // Graceful fallback: post raw message without polish badge
      postEntry(message, false)
      reset()
    } finally {
      setLoading(false)
    }
  }

  function postEntry(msg, wasPolished) {
    const relLabel = RELATIONS.find(r => r.value === relation)?.label ?? 'Guest'
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    setEntries(prev => [{
      id: Date.now().toString(),
      name: name.trim(),
      relation: relLabel,
      date,
      msg,
      polished: wasPolished,
    }, ...prev])
  }

  function reset() {
    setName(''); setRelation('friend'); setMessage(''); setPreview(null)
  }

  function confirmPost() {
    postEntry(preview, true)
    reset()
  }

  return (
    <section id="guestbook" ref={sectionRef} className="py-28 bg-cream-dark">
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-tag reveal">Leave your mark</p>
        <h2 className="section-title reveal">Guest <em className="italic text-rose">Book</em></h2>
        <p className="section-desc reveal">
          Share a birthday wish. Our AI will gently polish your words into something timeless — then you decide whether to post it.
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

            {error && <p className="text-rose text-sm mb-3">{error}</p>}

            {!preview && (
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 disabled:opacity-60">
                {loading ? 'Polishing your words…' : 'Polish & Post ✦'}
              </button>
            )}

            <p className="text-xs text-ink-muted italic mt-3">
              ✦ Your message will be beautifully refined by AI before posting.
            </p>

            {/* Preview */}
            {preview && (
              <div className="mt-5 p-5 rounded-2xl border border-blush-deep"
                style={{ background: 'linear-gradient(135deg, #fff5f5, #fde8f0)' }}>
                <h4 className="font-display text-lg text-rose-dark mb-3">Polished Preview</h4>
                <p className="italic text-ink leading-relaxed mb-4">"{preview}"</p>
                <div className="flex gap-3 flex-wrap">
                  <button type="button" onClick={() => setPreview(null)} className="btn-ghost text-sm px-5 py-2">
                    Edit Original
                  </button>
                  <button type="button" onClick={confirmPost} className="btn-primary text-sm px-5 py-2">
                    Post This ✦
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* ── ENTRIES ── */}
          <div className="flex flex-col gap-4 max-h-[680px] overflow-y-auto pr-1 reveal">
            {entries.map(entry => (
              <div key={entry.id} className="gb-entry bg-white rounded-2xl p-6 shadow-sm border-l-4 border-rose">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-rose-dark font-semibold text-base flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f9d5d3, #d4a5b5)' }}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-sm text-ink">{entry.name}</strong>
                    <span className="text-xs text-ink-muted capitalize">{entry.relation}</span>
                  </div>
                  <time className="ml-auto text-xs text-ink-muted">{entry.date}</time>
                </div>
                <p className="italic text-ink-soft leading-relaxed text-sm mb-2">"{entry.msg}"</p>
                {entry.polished && (
                  <span className="text-[.65rem] tracking-widest uppercase text-gold">✦ AI Polished</span>
                )}
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

/* Tailwind can't pick up dynamic class strings, so we define the input class in CSS */
