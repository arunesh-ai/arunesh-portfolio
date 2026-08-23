import { useEffect, useRef } from 'react'
import { experience } from '@/data/experience'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap, registerGsap } from '@/lib/gsap'

export function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    registerGsap()
    const section = sectionRef.current
    const line = lineRef.current
    if (!section || !line || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: true,
          },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-exp-item]').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          },
          opacity: 0.25,
          x: -24,
        })
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section-pad border-t border-border py-24 md:py-32 section-experience"
    >
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-6">Experience</p>
        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.03em]">
          PROFESSIONAL PATH
        </h2>

        <div className="relative mt-14 pl-6 md:pl-10">
          <div
            className="absolute top-0 bottom-0 left-0 w-px bg-border md:left-2"
            aria-hidden
          >
            <div
              ref={lineRef}
              className="origin-top h-full w-full bg-accent"
              style={{ transform: reduced ? 'scaleY(1)' : undefined }}
            />
          </div>

          <ol className="space-y-14">
            {experience.map((item) => (
              <li key={item.id} data-exp-item className="relative">
                <span
                  className="absolute top-2 -left-[1.55rem] h-2.5 w-2.5 rounded-full border border-accent bg-bg md:-left-[2.05rem]"
                  aria-hidden
                />
                <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
                  {item.year}
                </p>
                <h3 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-steel">{item.company}</p>
                <p className="mt-1 font-mono text-[11px] tracking-wide text-faint">
                  {item.period}
                </p>
                <p className="mt-4 max-w-2xl text-muted">{item.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="font-mono text-[11px] tracking-wide text-faint"
                    >
                      — {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <li data-exp-item className="relative">
              <span
                className="absolute top-2 -left-[1.55rem] h-2.5 w-2.5 rounded-full border border-accent bg-accent md:-left-[2.05rem]"
                aria-hidden
              />
              <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
                Present
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
                Continuing as a Software Engineer
              </h3>
              <p className="mt-4 max-w-2xl text-muted">
                Building production web experiences, backend systems and integrations —
                open to the next engineering challenge.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
