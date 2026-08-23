/**
 * AI × Engineering — standalone section.
 *
 * DISABLED in App.tsx (commented out) because AI capability is now represented
 * inside Technical Profile / WHAT I WORK WITH.
 *
 * Keep this file so the section can be restored later without rewriting.
 */
export function AIEngineering() {
  return (
    <section
      id="ai"
      className="section-pad border-t border-border section-ai py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-3">Workflow</p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-[0.98] tracking-[-0.03em] text-text">
              AI × ENGINEERING
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted md:text-[15px]">
              AI accelerates my workflow.
              <br />
              Engineering judgment controls the result.
            </p>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-faint">
              Tools I work with in this workflow:{' '}
              <span className="text-muted">Cursor</span>,{' '}
              <span className="text-muted">ChatGPT</span>, and{' '}
              <span className="text-muted">Claude</span>.
            </p>
          </div>

          <div className="border border-border bg-bg/80 p-5 shadow-[0_2px_16px_rgba(28,26,24,0.06)] md:p-7">
            <p className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
              Case study · AI-assisted build
            </p>
            <h3 className="mt-3 font-display text-xl tracking-tight text-text md:text-2xl">
              Ultimate Form Builder
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted md:text-[15px]">
              Built to bring advanced form-building capabilities commonly found behind
              paid Gravity Forms features and paid Contact Form 7 extensions into a custom
              WordPress solution.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-faint">
              Built using an AI-assisted development workflow with Cursor, ChatGPT and
              Claude — across architecture exploration, implementation, debugging, testing,
              iteration, refactoring and problem solving. Developer-led throughout; not
              “AI wrote the code.”
            </p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                'Architecture exploration',
                'Implementation & iteration',
                'Debugging & testing',
                'Feature refinement',
              ].map((item) => (
                <li
                  key={item}
                  className="border border-border/80 bg-bg-elevated/50 px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-muted uppercase"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
