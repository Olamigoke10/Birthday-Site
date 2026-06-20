import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CelebrateButton from './CelebrateButton'

const SUBTITLE = "Every moment spent with you is a memory I'll treasure forever. Today we celebrate you — your light, your laughter, your love."

export default function Hero() {
  const petalsRef   = useRef(null)
  const eyebrowRef  = useRef(null)
  const line1Ref    = useRef(null)
  const line2Ref    = useRef(null)
  const line3Ref    = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef      = useRef(null)
  const celebRef    = useRef(null)
  const scrollRef   = useRef(null)

  /* ── Falling petals ── */
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

  /* ── GSAP entrance timeline + typewriter ── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Make everything invisible first regardless of motion preference
       so there's no flash-of-unstyled content */
    const els = [eyebrowRef, line1Ref, line2Ref, line3Ref, ctaRef, celebRef, scrollRef]
    els.forEach(r => { if (r.current) gsap.set(r.current, { opacity: 0 }) })
    if (subtitleRef.current) subtitleRef.current.textContent = ''

    if (reduced) {
      /* Skip animation — just show everything */
      els.forEach(r => { if (r.current) gsap.set(r.current, { opacity: 1 }) })
      if (subtitleRef.current) subtitleRef.current.textContent = SUBTITLE
      return
    }

    /* GSAP timeline */
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl
      .fromTo(eyebrowRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(line1Ref.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.75 }, '-=0.35')
      .fromTo(line2Ref.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.75 }, '-=0.5')
      .fromTo(line3Ref.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.75 }, '-=0.5')
      /* Typewriter starts after title finishes */
      .add(() => startTypewriter(subtitleRef.current, SUBTITLE, 22), '-=0.1')
      /* CTA bounces in 300ms after subtitle starts typing */
      .fromTo(ctaRef.current,
        { opacity: 0, scale: 0.75, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)' }, '+=0.3')
      .fromTo(celebRef.current,
        { opacity: 0, scale: 0.75, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, '-=0.25')
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }, '-=0.2')

    return () => { tl.kill() }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #fde8e8 0%, #fdf0f7 40%, #fdf8f2 100%)',
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle 400px at 20% 80%, rgba(201,168,110,.12) 0%, transparent 70%), radial-gradient(circle 300px at 80% 20%, rgba(212,165,181,.15) 0%, transparent 70%)',
      }} />

      {/* Petals */}
      <div ref={petalsRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" />

      {/* Content */}
      <div className="relative max-w-2xl px-6" style={{ zIndex: 10 }}>
        <p ref={eyebrowRef} className="text-xs font-medium tracking-[.22em] uppercase text-gold mb-8">
          June 18 · A day to remember
        </p>

        <h1 className="font-display font-light leading-[1.05] text-ink mb-6"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}>
          <span ref={line1Ref} className="block">Happy</span>
          <em ref={line2Ref} className="block italic text-rose">Birthday,</em>
          <span ref={line3Ref} className="block">Dara</span>
        </h1>

        <p ref={subtitleRef}
          className="text-lg text-ink-soft leading-relaxed mb-10 max-w-md mx-auto min-h-[5rem]"
          aria-label={SUBTITLE}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a ref={ctaRef} href="#letters" className="btn-primary">
            Explore Our Story
          </a>
          <div ref={celebRef}>
            <CelebrateButton />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[.65rem] tracking-[.2em] uppercase text-ink-muted">Scroll</span>
        <div className="w-px h-12 scroll-line"
          style={{ background: 'linear-gradient(#c97b84, transparent)' }} />
      </div>
    </section>
  )
}

/* ── Typewriter helper ─────────────────────────────────────────── */
function startTypewriter(el, text, msPerChar = 22) {
  if (!el) return
  el.textContent = ''
  let i = 0
  const id = setInterval(() => {
    el.textContent += text[i]
    i++
    if (i >= text.length) clearInterval(id)
  }, msPerChar)
  return id
}
