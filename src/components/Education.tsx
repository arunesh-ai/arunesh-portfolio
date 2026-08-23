import { education } from '@/data/experience'

export function Education() {
  return (
    <section
      id="education"
      className="section-pad section-education border-t border-border py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-5">Education</p>
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.03em] text-text">
          ACADEMIC BACKGROUND
        </h2>

        <ul className="mt-12 divide-y divide-border border-t border-border">
          {education.map((item) => (
            <li
              key={item.id}
              className="grid gap-2 py-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-baseline md:gap-10"
            >
              <div>
                <h3 className="font-display text-xl tracking-tight text-text md:text-2xl">
                  {item.degree}
                </h3>
                {item.field ? (
                  <p className="mt-1 text-sm text-steel md:text-base">{item.field}</p>
                ) : null}
              </div>
              <div className="md:text-right">
                <p className="text-sm text-muted md:text-base">{item.school}</p>
                <p className="mt-1 font-mono text-[11px] tracking-wide text-faint">
                  {item.period} · {item.result}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
