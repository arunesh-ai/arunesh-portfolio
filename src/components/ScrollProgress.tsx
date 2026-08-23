import { useEffect, useRef, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? doc.scrollTop / max : 0)
      raf.current = 0
    }

    const onScroll = () => {
      if (raf.current) return
      raf.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[90] h-px bg-border/80"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-accent"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
