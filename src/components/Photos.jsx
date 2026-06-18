import { useState, useEffect, useRef } from 'react'

const PHOTOS = [
  { id: 1, src: '/assets/photos/photo-1.jpg', cat: 'travel',       title: 'Our Weekend Escape',      caption: 'April 2023 · The coast was our whole world that day.',       fallback: 'linear-gradient(135deg,#f9d5d3,#e8b4b8)', span: '' },
  { id: 2, src: '/assets/photos/photo-2.jpg', cat: 'celebrations', title: "New Year's Eve Toast",     caption: 'December 2023 · Champagne and a midnight wish for us.',      fallback: 'linear-gradient(135deg,#f0e6f6,#d4a9d4)', span: 'tall' },
  { id: 3, src: '/assets/photos/photo-3.jpg', cat: 'everyday',     title: 'Sunday Morning Coffee',   caption: 'February 2024 · Slow mornings are our favourite luxury.',     fallback: 'linear-gradient(135deg,#fef3cd,#f5cba7)', span: '' },
  { id: 4, src: '/assets/photos/photo-4.jpg', cat: 'travel',       title: 'The Road Trip',           caption: 'August 2023 · Windows down, music loud, you beside me.',     fallback: 'linear-gradient(135deg,#d5f5e3,#a9d4c0)', span: 'wide' },
  { id: 5, src: '/assets/photos/photo-5.jpg', cat: 'celebrations', title: 'Our Anniversary Dinner',  caption: 'March 2024 · Two years of choosing each other.',               fallback: 'linear-gradient(135deg,#fadbd8,#f1948a)', span: '' },
  { id: 6, src: '/assets/photos/photo-6.jpg', cat: 'everyday',     title: 'Golden Hour Walk',        caption: 'October 2023 · Leaves, light, and your hand in mine.',       fallback: 'linear-gradient(135deg,#d6eaf8,#a9cce3)', span: '' },
]

const FILTERS = ['all', 'travel', 'celebrations', 'everyday']

export default function Photos() {
  const [active,   setActive]   = useState('all')
  const [lightbox, setLightbox] = useState(null)   // { src, title, caption }
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

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    const onKey = e => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const visible = PHOTOS.filter(p => active === 'all' || p.cat === active)

  return (
    <section id="photos" ref={sectionRef} className="py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-tag reveal">Captured moments</p>
        <h2 className="section-title reveal">Photo <em className="italic text-rose">Memories</em></h2>
        <p className="section-desc reveal">
          A gallery of the moments that made us — frozen in light and colour.
          Drop your own photos in and watch this come alive.
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-3 mb-10 reveal">
          {FILTERS.map(f => (
            <button key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-xs font-medium tracking-widest uppercase border-[1.5px] transition-all duration-300 ${
                active === f
                  ? 'bg-rose border-rose text-white shadow-md'
                  : 'border-blush-deep text-ink-soft hover:border-rose hover:text-rose'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[240px]">
          {visible.map(photo => (
            <div key={photo.id}
              onClick={() => setLightbox(photo)}
              className={`photo-card relative rounded-2xl overflow-hidden cursor-pointer ${
                photo.span === 'tall' ? 'sm:row-span-2' :
                photo.span === 'wide' ? 'sm:col-span-2' : ''
              }`}
              style={{ background: photo.fallback }}>

              <img
                src={photo.src}
                alt={photo.title}
                className="photo-img absolute inset-0 w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />

              {/* Hover overlay */}
              <div className="photo-overlay absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: 'linear-gradient(transparent, rgba(40,15,15,.7))' }}>
                <span className="text-[.65rem] tracking-widest uppercase text-gold-light block mb-1">{photo.cat}</span>
                <h4 className="font-display text-xl text-white font-medium mb-1">{photo.title}</h4>
                <p className="text-xs text-white/75">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-ink-muted italic text-center reveal">
          ✦ Drop your photos into <code className="font-mono bg-blush/50 px-1 rounded">public/assets/photos/</code> and update the filenames in <code className="font-mono bg-blush/50 px-1 rounded">Photos.jsx</code>
        </p>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => setLightbox(null)}>
          <button
            className="absolute top-6 right-8 text-white/70 text-2xl hover:text-white transition-colors"
            onClick={() => setLightbox(null)}>✕</button>
          <img
            src={lightbox.src}
            alt={lightbox.title}
            onClick={e => e.stopPropagation()}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <p className="mt-4 text-white/60 text-sm italic">{lightbox.title} · {lightbox.caption}</p>
        </div>
      )}
    </section>
  )
}
