import { useEffect, useRef } from 'react'

export default function Hero() {
  const petalsRef = useRef(null)

  useEffect(() => {
    const container = petalsRef.current
    if (!container) return
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      const size = 8 + Math.random() * 10
      p.style.cssText = `
        left:${Math.random() * 100}%;
        width:${size}px;
        height:${size * 1.35}px;
        animation-duration:${6 + Math.random() * 8}s;
        animation-delay:${Math.random() * 12}s;
        transform:rotate(${Math.random() * 360}deg);
      `
      container.appendChild(p)
    }
    return () => { while (container.firstChild) container.removeChild(container.firstChild) }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #fde8e8 0%, #fdf0f7 40%, #fdf8f2 100%)' }}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle 400px at 20% 80%, rgba(201,168,110,.12) 0%, transparent 70%), radial-gradient(circle 300px at 80% 20%, rgba(212,165,181,.15) 0%, transparent 70%)' }} />

      {/* Petals */}
      <div ref={petalsRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6">
        <p className="text-xs font-medium tracking-[.22em] uppercase text-gold mb-8">
          June 18 · A day to remember
        </p>
        <h1 className="font-display font-light leading-[1.05] text-ink mb-6"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}>
          Happy<br />
          <em className="italic text-rose">Birthday,</em><br />
          Dara
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
          Every moment spent with you is a memory I'll treasure forever.
          Today we celebrate you — your light, your laughter, your love.
        </p>
        <a href="#letters" className="btn-primary">Explore Our Story</a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[.65rem] tracking-[.2em] uppercase text-ink-muted">Scroll</span>
        <div className="w-px h-12 scroll-line" style={{ background: 'linear-gradient(#c97b84, transparent)' }} />
      </div>
    </section>
  )
}
