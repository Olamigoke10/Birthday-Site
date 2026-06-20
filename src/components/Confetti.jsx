import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COLORS  = ['#c97b84','#c9a96e','#d4a5b5','#f9d5d3','#a85965','#e8d5b0','#f0dde6']
const SHAPES  = ['circle','square','rect']
const COUNT   = 75

export default function Confetti() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const container = ref.current
    if (!container) return
    const kills = []

    for (let i = 0; i < COUNT; i++) {
      const el     = document.createElement('div')
      const shape  = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size   = 5 + Math.random() * 9

      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:-20px;
        width:${shape === 'rect' ? size * 2.2 : size}px;
        height:${size}px;
        background:${color};
        border-radius:${shape === 'circle' ? '50%' : shape === 'rect' ? '2px' : '3px'};
        opacity:0;
        pointer-events:none;
        will-change:transform,opacity;
      `
      container.appendChild(el)

      const dur = gsap.utils.random(5, 10)
      const tween = gsap.fromTo(
        el,
        { y: -20, x: 0, rotation: Math.random() * 360, opacity: 0 },
        {
          y: window.innerHeight + 50,
          x: gsap.utils.random(-150, 150),
          rotation: `+=${gsap.utils.random(-540, 540)}`,
          opacity: gsap.utils.random(0.35, 0.8),
          duration: dur,
          delay: gsap.utils.random(0, 10),
          ease: 'none',
          repeat: -1,
          repeatDelay: gsap.utils.random(0, 4),
          onRepeat() {
            gsap.set(el, { left: `${Math.random() * 100}%`, x: 0, opacity: 0 })
          },
        }
      )
      kills.push(tween)
    }

    return () => {
      kills.forEach(t => t.kill())
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    />
  )
}
