import { motion, useReducedMotion } from 'motion/react'
import { engineeringPillars } from '@/data/skills'

const pillarHints: Record<string, string> = {
  BUILD: 'Ship production systems',
  DEBUG: 'Isolate root causes',
  TEST: 'Verify before release',
  OPTIMIZE: 'Improve load and flow',
  SECURE: 'Harden what ships',
  MAINTAIN: 'Keep systems reliable',
}

export function EngineeringMindset() {
  const reduced = useReducedMotion()

  return (
    <section
      id="engineering"
      className="section-pad border-t border-border section-mindset py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-6">Engineering mindset</p>
        <h2 className="max-w-4xl font-display text-[clamp(2rem,5vw,4rem)] leading-[0.98] tracking-[-0.03em]">
          I CARE ABOUT WHAT HAPPENS AFTER LAUNCH.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Production work includes troubleshooting, debugging, performance, security,
          compatibility, maintenance, integrations and reliability — not only writing code.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {engineeringPillars.map((pillar, index) => (
            <motion.li
              key={pillar}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.35, delay: reduced ? 0 : index * 0.05 }}
              className="group border border-border bg-bg-elevated px-5 py-5 shadow-[0_2px_12px_rgba(28,26,24,0.05)] transition-colors duration-200 hover:border-border-strong hover:shadow-[0_4px_20px_rgba(28,26,24,0.08)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] tracking-[0.16em] text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-faint uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Principle
                </span>
              </div>
              <p className="mt-3 font-display text-xl tracking-tight md:text-2xl">{pillar}</p>
              <p className="mt-2 text-sm text-muted">
                {pillarHints[pillar]}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
