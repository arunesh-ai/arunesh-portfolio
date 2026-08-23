import { site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="section-pad border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.12em] uppercase">
            {site.name}
          </p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
            {site.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-5 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
          <a href={`mailto:${site.email}`} data-cursor="link" className="hover:text-text">
            Email
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="hover:text-text"
          >
            LinkedIn
          </a>
          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="hover:text-text"
          >
            Resume
          </a>
        </div>

        <p className="font-mono text-[10px] tracking-[0.14em] text-faint">
          © {year} · Arunesh Sharma
        </p>
      </div>
    </footer>
  )
}
