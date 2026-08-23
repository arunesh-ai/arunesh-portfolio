import { MagneticButton } from '@/components/MagneticButton'
import { site } from '@/data/site'

export function Contact() {
  return (
    <section
      id="contact"
      className="section-pad relative overflow-hidden border-t border-border section-contact py-24 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        <p className="eyebrow mb-6">Contact</p>
        <h2 className="max-w-4xl font-display text-[clamp(2.2rem,6vw,4.75rem)] leading-[0.95] tracking-[-0.03em]">
          LET&apos;S BUILD SOMETHING THAT WORKS.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Open to opportunities, interesting projects and engineering challenges.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <MagneticButton href={`mailto:${site.email}`} data-cursor="talk">
            Let&apos;s work together
          </MagneticButton>
          <MagneticButton
            href={site.resumeUrl}
            data-cursor="link"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-transparent text-text hover:border-border-strong hover:bg-bg-elevated"
          >
            View resume
          </MagneticButton>
          <MagneticButton
            href={site.linkedin}
            data-cursor="link"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-transparent text-text hover:border-border-strong hover:bg-bg-elevated"
          >
            LinkedIn
          </MagneticButton>
        </div>

        <dl className="mt-14 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="eyebrow">Email</dt>
            <dd className="mt-2 break-all">
              <a
                href={`mailto:${site.email}`}
                className="text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
                data-cursor="link"
              >
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">LinkedIn</dt>
            <dd className="mt-2">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
                data-cursor="link"
              >
                linkedin.com/in/arunesh-sharma
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Phone</dt>
            <dd className="mt-2">
              <a
                href={`tel:${site.phone}`}
                className="text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
                data-cursor="link"
              >
                {site.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Location</dt>
            <dd className="mt-2 text-steel">{site.location}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
