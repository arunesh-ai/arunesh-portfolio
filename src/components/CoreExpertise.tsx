import { aiEngineering, skillCategories } from '@/data/skills'

/**
 * Every pill — category skills, AI tools, capabilities — renders with this exact
 * class string. Identical typography by construction: no per-skill weight or colour.
 */
const PILL_CLASS =
  'inline-flex items-center rounded-full border border-[#C6D5DC] bg-[#EEF3F5] px-3.5 py-1.5 ' +
  'font-mono text-[12px] leading-[1.35] font-normal tracking-[0.03em] text-[#25313A] ' +
  'shadow-[0_1px_0_rgba(27,39,51,0.04)] transition-colors duration-200 ' +
  'hover:border-[#AEC2CC] hover:bg-[#E2EBEF]'

function SkillPill({ label }: { label: string }) {
  return <span className={PILL_CLASS}>{label}</span>
}

function PillList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={`${label}-${item}`}>
          <SkillPill label={item} />
        </li>
      ))}
    </ul>
  )
}

function CategoryCard({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#CBD8DE] bg-white/72 p-5 shadow-[0_2px_12px_rgba(27,39,51,0.045)] backdrop-blur-[2px] md:p-6">
      <h3 className="font-mono text-[13px] font-bold tracking-[0.14em] text-[#1B2733] uppercase">
        {title}
      </h3>
      <div className="mt-1.5 h-px w-10 bg-[#9FB5C0]" aria-hidden />
      <div className="mt-4">
        <PillList items={skills} label={title} />
      </div>
    </div>
  )
}

function getCategory(id: string) {
  const category = skillCategories.find((entry) => entry.id === id)
  if (!category) {
    throw new Error(`Missing skill category: ${id}`)
  }
  return category
}

export function CoreExpertise() {
  const languages = getCategory('languages')
  const platforms = getCategory('platforms')
  const development = getCategory('development')
  const performance = getCategory('performance')
  const automation = getCategory('automation')
  const wordpress = getCategory('wordpress-ecosystem')
  const aiTools = getCategory('ai-tools')
  const tools = getCategory('tools')

  return (
    <section
      id="expertise"
      className="section-pad section-expertise relative isolate overflow-hidden border-t border-border py-20 md:py-28"
      aria-labelledby="technical-profile-heading"
    >
      {/* Background decoration only — extremely soft radial washes */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-24 left-[8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(140,173,197,0.42),transparent_70%)] blur-3xl" />
        <div className="absolute top-[38%] -right-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(154,181,163,0.34),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(224,201,176,0.36),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <p className="mb-5 font-mono text-[11px] font-bold tracking-[0.2em] text-[#4A5A66] uppercase">
          Technical Profile
        </p>
        <h2
          id="technical-profile-heading"
          className="max-w-3xl font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[0.98] tracking-[-0.03em] text-[#1B2733]"
        >
          WHAT I WORK WITH
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4A5A66] md:text-lg">
          From backend systems and APIs to WordPress, eCommerce, integrations and
          AI-assisted development.
        </p>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          <CategoryCard title={languages.title} skills={languages.skills} />
          <CategoryCard title={platforms.title} skills={platforms.skills} />
          <CategoryCard title={development.title} skills={development.skills} />
          <CategoryCard title={performance.title} skills={performance.skills} />
          <CategoryCard title={automation.title} skills={automation.skills} />
          <CategoryCard title={wordpress.title} skills={wordpress.skills} />
          <CategoryCard title={aiTools.title} skills={aiTools.skills} />
          <CategoryCard title={tools.title} skills={tools.skills} />
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-[#C6D5DC] bg-gradient-to-br from-[#F3F6F7] via-[#E9EFF3] to-[#F8F5F0] p-6 shadow-[0_10px_30px_rgba(27,39,51,0.05)] md:mt-16 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#4A5A66] uppercase">
                Differentiator
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.6rem,3.2vw,2.35rem)] tracking-[-0.03em] text-[#1B2733]">
                {aiEngineering.title}
              </h3>
              <p className="mt-2 text-sm text-[#4A5A66] md:text-[15px]">
                {aiEngineering.subtitle}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#4A5A66] md:text-[15px]">
                {aiEngineering.copy}
              </p>

              <div className="mt-6">
                <PillList items={aiEngineering.tools} label="AI development tools" />
              </div>

              <div
                className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2"
                aria-label="AI engineering workflow"
              >
                {aiEngineering.workflow.map((step, index) => (
                  <span key={step} className="inline-flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-[#4A5A66] uppercase">
                      {step}
                    </span>
                    {index < aiEngineering.workflow.length - 1 ? (
                      <span className="text-[#9FB5C0]" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <PillList
                  items={aiEngineering.capabilities}
                  label="AI-assisted capabilities"
                />
              </div>
            </div>

            <aside className="rounded-xl border border-[#C6D5DC] bg-white/70 p-5 md:p-6">
              <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#4A5A66] uppercase">
                Featured · AI-assisted build
              </p>
              <h4 className="mt-3 font-display text-xl tracking-tight text-[#1B2733] md:text-2xl">
                {aiEngineering.featuredProject.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[#4A5A66]">
                {aiEngineering.featuredProject.description}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-[#4A5A66]">
                {aiEngineering.featuredProject.workflowNote}
              </p>

              <div className="mt-5">
                <PillList
                  items={aiEngineering.featuredProject.tools}
                  label="Project tools"
                />
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-2" aria-label="Project stages">
                {aiEngineering.featuredProject.stages.map((stage) => (
                  <li
                    key={stage}
                    className="rounded-lg border border-[#D4DFE4] bg-[#EEF3F5]/80 px-3 py-2 font-mono text-[10px] font-bold tracking-[0.12em] text-[#4A5A66] uppercase"
                  >
                    {stage}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
