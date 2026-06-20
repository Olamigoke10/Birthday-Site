import { useRef } from 'react'
import gsap from 'gsap'

const COLORS = ['#c97b84','#c9a96e','#d4a5b5','#f9d5d3','#a85965','#e8d5b0','#ffffff','#f0dde6']

export default function CelebrateButton() {
  const btnRef = useRef(null)

  function burst(e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = btnRef.current.getBoundingClientRect()
    const ox   = rect.left + rect.width  / 2
    const oy   = rect.top  + rect.height / 2

    const particleCount = 28
    for (let i = 0; i < particleCount; i++) {
      const el    = document.createElement('div')
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size  = 5 + Math.random() * 9
      const isCircle = Math.random() > 0.4

      el.style.cssText = `
        position:fixed;
        left:${ox}px;
        top:${oy}px;
        width:${size}px;
        height:${isCircle ? size : size * 0.5}px;
        background:${color};
        border-radius:${isCircle ? '50%' : '2px'};
        pointer-events:none;
        z-index:9999;
        transform:translate(-50%,-50%);
        will-change:transform,opacity;
      `
      document.body.appendChild(el)

      const angle    = (Math.PI * 2 / particleCount) * i + Math.random() * 0.4
      const dist     = 70 + Math.random() * 100
      const tx       = Math.cos(angle) * dist
      const ty       = Math.sin(angle) * dist

      gsap.to(el, {
        x: tx,
        y: ty,
        opacity: 0,
        scale: 0,
        rotation: gsap.utils.random(-360, 360),
        duration: 0.55 + Math.random() * 0.45,
        ease: 'power2.out',
        onComplete: () => el.remove(),
      })
    }

    // Button scale pulse
    gsap.fromTo(
      btnRef.current,
      { scale: 0.92 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.5)' }
    )
  }

  return (
    <button
      ref={btnRef}
      onClick={burst}
      className="celebrate-btn inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium tracking-widest text-sm uppercase text-white transition-all duration-200 select-none"
      style={{
        background: 'linear-gradient(135deg, #c9a96e, #a85965)',
        boxShadow: '0 4px 20px rgba(201,169,110,.4)',
      }}
    >
      🎉 Celebrate!
    </button>
  )
}
