import { useEffect, useState } from 'react'
import { navItems } from '@/data/site'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/cn'

export function Navbar() {
  const active = useActiveSection(navItems.map((n) => n.id))
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-[background-color,border-color,box-shadow,height] duration-300',
        scrolled || open
          ? 'border-b border-border bg-bg/95 shadow-[0_1px_0_rgba(27,25,23,0.04)]'
          : 'border-b border-border/70 bg-bg/80',
      )}
    >
      <div
        className={cn(
          'section-pad flex items-center justify-between transition-[height] duration-300',
          scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[4.5rem]',
        )}
      >
        <a
          href="#home"
          className="font-display text-[13px] tracking-[0.14em] text-text uppercase md:text-sm"
          onClick={() => setOpen(false)}
        >
          Arunesh Sharma
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  'relative px-3 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-200',
                  isActive ? 'text-text' : 'text-muted hover:text-text',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute right-3 bottom-1 left-3 h-px origin-left bg-accent transition-transform duration-200',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                  aria-hidden
                />
              </a>
            )
          })}
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span
            className={cn(
              'absolute h-px w-5 bg-text transition-transform',
              open ? 'rotate-45' : '-translate-y-1.5',
            )}
          />
          <span
            className={cn(
              'absolute h-px w-5 bg-text transition-opacity',
              open ? 'opacity-0' : 'opacity-100',
            )}
          />
          <span
            className={cn(
              'absolute h-px w-5 bg-text transition-transform',
              open ? '-rotate-45' : 'translate-y-1.5',
            )}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 top-14 z-40 bg-bg transition-transform duration-300 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <nav className="section-pad flex flex-col gap-5 pt-10" aria-label="Mobile">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                'font-display text-3xl tracking-tight',
                active === item.id ? 'text-accent' : 'text-text',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
