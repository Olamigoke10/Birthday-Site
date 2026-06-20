import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import Nav         from './components/Nav'
import Hero        from './components/Hero'
import Photos      from './components/Photos'
import GuestBook   from './components/GuestBook'
import Footer      from './components/Footer'
import Confetti    from './components/Confetti'
import Decorations from './components/Decorations'

const SLIDES = [
  { id: 'hero',      label: 'Home',      Component: Hero      },
  { id: 'photos',    label: 'Memories',  Component: Photos    },
  { id: 'guestbook', label: 'Guest Book',Component: GuestBook },
]

export default function App() {
  const [current,   setCurrent]   = useState(0)
  const [direction, setDirection] = useState(1)   // 1 = forward, -1 = backward
  const trackRef    = useRef(null)
  const isAnimating = useRef(false)
  const slideRefs   = useRef([])

  /* ── Navigate to a slide ── */
  const goTo = useCallback((idx) => {
    if (isAnimating.current) return
    if (idx < 0 || idx >= SLIDES.length) return
    if (idx === current) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dir     = idx > current ? 1 : -1
    setDirection(dir)
    isAnimating.current = true

    if (reduced) {
      gsap.set(trackRef.current, { x: -idx * window.innerWidth })
      setCurrent(idx)
      isAnimating.current = false
      return
    }

    /* Outgoing slide: slight scale + fade */
    const outEl = slideRefs.current[current]
    const inEl  = slideRefs.current[idx]

    /* Position incoming slide just off-screen */
    gsap.set(inEl, { x: dir * window.innerWidth * 0.08, opacity: 0.6, scale: 0.97 })

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false
        setCurrent(idx)
        /* Reset incoming slide transforms */
        gsap.set(inEl, { x: 0, opacity: 1, scale: 1, clearProps: 'all' })
      },
    })

    tl
      /* Slide the track */
      .to(trackRef.current, {
        x: -idx * window.innerWidth,
        duration: 0.85,
        ease: 'power3.inOut',
      })
      /* Outgoing: scale down + fade slightly */
      .to(outEl, {
        opacity: 0.6,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
      }, 0)
      /* Incoming: scale up + fade in */
      .to(inEl, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
      }, 0)
      /* Restore outgoing opacity after it's gone */
      .set(outEl, { opacity: 1, scale: 1, clearProps: 'opacity,scale' })

    /* Reveal elements inside the incoming slide */
    const revealEls = inEl.querySelectorAll('.reveal-slide')
    if (revealEls.length && !reduced) {
      gsap.fromTo(
        revealEls,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out', delay: 0.3 }
      )
    }

  }, [current])

  /* ── Wheel → slide change ── */
  useEffect(() => {
    let lastWheel = 0
    const onWheel = (e) => {
      if (isAnimating.current) return
      const now = Date.now()
      if (now - lastWheel < 900) return
      lastWheel = now
      if (e.deltaY > 20)  goTo(current + 1)
      if (e.deltaY < -20) goTo(current - 1)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [current, goTo])

  /* ── Keyboard arrows ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo])

  /* ── Touch swipe ── */
  useEffect(() => {
    let startX = 0, startY = 0
    const onStart = (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const onEnd = (e) => {
      if (isAnimating.current) return
      const dx = startX - e.changedTouches[0].clientX
      const dy = Math.abs(startY - e.changedTouches[0].clientY)
      if (Math.abs(dx) < 40 || dy > Math.abs(dx)) return
      if (dx > 0) goTo(current + 1)
      else        goTo(current - 1)
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend',   onEnd,   { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend',   onEnd)
    }
  }, [current, goTo])

  /* ── Reveal elements in the first slide on mount ── */
  useEffect(() => {
    const el = slideRefs.current[0]
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.querySelectorAll('.reveal-slide').forEach(e => { e.style.opacity = 1; e.style.transform = 'none' })
      return
    }
    gsap.fromTo(
      el.querySelectorAll('.reveal-slide'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  return (
    <div className="slides-root">
      <Confetti />
      <Decorations />

      {/* Top nav */}
      <Nav current={current} slides={SLIDES} goTo={goTo} />

      {/* Slide track */}
      <div className="slides-track" ref={trackRef}
        style={{ width: `${SLIDES.length * 100}vw` }}>
        {SLIDES.map(({ id, Component }, i) => (
          <div
            key={id}
            id={id}
            ref={el => (slideRefs.current[i] = el)}
            className="slide-panel"
            style={{ width: '100vw' }}
          >
            <Component isActive={current === i} />
          </div>
        ))}
      </div>

      {/* Footer stripe — visible on last slide */}
      {current === SLIDES.length - 1 && (
        <div className="slide-footer-bar">
          <Footer />
        </div>
      )}

      {/* Bottom navigation */}
      <SlideNav current={current} slides={SLIDES} goTo={goTo} />
    </div>
  )
}

/* ── Dot + arrow navigation ── */
function SlideNav({ current, slides, goTo }) {
  return (
    <div className="slide-nav">
      {/* Prev arrow */}
      <button
        className="slide-arrow slide-arrow--prev"
        onClick={() => goTo(current - 1)}
        disabled={current === 0}
        aria-label="Previous"
      >
        ←
      </button>

      {/* Dots */}
      <div className="slide-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`slide-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={s.label}
          />
        ))}
      </div>

      {/* Slide counter */}
      <span className="slide-counter">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </span>

      {/* Next arrow */}
      <button
        className="slide-arrow slide-arrow--next"
        onClick={() => goTo(current + 1)}
        disabled={current === slides.length - 1}
        aria-label="Next"
      >
        →
      </button>
    </div>
  )
}
