import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Letters from './components/Letters'
import Photos from './components/Photos'
import GuestBook from './components/GuestBook'
import Footer from './components/Footer'

export default function App() {
  // Intersection observer for reveal-on-scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('visible'); io.unobserve(target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="font-body">
      <Nav />
      <Hero />
      <Letters />
      <Photos />
      <GuestBook />
      <Footer />
    </div>
  )
}
