import { useEffect, useRef } from 'react'
import { site } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap, registerGsap } from '@/lib/gsap'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    registerGsap()
    const section = sectionRef.current
    if (!section || reduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-about-line]', {
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 35%',
          scrub: 0.4,
        },
        y: 24,
        opacity: 0,
        stagger: 0.08,
        ease: 'none',
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pad section-about relative border-t border-border py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-5" data-about-line>
          About
        </p>
        <h2
          className="max-w-4xl font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[0.98] tracking-[-0.03em] text-text"
          data-about-line
        >
          SOFTWARE ENGINEER — PRODUCTION WEB SYSTEMS
        </h2>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <p className="max-w-prose text-base leading-relaxed text-muted md:text-lg" data-about-line>
            {site.title} focused on building and maintaining production web experiences,
            with strong depth in WordPress, PHP, WooCommerce, custom plugins, integrations
            and backend systems.
          </p>
          <div className="space-y-4" data-about-line>
            <p className="text-base leading-relaxed text-muted md:text-lg">
              Approximately {site.years} years of professional experience across{' '}
              {site.projects} projects — from storefronts and APIs to debugging,
              performance and long-term maintenance.
            </p>
            <p className="font-mono text-[11px] tracking-[0.12em] text-faint uppercase">
              {site.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
