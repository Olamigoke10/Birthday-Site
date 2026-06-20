import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CelebrateButton from './CelebrateButton'

const SUBTITLE = "Every moment spent with you is a memory I'll treasure forever. Today we celebrate you — your light, your laughter, your love."

export default function Hero({ isActive }) {
  const petalsRef  = useRef(null)
  const eyebrowRef = useRef(null)
  const line1Ref   = useRef(null)
  const line2Ref   = useRef(null)
  const line3Ref   = useRef(null)
  const subRef     = useRef(null)
  const ctaRef     = useRef(null)
  const celebRef   = useRef(null)
  const scrollRef  = useRef(null)
  const didAnimate = useRef(false)

  /* Falling petals */
  useEffect(() => {
    const c = petalsRef.current
    if (!c) return
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      const sz = 8 + Math.random() * 10
      p.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz*1.35}px;animation-duration:${6+Math.random()*8}s;animation-delay:${Math.random()*12}s;transform:rotate(${Math.random()*360}deg);`
      c.appendChild(p)
    }
    return () => { while (c.firstChild) c.removeChild(c.firstChild) }
  }, [])

  /* GSAP entrance (fires once, when slide first becomes active) */
  useEffect(() => {
    if (!isActive || didAnimate.current) return
    didAnimate.current = true

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Hide everything first */
    const targets = [eyebrowRef, line1Ref, line2Ref, line3Ref, ctaRef, celebRef, scrollRef]
    targets.forEach(r => r.current && gsap.set(r.current, { opacity: 0, y: 20 }))
    if (subRef.current) subRef.current.textContent = ''

    if (reduced) {
      targets.forEach(r => r.current && gsap.set(r.current, { opacity: 1, y: 0 }))
      if (subRef.current) subRef.current.textContent = SUBTITLE
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 })
      .to(line1Ref.current,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .to(line2Ref.current,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to(line3Ref.current,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .add(() => typewrite(subRef.current, SUBTITLE, 22))
      .to(ctaRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' },
        '+=0.25')
      .to(celebRef.current,
        { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' },
        '-=0.25')
      .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')

    return () => tl.kill()
  }, [isActive])

  return (
    <section className="slide-section hero-slide"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #fde8e8 0%, #fdf0f7 40%, #fdf8f2 100%)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle 400px at 20% 80%, rgba(201,168,110,.12) 0%, transparent 70%), radial-gradient(circle 300px at 80% 20%, rgba(212,165,181,.15) 0%, transparent 70%)' }} />

      <div ref={petalsRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" />

      <div className="relative z-10 text-center max-w-2xl px-6">
        <p ref={eyebrowRef} className="text-xs font-medium tracking-[.22em] uppercase text-gold mb-6 reveal-slide">
          June 18 · A day to remember
        </p>

        <h1 className="font-display font-light leading-[1.05] text-ink mb-5 reveal-slide"
          style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
          <span ref={line1Ref} className="block">Happy</span>
          <em  ref={line2Ref} className="block italic text-rose">Birthday,</em>
          <span ref={line3Ref} className="block">Dara</span>
        </h1>

        <p ref={subRef}
          className="text-base md:text-lg text-ink-soft leading-relaxed mb-8 max-w-md mx-auto min-h-[4rem] reveal-slide"
          aria-label={SUBTITLE} />

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal-slide">
          <a href="#photos" onClick={e => e.preventDefault()}
            className="btn-primary">Explore Memories</a>
          <div ref={celebRef}><CelebrateButton /></div>
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal-slide">
        <span className="text-[.62rem] tracking-[.2em] uppercase text-ink-muted">Scroll or use arrows</span>
        <div className="w-px h-10 scroll-line" style={{ background: 'linear-gradient(#c97b84, transparent)' }} />
      </div>
    </section>
  )
}

function typewrite(el, text, ms = 22) {
  if (!el) return
  el.textContent = ''
  let i = 0
  const id = setInterval(() => {
    el.textContent += text[i++]
    if (i >= text.length) clearInterval(id)
  }, ms)
}
