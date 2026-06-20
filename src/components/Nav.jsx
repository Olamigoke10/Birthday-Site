import { useState } from 'react'

export default function Nav({ current, slides, goTo }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="slide-top-nav">
        <a
          onClick={() => goTo(0)}
          className="nav-logo cursor-pointer font-display italic text-rose tracking-wide select-none"
          style={{ fontSize: '1.3rem' }}
        >
          ✦ For Dara
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 items-center">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => goTo(i)}
                className={`nav-slide-link ${i === current ? 'active' : ''}`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 z-[920]"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-rose rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-rose rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-rose rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer fixed inset-0 z-[910] flex flex-col items-center justify-center gap-10 md:hidden ${mobileOpen ? 'open' : ''}`}
        style={{ background: 'rgba(253,248,242,.97)', backdropFilter: 'blur(16px)' }}>
        {slides.map((s, i) => (
          <button key={s.id}
            onClick={() => { goTo(i); setMobileOpen(false) }}
            className="font-display text-3xl italic text-ink hover:text-rose transition-colors duration-300">
            {s.label}
          </button>
        ))}
      </div>
    </>
  )
}
