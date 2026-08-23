import {
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'

type Shared = {
  children: ReactNode
  className?: string
  magnetic?: boolean
}

type AsButton = Shared &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type AsLink = Shared &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function MagneticButton(props: AsButton | AsLink) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const { children, className, magnetic = true } = props

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`
  }

  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
  }

  const classes = cn(
    'inline-flex items-center justify-center gap-2 border border-text bg-text px-6 py-3 font-mono text-[11px] tracking-[0.16em] uppercase text-bg transition-[transform,border-color,background-color,color] duration-200 hover:bg-steel hover:border-steel',
    className,
  )

  if ('href' in props && props.href) {
    const {
      children: _c,
      className: _cl,
      magnetic: _m,
      href,
      ...linkRest
    } = props
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        {...linkRest}
      >
        {children}
      </a>
    )
  }

  const {
    children: _c,
    className: _cl,
    magnetic: _m,
    ...buttonRest
  } = props as AsButton

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={classes}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      type="button"
      {...buttonRest}
    >
      {children}
    </button>
  )
}
