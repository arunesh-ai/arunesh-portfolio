import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

type BrowserFrameProps = {
  title: string
  url: string
  index?: number
  technologies?: string[]
  image?: string
  className?: string
  compact?: boolean
}

export function BrowserFrame({
  title,
  url,
  index,
  technologies = [],
  image,
  className,
  compact = false,
}: BrowserFrameProps) {
  const [hasImage, setHasImage] = useState(false)

  useEffect(() => {
    if (!image) {
      setHasImage(false)
      return
    }
    let active = true
    const img = new Image()
    img.onload = () => {
      if (active) setHasImage(true)
    }
    img.onerror = () => {
      if (active) setHasImage(false)
    }
    img.src = image
    return () => {
      active = false
    }
  }, [image])

  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  })()

  const projectNo = index != null ? String(index).padStart(2, '0') : null

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden border border-border bg-bg-elevated shadow-[0_3px_16px_rgba(28,26,24,0.07)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-2 border-b border-border',
          compact ? 'px-2.5 py-1.5' : 'px-3 py-2.5 sm:px-4 sm:py-3',
        )}
      >
        <div className="flex gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
          <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
          <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        </div>
        <div
          className={cn(
            'min-w-0 flex-1 truncate border border-border bg-bg font-mono tracking-wide text-muted',
            compact ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]',
          )}
        >
          https://{host}
        </div>
        {projectNo && (
          <span className="hidden shrink-0 font-mono text-[9px] tracking-[0.14em] text-faint uppercase sm:inline">
            {projectNo}
          </span>
        )}
      </div>

      <div
        className={cn(
          'relative min-h-0 flex-1 overflow-hidden bg-surface',
          compact ? 'aspect-[16/9] max-h-[38vh]' : 'aspect-[16/10]',
        )}
      >
        {hasImage && image ? (
          <img
            src={image}
            alt={`${title} website preview`}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" aria-hidden />

            <div
              className={cn(
                'relative flex items-start justify-between gap-3',
                compact ? 'p-3 sm:p-4' : 'p-5 sm:p-7',
              )}
            >
              <div>
                <p className="font-mono text-[9px] tracking-[0.16em] text-faint uppercase">
                  {projectNo ? `Project ${projectNo}` : 'Production'}
                </p>
                <p className="mt-0.5 font-mono text-[9px] tracking-[0.12em] text-faint uppercase">
                  Live site
                </p>
              </div>
              <p className="font-mono text-[9px] tracking-[0.14em] text-faint">HTTP 200</p>
            </div>

            <div className={cn('relative', compact ? 'px-3 sm:px-4' : 'px-5 sm:px-7')}>
              <p
                className={cn(
                  'font-display tracking-tight text-text',
                  compact
                    ? 'text-[clamp(1.15rem,2.2vw,1.75rem)]'
                    : 'text-[clamp(1.5rem,3.5vw,2.5rem)]',
                )}
              >
                {title}
              </p>
              <p className="mt-1 truncate font-mono text-[10px] text-muted">{url}</p>
            </div>

            <div
              className={cn(
                'relative flex flex-wrap gap-1.5',
                compact ? 'p-3 sm:p-4' : 'p-5 sm:p-7',
              )}
            >
              {(technologies.length > 0 ? technologies.slice(0, compact ? 3 : 6) : ['Production web']).map(
                (tech) => (
                  <span
                    key={tech}
                    className="border border-border bg-bg/50 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted uppercase"
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
