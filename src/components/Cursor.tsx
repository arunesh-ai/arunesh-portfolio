import { useEffect, useRef, useState } from 'react'
import { useIsTouch, useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

type CursorState = 'default' | 'view' | 'link' | 'talk' | 'drag' | 'grab'

const labels: Record<CursorState, string> = {
  default: '',
  view: 'VIEW',
  link: 'LINK →',
  talk: "LET'S TALK",
  drag: 'DRAG',
  grab: 'GRAB',
}

/**
 * Custom cursor for the light editorial theme.
 *
 * Default state:
 *   - Small deep-charcoal solid dot (clearly visible on ivory)
 *   - Soft dusty-blue accent ring slightly larger than the dot
 *   - Ring uses a slower transition so it "trails" the dot slightly — tactile feel
 *
 * Expanded state (data-cursor="view|link|talk"):
 *   - Dot disappears
 *   - Ring grows and fades
 *   - Ivory label box fades in
 *
 * Pointer position: immediate transform on mousemove — no lerp, no rAF lag.
 * Label / ring animation: CSS transitions only. No React updates on mousemove.
 */
export function Cursor() {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const [state, setState] = useState<CursorState>('default')
  const rootRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)

  useEffect(() => {
    if (isTouch || reduced) return

    document.body.classList.add('has-custom-cursor')
    const root = rootRef.current
    if (!root) return

    const onMove = (e: MouseEvent) => {
      root.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      if (!visibleRef.current) {
        visibleRef.current = true
        root.style.opacity = '1'
      }
    }

    const onLeave = () => {
      visibleRef.current = false
      root.style.opacity = '0'
    }

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]')
      const value = (el?.getAttribute('data-cursor') as CursorState | null) ?? 'default'
      setState((prev) => (prev === value ? prev : value))
    }

    root.style.opacity = '0'
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [isTouch, reduced])

  if (isTouch || reduced) return null

  const expanded = state !== 'default'

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center transition-opacity duration-150"
    >
      {/* Soft accent ring — slightly slower transition, creates subtle trail */}
      <span
        className={cn(
          'absolute rounded-full border border-accent/30 transition-[width,height,opacity,border-color] duration-300',
          expanded
            ? 'h-10 w-10 border-accent/10 opacity-30'
            : 'h-6 w-6 opacity-100',
        )}
      />

      {/* Deep charcoal core dot — high contrast on warm ivory */}
      <span
        className={cn(
          'absolute rounded-full bg-text transition-[width,height,opacity] duration-150',
          expanded ? 'h-0 w-0 opacity-0' : 'h-2.5 w-2.5 opacity-90',
        )}
      />

      {/* Ivory label box */}
      <span
        className={cn(
          'absolute whitespace-nowrap border border-border-strong bg-bg px-3.5 py-1.5 font-mono text-[10px] tracking-[0.16em] text-text shadow-[0_2px_10px_rgba(27,25,23,0.08)] backdrop-blur-sm transition-[opacity,transform] duration-200',
          expanded ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        {labels[state]}
      </span>
    </div>
  )
}
