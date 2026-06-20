import { useState, useEffect } from 'react'

const links = [
  { href: '#hero',      label: 'Home' },
  { href: '#photos',    label: 'Memories' },
  { href: '#guestbook', label: 'Guest Book' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-6 md:px-16 transition-all duration-300 ${
        scrolled ? 'py-3 bg-cream/90 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'
      }`}>
        <a href="#hero" className="font-display text-xl italic text-rose tracking-wide">
          ✦ For Dara
        </a>

        <ul className="hidden md:flex gap-10">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}
                className="text-xs font-medium tracking-[.12em] uppercase text-ink-soft hover:text-rose transition-colors duration-300 relative group">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-rose transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <button className="md:hidden flex flex-col gap-1.5 p-1 z-[920]"
          onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={`block w-6 h-0.5 bg-rose rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-rose rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-rose rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      <div className={`nav-drawer fixed inset-0 z-[910] flex flex-col items-center justify-center gap-10 md:hidden ${open ? 'open' : ''}`}
        style={{ background: 'rgba(253,248,242,.97)', backdropFilter: 'blur(16px)' }}>
        {links.map(l => (
          <a key={l.href} href={l.href}
            onClick={() => setOpen(false)}
            className="font-display text-3xl italic text-ink hover:text-rose transition-colors duration-300">
            {l.label}
          </a>
        ))}
      </div>
    </>
  )
}
