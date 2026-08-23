import { useEffect, useRef } from 'react'
import { site } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap, registerGsap } from '@/lib/gsap'

export function ScaleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    registerGsap()
    const section = sectionRef.current
    if (!section || reduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-scale-stat]', {
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 40%',
          scrub: 0.35,
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: 'none',
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="scale"
      className="section-pad section-scale relative border-t border-border py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-10">Scale</p>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div data-scale-stat>
            <p className="font-display text-[clamp(4.5rem,14vw,9rem)] leading-none tracking-[-0.05em] text-text">
              {site.projects}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-faint uppercase">
              Projects delivered
            </p>
          </div>
          <div data-scale-stat>
            <p className="font-display text-[clamp(4.5rem,14vw,9rem)] leading-none tracking-[-0.05em] text-text">
              {site.years}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-faint uppercase">
              Years professional experience
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
