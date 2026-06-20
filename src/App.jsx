import { useEffect } from 'react'
import gsap from 'gsap'
import Nav         from './components/Nav'
import Hero        from './components/Hero'
import Photos      from './components/Photos'
import GuestBook   from './components/GuestBook'
import Footer      from './components/Footer'
import Confetti    from './components/Confetti'
import Decorations from './components/Decorations'

export default function App() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const io = new IntersectionObserver(
      entries => entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return
        if (reduced) {
          target.classList.add('visible')
        } else {
          gsap.fromTo(target,
            { opacity: 0, y: 32, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out', clearProps: 'all',
              onComplete: () => target.classList.add('visible') })
        }
        io.unobserve(target)
      }),
      { threshold: 0.1 }
    )

    const tid = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    }, 100)

    return () => { clearTimeout(tid); io.disconnect() }
  }, [])

  return (
    <div className="font-body">
      <Confetti />
      <Decorations />
      <Nav />
      <Hero />
      <Photos />
      <GuestBook />
      <Footer />
    </div>
  )
}
