import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? 'home')

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return active
}
