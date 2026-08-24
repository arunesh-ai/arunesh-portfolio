import { site } from '@/data/site'
import { MagneticButton } from '@/components/MagneticButton'
import { PhysicsPlayground } from '@/components/PhysicsPlayground'

const chips = [
  'WEB',
  'BACKEND',
  'APIs',
  'PHP',
  'JAVASCRIPT',
  'DATABASES',
  'WORDPRESS',
  'WOOCOMMERCE',
]

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 pt-24 md:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 85% 0%, rgba(92,122,154,0.07) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.40]" aria-hidden />

      <div className="section-pad relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.16em] text-faint uppercase md:mb-6">
          <span>{site.location}</span>
          <span className="text-border-strong" aria-hidden>/</span>
          <span>Open to opportunities</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_min(46%,560px)] lg:items-center lg:gap-10 xl:gap-14">
          <div>
            <p className="font-display text-[clamp(1.25rem,2.8vw,2.2rem)] leading-[0.95] tracking-[-0.03em] text-steel">
              {site.name.toUpperCase()}
            </p>

            <h1 className="mt-2 max-w-2xl font-display text-[clamp(2.4rem,6.5vw,5.25rem)] leading-[0.92] tracking-[-0.035em] text-text">
              SOFTWARE ENGINEER
            </h1>

            <div className="mt-6 md:mt-7">
              <p className="font-display text-[clamp(1.2rem,2.2vw,1.75rem)] leading-[1.1] tracking-[-0.02em] text-text">
                I BUILD FOR THE WEB.
              </p>
              <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-muted md:text-base">
                {site.tagline}
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-faint">
                {site.specialization}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton href="#contact" data-cursor="talk">
                  Let&apos;s work together
                </MagneticButton>
                <MagneticButton
                  href="#work"
                  data-cursor="view"
                  className="border-border bg-transparent text-text hover:border-border-strong hover:bg-bg-elevated"
                >
                  Selected work
                </MagneticButton>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4 md:mt-7">
              <div>
                <dt className="eyebrow">Experience</dt>
                <dd className="mt-1 font-display text-xl tracking-tight text-steel md:text-2xl">
                  {site.years} YEARS
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Scale</dt>
                <dd className="mt-1 font-display text-xl tracking-tight text-steel md:text-2xl">
                  {site.projects} PROJECTS
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Focus</dt>
                <dd className="mt-1 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-faint uppercase md:text-[11px]">
                  Web · Backend · APIs
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4 md:mt-6">
              {chips.map((c) => (
                <span
                  key={c}
                  className="border border-border bg-bg-elevated/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-muted uppercase md:text-[10px]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Contained playground — height capped so the full scene fits the first viewport */}
          <div className="hidden h-[min(520px,calc(100svh-9rem))] w-full lg:block">
            <PhysicsPlayground />
          </div>
        </div>
      </div>
    </section>
  )
}
