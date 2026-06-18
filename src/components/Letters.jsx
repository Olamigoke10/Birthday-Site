import { useEffect, useRef } from 'react'

const LETTERS = [
  {
    id: 1,
    title: 'The First Hello',
    date: 'March 14, 2022',
    preview: '"From the moment I saw you, I knew some stories are written in the stars…"',
    img: '/assets/letters/letter-1.jpg',
  },
  {
    id: 2,
    title: 'When You Laughed',
    date: 'July 4, 2022',
    preview: '"Your laugh is the most beautiful sound in any room you\'re ever in…"',
    img: '/assets/letters/letter-2.jpg',
  },
  {
    id: 3,
    title: 'A Year of Us',
    date: 'December 31, 2022',
    preview: '"Twelve months of mornings beside you — I\'d choose every single one again…"',
    img: '/assets/letters/letter-3.jpg',
  },
  {
    id: 4,
    title: 'On Your Birthday',
    date: 'June 18, 2025',
    preview: '"You grow more beautiful with every year — inside and out, always…"',
    img: '/assets/letters/letter-4.jpg',
  },
]

// Gradient fallbacks when image is missing
const FALLBACKS = [
  'linear-gradient(135deg,#fde8e8,#f5d0d0)',
  'linear-gradient(135deg,#f0e6f6,#d4a9d4)',
  'linear-gradient(135deg,#fef3cd,#f5cba7)',
  'linear-gradient(135deg,#fde8f0,#e8b4b8)',
]

export default function Letters() {
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

  return (
    <section id="letters" ref={sectionRef} className="py-28 bg-cream-dark">
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-tag reveal">Written with love</p>
        <h2 className="section-title reveal">Handwritten <em className="italic text-rose">Letters</em></h2>
        <p className="section-desc reveal">
          Words from the heart, penned in ink — each letter a chapter of our story.
          Replace the placeholders with your actual scanned images.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LETTERS.map((letter, i) => (
            <article key={letter.id} className="letter-card reveal group cursor-pointer">
              <div className="letter-inner bg-white rounded-3xl overflow-hidden shadow-sm">
                {/* Envelope */}
                <div className="relative flex items-center justify-center py-6 px-4 overflow-hidden"
                  style={{ background: 'linear-gradient(145deg, #fff5f5, #fde8e8)', minHeight: 180 }}>
                  {/* Flap */}
                  <div className="absolute top-0 left-0 right-0 h-20 opacity-50"
                    style={{ background: 'linear-gradient(135deg, #f5d0d0 50%, transparent 50%)',
                             clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                  {/* Letter image */}
                  <div className="relative z-10 w-[85%] h-32 rounded shadow-md overflow-hidden"
                    style={{ background: FALLBACKS[i] }}>
                    <img
                      src={letter.img}
                      alt={letter.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="font-display italic text-rose/60 text-sm">
                        {['I','II','III','IV'][i]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="px-5 pb-6 pt-4">
                  <h3 className="font-display text-xl font-medium text-ink mb-1">{letter.title}</h3>
                  <time className="block text-[.7rem] tracking-widest uppercase text-gold mb-3">{letter.date}</time>
                  <p className="text-sm text-ink-soft leading-relaxed italic">{letter.preview}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-xs text-ink-muted italic text-center reveal">
          ✦ To add your letters: drop images into <code className="font-mono bg-blush/50 px-1 rounded">public/assets/letters/</code> and update the filenames in <code className="font-mono bg-blush/50 px-1 rounded">Letters.jsx</code>
        </p>
      </div>
    </section>
  )
}
