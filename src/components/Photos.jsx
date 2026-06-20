import { useState, useEffect } from 'react'

const PHOTOS = [
  { id: 1, src: '/assets/photos/photo-1.jpg', cat: 'travel',       title: 'Our Weekend Escape',     caption: 'April 2023',      fallback: 'linear-gradient(135deg,#f9d5d3,#e8b4b8)' },
  { id: 2, src: '/assets/photos/photo-2.jpg', cat: 'celebrations', title: "New Year's Eve Toast",    caption: 'December 2023',   fallback: 'linear-gradient(135deg,#f0e6f6,#d4a9d4)' },
  { id: 3, src: '/assets/photos/photo-3.jpg', cat: 'everyday',     title: 'Sunday Morning Coffee',  caption: 'February 2024',   fallback: 'linear-gradient(135deg,#fef3cd,#f5cba7)' },
  { id: 4, src: '/assets/photos/photo-4.jpg', cat: 'travel',       title: 'The Road Trip',          caption: 'August 2023',     fallback: 'linear-gradient(135deg,#d5f5e3,#a9d4c0)' },
  { id: 5, src: '/assets/photos/photo-5.jpg', cat: 'celebrations', title: 'Our Anniversary Dinner', caption: 'March 2024',      fallback: 'linear-gradient(135deg,#fadbd8,#f1948a)' },
  { id: 6, src: '/assets/photos/photo-6.jpg', cat: 'everyday',     title: 'Golden Hour Walk',       caption: 'October 2023',    fallback: 'linear-gradient(135deg,#d6eaf8,#a9cce3)' },
]

const FILTERS = ['all', 'travel', 'celebrations', 'everyday']

export default function Photos() {
  const [active,   setActive]   = useState('all')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    const onKey = e => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const visible = PHOTOS.filter(p => active === 'all' || p.cat === active)

  return (
    <section className="slide-section photos-slide">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col h-full">

        {/* Header */}
        <div className="pt-24 pb-5 flex-shrink-0">
          <p className="section-tag reveal-slide">Captured moments</p>
          <h2 className="section-title reveal-slide">
            Photo <em className="italic text-rose">Memories</em>
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 reveal-slide">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActive(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase border-[1.5px] transition-all duration-200 ${
                  active === f
                    ? 'bg-rose border-rose text-white shadow-md'
                    : 'border-blush-deep text-ink-soft hover:border-rose hover:text-rose'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Photo grid — fills remaining space */}
        <div className="photos-grid flex-1 pb-24 reveal-slide">
          {visible.map(photo => (
            <div key={photo.id}
              onClick={() => setLightbox(photo)}
              className="photo-card relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: photo.fallback }}>

              <img src={photo.src} alt={photo.title}
                className="photo-img absolute inset-0 w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none' }} />

              <div className="photo-overlay absolute inset-0 flex flex-col justify-end p-4"
                style={{ background: 'linear-gradient(transparent, rgba(40,15,15,.72))' }}>
                <h4 className="font-display text-lg text-white font-medium leading-tight">{photo.title}</h4>
                <p className="text-xs text-white/70 mt-0.5">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/88 backdrop-blur-sm"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-8 text-white/70 text-2xl hover:text-white transition-colors"
            onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox.src} alt={lightbox.title}
            onClick={e => e.stopPropagation()}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            onError={e => { e.currentTarget.style.display = 'none' }} />
          <p className="mt-4 text-white/60 text-sm italic">{lightbox.title} · {lightbox.caption}</p>
        </div>
      )}
    </section>
  )
}
