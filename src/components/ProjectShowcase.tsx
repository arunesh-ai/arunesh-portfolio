import { BrowserFrame } from '@/components/BrowserFrame'
import { projects } from '@/data/projects'
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap, registerGsap } from '@/lib/gsap'
import { cn } from '@/lib/cn'
import { useEffect, useRef } from 'react'

/**
 * Selected Work — heading + intro stay inside the pinned composition
 * so they remain visible when horizontal scrolling begins.
 */
export function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    registerGsap()
    const section = sectionRef.current
    const pin = pinRef.current
    const track = trackRef.current
    if (!section || !pin || !track) return
    if (reduced || isMobile) {
      track.style.transform = ''
      return
    }

    const ctx = gsap.context(() => {
      const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth)

      /*
       * Pin the COMPOSITION (heading + intro + track), not the track alone.
       * start: 'top top' — when the pin wrapper reaches the top of the viewport,
       * the SELECTED WORK heading is locked in place and horizontal motion begins.
       * Heading never scrolls away before/during the horizontal sequence start.
       */
      gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${getScroll() + window.innerHeight * 0.45}`,
          pin: pin,
          scrub: 1.35,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reduced, isMobile])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-work relative border-t border-border"
    >
      {/* Pin this wrapper — do NOT put overflow:hidden on the pinned node (breaks ScrollTrigger pin). */}
      <div ref={pinRef}>
        <div className="section-pad mx-auto max-w-7xl pt-10 pb-3 md:pt-12 md:pb-4">
          <p className="eyebrow mb-2">Selected work</p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.03em] text-text">
            SELECTED WORK
          </h2>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted md:text-[15px] md:leading-[1.6]">
            A concise selection of production websites from 30+ projects.
          </p>
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className={cn(
              isMobile
                ? 'section-pad flex flex-col gap-10 pb-16'
                : 'flex w-max items-start gap-6 px-[max(1.25rem,4vw)] pb-12 will-change-transform md:gap-8 md:pb-14',
            )}
          >
          {projects.map((project) => (
            <article
              key={project.id}
              className={cn(
                isMobile
                  ? 'w-full'
                  : 'flex h-[min(58vh,480px)] w-[min(72vw,640px)] shrink-0 flex-col',
              )}
              data-cursor="view"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-0 flex-1 flex-col"
                data-cursor="link"
                aria-label={`Visit ${project.title} (opens in new tab)`}
              >
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] tracking-[0.16em] text-faint uppercase">
                      Project {String(project.index).padStart(2, '0')}
                      <span className="mx-2 text-border-strong" aria-hidden>
                        /
                      </span>
                      {project.category}
                    </p>
                    <h3 className="mt-1 truncate font-display text-xl tracking-tight text-text transition-colors duration-200 group-hover:text-muted md:text-2xl">
                      {project.title}
                    </h3>
                  </div>
                  <p className="hidden shrink-0 font-mono text-[10px] tracking-[0.14em] text-accent uppercase sm:block">
                    Visit →
                  </p>
                </div>

                <BrowserFrame
                  title={project.title}
                  url={project.url}
                  index={project.index}
                  technologies={project.technologies}
                  image={project.image}
                  compact
                  className="min-h-0 flex-1"
                />

                <p className="mt-2 line-clamp-2 max-w-xl text-[12px] leading-relaxed text-muted md:text-[13px]">
                  {project.description}
                </p>

                {project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="border border-border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
