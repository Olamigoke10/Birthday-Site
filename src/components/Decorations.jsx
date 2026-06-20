/* Decorative animated elements: cake, stars, balloons */
export default function Decorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }} aria-hidden="true">

      {/* 🎂 Birthday cake — bottom-left float */}
      <span className="deco-float absolute text-4xl select-none"
        style={{ left: '4%', bottom: '18%', animationDuration: '5s', animationDelay: '0s' }}>
        🎂
      </span>

      {/* ⭐ Star — top-right slow spin + pulse */}
      <span className="deco-spin absolute text-3xl select-none"
        style={{ right: '6%', top: '22%', animationDuration: '8s' }}>
        ✨
      </span>

      {/* 🎈 Balloon — left mid float */}
      <span className="deco-float absolute text-4xl select-none"
        style={{ left: '2%', top: '42%', animationDuration: '6s', animationDelay: '1.2s' }}>
        🎈
      </span>

      {/* 💫 Sparkle — right bottom pulse-glow */}
      <span className="deco-pulse absolute text-2xl select-none"
        style={{ right: '3%', bottom: '30%', animationDuration: '2.5s' }}>
        💫
      </span>

      {/* 🌸 Flower — top left gentle float */}
      <span className="deco-float absolute text-2xl select-none"
        style={{ left: '8%', top: '15%', animationDuration: '7s', animationDelay: '2.5s' }}>
        🌸
      </span>

      {/* Star SVG — decorative, faint, top-center spin */}
      <svg
        className="deco-spin absolute opacity-20"
        style={{ width: 48, height: 48, right: '18%', top: '8%', animationDuration: '12s' }}
        viewBox="0 0 48 48" fill="none">
        <path d="M24 2 L27.5 15.5 L42 15.5 L30.5 24 L34 37.5 L24 30 L14 37.5 L17.5 24 L6 15.5 L20.5 15.5 Z"
          fill="#c9a96e" />
      </svg>

      {/* Heart SVG — faint, bottom-right pulse */}
      <svg
        className="deco-pulse absolute opacity-15"
        style={{ width: 56, height: 56, right: '12%', bottom: '12%', animationDuration: '3s' }}
        viewBox="0 0 56 56" fill="none">
        <path d="M28 48 C28 48 6 34 6 18 C6 10 12 4 20 4 C24 4 28 8 28 8 C28 8 32 4 36 4 C44 4 50 10 50 18 C50 34 28 48 28 48 Z"
          fill="#c97b84" />
      </svg>
    </div>
  )
}
