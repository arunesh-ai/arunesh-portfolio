import { useEffect, useRef } from 'react'
import type {
  Body,
  Engine as MatterEngine,
  Mouse as MatterMouse,
  MouseConstraint as MatterMouseConstraint,
  Runner as MatterRunner,
} from 'matter-js'
import { site } from '@/data/site'
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery'

type Kind = 'skill' | 'contact'

interface PlayItem {
  id: string
  display: string
  sub?: string
  w: number
  h: number
  bg: string
  fg: string
  shape: 'pill' | 'card'
  kind: Kind
  href?: string
  /** Included in the simplified mobile/reduced-motion list */
  mobile?: boolean
}

interface BodyMeta {
  restX: number
  restY: number
  anchorX: number
  anchorY: number
  floatPhase: number
  restRX: number
  restRY: number
  disturbedUntil: number
  contactReturning: boolean
  /** False until the body has fallen into the canvas — gates the top clamp */
  entered: boolean
}

const CONTACT: PlayItem[] = [
  {
    id: 'email',
    display: site.email,
    sub: 'EMAIL',
    w: 196,
    h: 48,
    bg: '#B8C9DA',
    fg: '#1E2C3C',
    shape: 'card',
    kind: 'contact',
    href: `mailto:${site.email}`,
  },
  {
    id: 'phone',
    display: site.phone,
    sub: 'PHONE',
    w: 132,
    h: 48,
    bg: '#B8CFC4',
    fg: '#1A2E26',
    shape: 'card',
    kind: 'contact',
    href: `tel:${site.phone}`,
  },
]

const SKILLS: PlayItem[] = [
  { id: 'php', display: 'PHP', w: 62, h: 32, bg: '#C8D5E2', fg: '#28384A', shape: 'pill', kind: 'skill', mobile: true },
  { id: 'wordpress', display: 'WordPress', w: 92, h: 34, bg: '#D8D2C8', fg: '#2C2010', shape: 'card', kind: 'skill', mobile: true },
  { id: 'woocommerce', display: 'WooCommerce', w: 106, h: 34, bg: '#E2DDD4', fg: '#2C2010', shape: 'card', kind: 'skill', mobile: true },
  { id: 'javascript', display: 'JavaScript', w: 96, h: 32, bg: '#E8DCC8', fg: '#38280E', shape: 'pill', kind: 'skill', mobile: true },
  { id: 'mysql', display: 'MySQL', w: 74, h: 32, bg: '#DCCECE', fg: '#381E1E', shape: 'card', kind: 'skill', mobile: true },
  { id: 'react', display: 'React', w: 70, h: 32, bg: '#D5D2EA', fg: '#2E2858', shape: 'pill', kind: 'skill', mobile: true },
  { id: 'jquery', display: 'jQuery', w: 74, h: 32, bg: '#C6D4E4', fg: '#182C40', shape: 'pill', kind: 'skill' },
  { id: 'rest', display: 'REST APIs', w: 90, h: 32, bg: '#C2D6CE', fg: '#162C28', shape: 'pill', kind: 'skill', mobile: true },
  { id: 'acf', display: 'ACF', w: 62, h: 32, bg: '#DECEC8', fg: '#38201A', shape: 'pill', kind: 'skill' },
  { id: 'wpml', display: 'WPML', w: 70, h: 32, bg: '#D0DCC8', fg: '#1E2C18', shape: 'pill', kind: 'skill' },
  { id: 'elementor', display: 'Elementor', w: 90, h: 32, bg: '#DCD8D0', fg: '#28201A', shape: 'card', kind: 'skill' },
  { id: 'zapier', display: 'Zapier', w: 72, h: 32, bg: '#DCCECE', fg: '#381E1E', shape: 'pill', kind: 'skill' },
  { id: 'git', display: 'Git', w: 62, h: 32, bg: '#D8C8BC', fg: '#32200C', shape: 'pill', kind: 'skill', mobile: true },
  { id: 'github', display: 'GitHub', w: 76, h: 32, bg: '#C8D5E2', fg: '#28384A', shape: 'pill', kind: 'skill' },
  { id: 'cloudflare', display: 'Cloudflare', w: 92, h: 32, bg: '#E8DCC8', fg: '#38280E', shape: 'card', kind: 'skill' },
  { id: 'klaviyo', display: 'Klaviyo', w: 76, h: 32, bg: '#C8D8D0', fg: '#1A3028', shape: 'pill', kind: 'skill' },
  { id: 'cursor', display: 'Cursor', w: 74, h: 32, bg: '#D8D2C8', fg: '#2C2010', shape: 'pill', kind: 'skill' },
]

const ALL_ITEMS = [...CONTACT, ...SKILLS]
const MOBILE_SKILLS = SKILLS.filter((item) => item.mobile)

/**
 * Deterministic composition: contacts float in the top band, skills occupy the lower
 * band only. Row index also drives the spawn wave, so nothing drops as one clump and
 * nothing comes to rest in the EMAIL / PHONE band.
 */
const SKILL_GRID: { y: number; cols: { id: string; x: number }[] }[] = [
  // Widest blocks are in the last row: they fall first and form a stable base, while
  // the small blocks land on top where the cursor can knock them around freely.
  { y: 0.46, cols: [{ id: 'git', x: 0.20 }, { id: 'acf', x: 0.40 }, { id: 'php', x: 0.60 }, { id: 'wpml', x: 0.80 }] },
  { y: 0.58, cols: [{ id: 'react', x: 0.16 }, { id: 'mysql', x: 0.36 }, { id: 'zapier', x: 0.54 }, { id: 'cursor', x: 0.72 }, { id: 'jquery', x: 0.90 }] },
  { y: 0.70, cols: [{ id: 'klaviyo', x: 0.16 }, { id: 'github', x: 0.38 }, { id: 'rest', x: 0.60 }, { id: 'elementor', x: 0.84 }] },
  { y: 0.84, cols: [{ id: 'javascript', x: 0.16 }, { id: 'wordpress', x: 0.40 }, { id: 'woocommerce', x: 0.66 }, { id: 'cloudflare', x: 0.90 }] },
]

const LAYOUT: Record<string, { x: number; y: number }> = {
  email: { x: 0.28, y: 0.10 },
  phone: { x: 0.72, y: 0.10 },
}

/** Spawn wave per skill — lower rows fall first so the pile builds from the floor up */
const SPAWN_ROW: Record<string, number> = {}

SKILL_GRID.forEach((row, rowIndex) => {
  for (const col of row.cols) {
    LAYOUT[col.id] = { x: col.x, y: row.y }
    SPAWN_ROW[col.id] = SKILL_GRID.length - 1 - rowIndex
  }
})

const CLICK_DRAG_THRESHOLD = 8
const SETTLE_MS = 2500
const REST_CAPTURE_MAX_MS = 9000
const MAX_DISPLACEMENT_SCALE = 0.1 // ~30–48px responsive cap

/** Skill labels must stay readable, so blocks are eased back toward horizontal */
const LEVEL_WINDOW_MS = 6000
const LEVEL_TOLERANCE = 0.07

const normalizeAngle = (angle: number) => {
  const wrapped = ((angle + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
  return wrapped - Math.PI
}

const SKILL_FRICTION = 0.92
const SKILL_FRICTION_STATIC = 0.95
const SKILL_FRICTION_KICKED = 0.2
const SKILL_FRICTION_STATIC_KICKED = 0.08

/** Radius-tiered cursor interaction: strong nearby, subtle at the edge, nothing beyond */
const IMPULSE_TIERS = [
  { radius: 72, strength: 1, cooldown: 130 },
  { radius: 112, strength: 0.6, cooldown: 200 },
  { radius: 152, strength: 0.2, cooldown: 340 },
] as const

/** Skills collide with skills + walls only — contacts are visual overlays, not obstacles */
const CATEGORY_SKILL = 0x0001
const CATEGORY_CONTACT = 0x0002
const CATEGORY_WALL = 0x0004

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function syncMouseFromEvent(mouse: MatterMouse, canvas: HTMLCanvasElement, e: MouseEvent | PointerEvent) {
  const rect = canvas.getBoundingClientRect()
  mouse.position.x = e.clientX - rect.left
  mouse.position.y = e.clientY - rect.top
  mouse.absolute.x = e.clientX
  mouse.absolute.y = e.clientY
}

export function PhysicsPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 1023px)')

  useEffect(() => {
    if (reduced || isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    if (!container) return

    let disposed = false
    let cleanup: (() => void) | undefined

    import('matter-js')
      .then((Matter) => {
        if (disposed || !canvasRef.current) return

        const {
          Engine,
          Bodies,
          Body,
          Composite,
          Mouse,
          MouseConstraint,
          Runner,
          Events,
          Query,
          Sleeping,
        } = Matter

        let engine: MatterEngine | null = null
        let runner: MatterRunner | null = null
        let mouse: MatterMouse | null = null
        let mouseConstraint: MatterMouseConstraint | null = null
        let floor: Body | null = null
        let leftWall: Body | null = null
        let rightWall: Body | null = null
        let ceiling: Body | null = null
        let bodies: Body[] = []
        /** Skills first, contacts last — EMAIL / PHONE always paint above the stack */
        let drawBodies: Body[] = []
        let itemMap = new Map<string, PlayItem>()
        let metaMap = new Map<string, BodyMeta>()
        let cw = 0
        let ch = 0
        let dpr = 1
        let ctx: CanvasRenderingContext2D | null = null
        let rafId = 0
        let isVisible = true
        let hoveredBody: Body | null = null
        let draggedBody: Body | null = null
        let hasInteracted = false
        let pointerDown: { x: number; y: number; body: Body | null } | null = null
        let didDrag = false
        let mouseInCanvas = false
        let settled = false
        let initialFallDone = false
        let interactionEnabled = false
        const bootAt = performance.now()

        let mouseVel = { x: 0, y: 0 }
        let impulseCount = 0
        const impulseByBody = new Map<string, number>()

        type ZoneState = { inProximity: boolean; inBody: boolean; lastImpulse: number }
        const zoneState = new Map<string, ZoneState>()

        const WALL_T = 64
        const FLOOR_INSET = 10

        const makeWall = (x: number, y: number, w: number, h: number) =>
          Bodies.rectangle(x, y, w, h, {
            isStatic: true,
            friction: 0.9,
            restitution: 0.02,
            label: '__wall__',
            collisionFilter: {
              category: CATEGORY_WALL,
              mask: CATEGORY_SKILL | CATEGORY_CONTACT | CATEGORY_WALL,
            },
          })

        const setCursorHint = (mode: 'default' | 'drag' | 'grab') => {
          if (mode === 'default') canvas.removeAttribute('data-cursor')
          else canvas.setAttribute('data-cursor', mode)
        }

        const restBounds = () => {
          const scale = Math.min(cw, ch) / 900
          return {
            rx: 25 * scale,
            ry: 20 * scale,
            maxDisp: Math.max(16, Math.min(48, Math.min(cw, ch) * MAX_DISPLACEMENT_SCALE)),
          }
        }

        const sizeCanvas = () => {
          const nextW = Math.max(280, Math.floor(container.clientWidth))
          const nextH = Math.max(320, Math.floor(container.clientHeight))
          dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = Math.floor(nextW * dpr)
          canvas.height = Math.floor(nextH * dpr)
          canvas.style.width = `${nextW}px`
          canvas.style.height = `${nextH}px`
          ctx = canvas.getContext('2d')
          if (!ctx) return false
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          cw = nextW
          ch = nextH
          return true
        }

        const updateMetaFromLayout = () => {
          const { rx, ry } = restBounds()
          for (const item of ALL_ITEMS) {
            const layout = LAYOUT[item.id] ?? { x: 0.5, y: 0.6 }
            const anchorX = layout.x * cw
            const anchorY = layout.y * ch
            const existing = metaMap.get(item.id)
            metaMap.set(item.id, {
              restX: anchorX,
              restY: anchorY,
              anchorX,
              anchorY,
              floatPhase: existing?.floatPhase ?? item.id.length * 0.7,
              restRX: rx,
              restRY: ry,
              disturbedUntil: existing?.disturbedUntil ?? 0,
              contactReturning: existing?.contactReturning ?? false,
              entered: existing?.entered ?? item.kind === 'contact',
            })
          }
        }

        const placeWalls = () => {
          if (!engine) return
          const previous = [floor, leftWall, rightWall, ceiling].filter(Boolean) as Body[]
          if (previous.length) Composite.remove(engine.world, previous)
          floor = makeWall(cw / 2, ch - FLOOR_INSET + WALL_T / 2, cw + WALL_T * 2, WALL_T)
          leftWall = makeWall(-WALL_T / 2, ch / 2, WALL_T, ch * 2 + WALL_T)
          rightWall = makeWall(cw + WALL_T / 2, ch / 2, WALL_T, ch * 2 + WALL_T)
          // Far above every spawn wave so a falling skill can never nest inside it
          ceiling = makeWall(cw / 2, -1200 - WALL_T / 2, cw + WALL_T * 2, WALL_T)
          Composite.add(engine.world, [floor, leftWall, rightWall, ceiling])
        }

        const containEscapes = () => {
          const pad = 12
          for (const body of bodies) {
            const item = itemMap.get(body.label)
            const meta = metaMap.get(body.label)
            const halfW = (body.bounds.max.x - body.bounds.min.x) / 2
            const halfH = (body.bounds.max.y - body.bounds.min.y) / 2

            if (item?.kind === 'contact' && meta) {
              if (body === draggedBody) continue
              const boundW = item.w * 0.55
              const boundH = item.h * 0.8
              const minX = meta.anchorX - boundW
              const maxX = meta.anchorX + boundW
              const minY = meta.anchorY - boundH
              const maxY = meta.anchorY + boundH + 8
              let { x, y } = body.position
              let fixed = false
              if (x < minX) { x = minX; fixed = true }
              else if (x > maxX) { x = maxX; fixed = true }
              if (y < minY) { y = minY; fixed = true }
              else if (y > maxY) { y = maxY; fixed = true }
              if (fixed && body !== draggedBody) {
                Body.setPosition(body, { x, y })
                Body.setVelocity(body, { x: body.velocity.x * 0.15, y: body.velocity.y * 0.15 })
              }
              continue
            }

            const minX = halfW + pad
            const maxX = cw - halfW - pad
            const minY = halfH + pad
            const maxY = ch - FLOOR_INSET - halfH - pad
            let { x, y } = body.position
            let fixed = false
            if (x < minX) { x = minX; fixed = true }
            else if (x > maxX) { x = maxX; fixed = true }
            // Skills spawn above the canvas: never clamp the top until they have
            // fallen in, otherwise they get teleported into the EMAIL / PHONE band.
            if (meta && !meta.entered) {
              if (y >= minY) meta.entered = true
            } else if (y < minY) {
              y = minY
              fixed = true
            }
            if (y > maxY) { y = maxY; fixed = true }
            if (fixed) {
              Body.setPosition(body, { x, y })
              Body.setVelocity(body, { x: body.velocity.x * 0.2, y: body.velocity.y * 0.2 })
            }
          }
        }

        const sleepCalmBodies = () => {
          for (const body of bodies) {
            if (body === draggedBody) continue
            const item = itemMap.get(body.label)
            if (item?.kind === 'contact') continue
            const speed = Math.hypot(body.velocity.x, body.velocity.y)
            const spin = Math.abs(body.angularVelocity)
            // don't let a block fall asleep on its side while it can still level out
            if (
              performance.now() - bootAt < LEVEL_WINDOW_MS &&
              Math.abs(normalizeAngle(body.angle)) > LEVEL_TOLERANCE
            ) {
              continue
            }
            if (speed < 0.05 && spin < 0.006) {
              Body.setVelocity(body, { x: 0, y: 0 })
              Body.setAngularVelocity(body, 0)
              Sleeping.set(body, true)
            }
          }
        }

        const applyDisturbanceImpulse = (
          body: Body,
          mx: number,
          my: number,
          strength: number,
        ) => {
          const dx = body.position.x - mx
          const dy = body.position.y - my
          const dist = Math.max(4, Math.hypot(dx, dy))
          const speedBefore = Math.hypot(body.velocity.x, body.velocity.y)

          let dirX: number
          let dirY: number
          const mSpeed = Math.hypot(mouseVel.x, mouseVel.y)
          if (mSpeed > 0.8) {
            dirX = mouseVel.x / mSpeed
            dirY = mouseVel.y / mSpeed
          } else {
            dirX = dx / dist
            dirY = dy / dist
          }

          const base = 0.055 * strength
          const mass = body.mass
          Body.applyForce(body, body.position, {
            x: dirX * base * mass,
            y: dirY * base * mass * 0.7,
          })

          // Direct kick on the block the cursor passes through: a wedged block in the
          // pile would otherwise absorb the force into its neighbours and barely move.
          // Slight upward bias lets a buried block pop out instead of pressing down.
          if (strength >= 1) {
            // A block still at rest is wedged in the pile: pop it out with a stronger,
            // more upward kick. Blocks already moving get the plain kick so repeated
            // passes cannot compound into the whole stack flying apart.
            const atRest = speedBefore < 0.4
            const kick = atRest ? 4.6 : 3.2
            let kx = dirX
            // A block pinned against a side wall would absorb an outward push, so
            // deflect it inward instead of leaving it looking unresponsive.
            const halfWidth = (body.bounds.max.x - body.bounds.min.x) / 2
            if (
              (body.position.x - halfWidth < 30 && kx < 0) ||
              (body.position.x + halfWidth > cw - 30 && kx > 0)
            ) {
              kx = -kx
            }
            const ky = dirY * 0.6 - (atRest ? 0.6 : 0.15)
            const kl = Math.hypot(kx, ky) || 1
            if (Math.hypot(body.velocity.x, body.velocity.y) < kick) {
              Body.setVelocity(body, { x: (kx / kl) * kick, y: (ky / kl) * kick })
            }
            // Let it slide out from under its neighbours; restored once it settles,
            // so the resting pile keeps its high-friction stability.
            body.friction = SKILL_FRICTION_KICKED
            body.frictionStatic = SKILL_FRICTION_STATIC_KICKED
          }
          // A block hemmed in by neighbours can barely travel, so let it rock visibly
          const spinKick = strength >= 1 && speedBefore < 0.4 ? 0.16 : 0.06
          Body.setAngularVelocity(
            body,
            body.angularVelocity + dirX * spinKick * strength,
          )

          const speed = Math.hypot(body.velocity.x, body.velocity.y)
          const cap = 2.5 + 4.5 * strength
          if (speed > cap) {
            const s = cap / speed
            Body.setVelocity(body, { x: body.velocity.x * s, y: body.velocity.y * s })
          }

          impulseCount += 1
          impulseByBody.set(body.label, (impulseByBody.get(body.label) ?? 0) + 1)
          Sleeping.set(body, false)
          const meta = metaMap.get(body.label)
          if (meta) meta.disturbedUntil = performance.now() + 2800
        }

        const processMouseDisturbance = () => {
          if (!mouse || !mouseInCanvas || draggedBody || !interactionEnabled) return

          const mx = mouse.position.x
          const my = mouse.position.y
          if (mx < 0 || my < 0 || mx > cw || my > ch) return

          const now = performance.now()
          const outerR = IMPULSE_TIERS[IMPULSE_TIERS.length - 1].radius
          const mSpeed = Math.hypot(mouseVel.x, mouseVel.y)

          for (const body of bodies) {
            const item = itemMap.get(body.label)
            if (!item || body === draggedBody) continue

            const dx = body.position.x - mx
            const dy = body.position.y - my
            const dist = Math.hypot(dx, dy)
            const inRange = dist < outerR

            const state = zoneState.get(item.id) ?? {
              inProximity: false,
              inBody: false,
              lastImpulse: 0,
            }

            if (item.kind === 'skill' && inRange) {
              const tier = IMPULSE_TIERS.find((entry) => dist < entry.radius)
              // Only a moving cursor disturbs blocks — a resting cursor can never buzz them
              const moving = mSpeed > 0.5
              if (tier && (moving || !state.inProximity) && now - state.lastImpulse > tier.cooldown) {
                applyDisturbanceImpulse(body, mx, my, tier.strength)
                state.lastImpulse = now
              }
            }

            state.inProximity = inRange
            state.inBody = dist < IMPULSE_TIERS[0].radius
            zoneState.set(item.id, state)
          }
        }

        const buildWorld = () => {
          if (!sizeCanvas()) return
          updateMetaFromLayout()

          engine = Engine.create({
            enableSleeping: true,
            gravity: { x: 0, y: 0.55, scale: 0.001 },
          })
          engine.positionIterations = 8
          engine.velocityIterations = 6

          placeWalls()

          itemMap = new Map(ALL_ITEMS.map((item) => [item.id, item]))
          bodies = []
          zoneState.clear()

          for (const item of ALL_ITEMS) {
            const layout = LAYOUT[item.id] ?? { x: 0.5, y: 0.6 }
            const meta = metaMap.get(item.id)!
            const cornerR = item.shape === 'pill' ? Math.min(item.h / 2, 18) : 10
            const isContact = item.kind === 'contact'

            let x: number
            let y: number
            if (isContact) {
              x = meta.anchorX
              y = meta.anchorY
            } else {
              // Deterministic: grid column X, staggered wave above the canvas
              const halfW = item.w / 2
              x = Math.min(cw - halfW - 14, Math.max(halfW + 14, layout.x * cw))
              y = -item.h / 2 - 30 - (SPAWN_ROW[item.id] ?? 0) * 76
            }

            const body = Bodies.rectangle(x, y, item.w, item.h, {
              label: item.id,
              chamfer: { radius: cornerR },
              // Skills: zero restitution + higher air drag so a cursor kick stays local
              // instead of propagating through the pile as a chain reaction.
              restitution: 0,
              friction: SKILL_FRICTION,
              frictionStatic: SKILL_FRICTION_STATIC,
              frictionAir: isContact ? 0.16 : 0.085,
              density: isContact ? 0.0004 : 0.0015,
              angle: 0,
              sleepThreshold: 14,
              // Contacts: sensor + never collide with skills (mask 0 + negative group)
              // Skills: collide with skills + walls only
              isSensor: isContact,
              collisionFilter: isContact
                ? { category: CATEGORY_CONTACT, mask: 0, group: -1 }
                : { category: CATEGORY_SKILL, mask: CATEGORY_SKILL | CATEGORY_WALL, group: 0 },
            })

            if (isContact) {
              ;(body as Body & { gravityScale: number }).gravityScale = 0
              Body.setVelocity(body, { x: 0, y: 0 })
              Body.setAngle(body, 0)
              Body.setAngularVelocity(body, 0)
            } else {
              Body.setVelocity(body, { x: 0, y: 0.4 })
              Body.setAngularVelocity(body, (item.id.charCodeAt(0) % 3 - 1) * 0.008)
            }

            bodies.push(body)
          }

          Composite.add(engine.world, bodies)

          drawBodies = [
            ...bodies.filter((b) => itemMap.get(b.label)?.kind !== 'contact'),
            ...bodies.filter((b) => itemMap.get(b.label)?.kind === 'contact'),
          ]

          mouse = Mouse.create(canvas)
          mouse.pixelRatio = dpr

          mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: {
              stiffness: 0.2,
              damping: 0.3,
              render: { visible: false },
            },
          })
          Composite.add(engine.world, mouseConstraint)

          const wheelHandler = (mouse as unknown as { mousewheel: EventListener }).mousewheel
          if (wheelHandler) {
            canvas.removeEventListener('mousewheel', wheelHandler)
            canvas.removeEventListener('DOMMouseScroll', wheelHandler)
            canvas.removeEventListener('wheel', wheelHandler)
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Events.on(mouseConstraint, 'startdrag', (ev: any) => {
            draggedBody = (ev.body as Body) ?? null
            if (draggedBody) {
              Sleeping.set(draggedBody, false)
              const meta = metaMap.get(draggedBody.label)
              if (meta) meta.disturbedUntil = performance.now() + 4000
            }
            didDrag = true
            setCursorHint('grab')
            if (!hasInteracted) {
              hasInteracted = true
              if (labelRef.current) labelRef.current.style.opacity = '0'
            }
          })

          Events.on(mouseConstraint, 'enddrag', () => {
            const released = draggedBody
            draggedBody = null
            setCursorHint(hoveredBody ? 'drag' : 'default')
            if (released) {
              const item = itemMap.get(released.label)
              if (item?.kind === 'contact') {
                const meta = metaMap.get(item.id)
                if (meta) {
                  meta.contactReturning = true
                  Body.setVelocity(released, { x: 0, y: 0 })
                  Body.setAngularVelocity(released, 0)
                }
              }
            }
          })

          Events.on(engine, 'beforeUpdate', () => {
            if (!engine) return
            const now = performance.now()
            const t = now * 0.001
            const elapsed = now - bootAt
            const { maxDisp } = restBounds()

            if (!initialFallDone && elapsed > SETTLE_MS) {
              const skillBodies = bodies.filter((b) => itemMap.get(b.label)?.kind === 'skill')
              const allSleeping =
                skillBodies.length > 0 &&
                skillBodies.every((b) => b.isSleeping)
              if (allSleeping || elapsed > REST_CAPTURE_MAX_MS) {
                initialFallDone = true
                interactionEnabled = true
                for (const body of skillBodies) {
                  const meta = metaMap.get(body.label)
                  if (!meta) continue
                  meta.restX = body.position.x
                  meta.restY = body.position.y
                }
              }
            }

            for (const body of bodies) {
              if (body === draggedBody) continue
              const item = itemMap.get(body.label)
              const meta = metaMap.get(body.label)
              if (!item || !meta) continue

              if (item.kind === 'contact') {
                const floatX = meta.contactReturning
                  ? 0
                  : Math.sin(t * 0.55 + meta.floatPhase) * 1.6
                const floatY = meta.contactReturning
                  ? 0
                  : Math.sin(t * 0.42 + meta.floatPhase * 1.2) * 2.0

                // Subtle cursor response — an anchor offset, never a collision, so a
                // contact card can drift away from the cursor and glide back level.
                let cursorX = 0
                let cursorY = 0
                if (mouse && mouseInCanvas && !meta.contactReturning) {
                  const mdx = body.position.x - mouse.position.x
                  const mdy = body.position.y - mouse.position.y
                  const mdist = Math.hypot(mdx, mdy)
                  const reach = Math.max(item.w, item.h) * 0.6 + 60
                  if (mdist < reach && mdist > 0.001) {
                    const pushed = (1 - mdist / reach) * 12
                    cursorX = (mdx / mdist) * pushed
                    cursorY = (mdy / mdist) * pushed * 0.6
                  }
                }

                const targetX = meta.anchorX + floatX + cursorX
                const targetY = meta.anchorY + floatY + cursorY
                const returnRate = meta.contactReturning ? 0.14 : 0.08

                if (body !== draggedBody) {
                  const dx = targetX - body.position.x
                  const dy = targetY - body.position.y
                  const dist = Math.hypot(dx, dy)
                  if (dist > 0.35) {
                    Body.setPosition(body, {
                      x: body.position.x + dx * returnRate,
                      y: body.position.y + dy * returnRate,
                    })
                  }
                  Body.setVelocity(body, { x: 0, y: 0 })
                  Body.setAngle(body, 0)
                  Body.setAngularVelocity(body, 0)
                  if (meta.contactReturning && dist < 1.2) {
                    meta.contactReturning = false
                    Body.setPosition(body, { x: meta.anchorX, y: meta.anchorY })
                  }
                }
                continue
              }

              // Ease tilted blocks back toward horizontal while they are settling or
              // recovering from a cursor hit; outside those windows nothing is applied,
              // so a resting pile stays perfectly still.
              if ((elapsed < LEVEL_WINDOW_MS || now < meta.disturbedUntil) && !body.isSleeping) {
                const tilt = normalizeAngle(body.angle)
                // wait until it slows down, so a freshly hit block can still rock freely
                const slowing = Math.hypot(body.velocity.x, body.velocity.y) < 0.8
                if (slowing && Math.abs(tilt) > LEVEL_TOLERANCE) {
                  Body.setAngle(body, body.angle - Math.sign(tilt) * Math.min(Math.abs(tilt), 0.05))
                  Body.setAngularVelocity(body, body.angularVelocity * 0.7)
                }
              }

              if (!initialFallDone) continue
              if (now >= meta.disturbedUntil && body.friction !== SKILL_FRICTION) {
                body.friction = SKILL_FRICTION
                body.frictionStatic = SKILL_FRICTION_STATIC
              }
              if (now < meta.disturbedUntil) {
                const offX = body.position.x - meta.restX
                const offY = body.position.y - meta.restY
                const offDist = Math.hypot(offX, offY)
                const outsideRest =
                  Math.abs(offX) > meta.restRX || Math.abs(offY) > meta.restRY

                if (offDist > maxDisp) {
                  // Spring back rather than teleport: repositioning a body inside the
                  // pile injects overlap, which the solver resolves as a violent
                  // separation and sends the disturbance across the whole stack.
                  const pull = 0.0007
                  Body.applyForce(body, body.position, {
                    x: -offX * pull * body.mass,
                    y: -offY * pull * body.mass,
                  })
                  Body.setVelocity(body, {
                    x: body.velocity.x * 0.92,
                    y: body.velocity.y * 0.92,
                  })
                  // absolute safety net only — far outside any normal disturbance
                  if (offDist > maxDisp * 2.4) {
                    const scale = (maxDisp * 2.4) / offDist
                    Body.setPosition(body, {
                      x: meta.restX + offX * scale,
                      y: meta.restY + offY * scale,
                    })
                  }
                } else if (outsideRest) {
                  const speed = Math.hypot(body.velocity.x, body.velocity.y)
                  if (speed < 1.2) {
                    const pull = 0.0001
                    Body.applyForce(body, body.position, {
                      x: -offX * pull * body.mass,
                      y: -offY * pull * body.mass,
                    })
                  }
                }

                if (offDist < 8 && outsideRest) {
                  const speed = Math.hypot(body.velocity.x, body.velocity.y)
                  const spin = Math.abs(body.angularVelocity)
                  if (speed < 0.1 && spin < 0.012) {
                    Body.applyForce(body, body.position, {
                      x: -offX * 0.00006 * body.mass,
                      y: -offY * 0.00006 * body.mass,
                    })
                  }
                }
              }
            }
          })

          ;(window as unknown as { __impulseCount?: () => number }).__impulseCount = () => impulseCount
          ;(window as unknown as { __impulsesByBody?: () => Record<string, number> }).__impulsesByBody =
            () => Object.fromEntries(impulseByBody)

          // Exposes the actual Matter collision filtering decisions, so the contract
          // "skills never collide with EMAIL / PHONE" can be asserted directly.
          ;(window as unknown as { __collisionMatrix?: () => unknown }).__collisionMatrix = () => {
            const canCollide = Matter.Detector.canCollide
            const skill = bodies.find((b) => itemMap.get(b.label)?.kind === 'skill')
            const skill2 = bodies.filter((b) => itemMap.get(b.label)?.kind === 'skill')[1]
            const contact = bodies.find((b) => itemMap.get(b.label)?.kind === 'contact')
            const contact2 = bodies.filter((b) => itemMap.get(b.label)?.kind === 'contact')[1]
            const wall = floor
            if (!skill || !skill2 || !contact || !contact2 || !wall) return null
            return {
              skillSkill: canCollide(skill.collisionFilter, skill2.collisionFilter),
              skillWall: canCollide(skill.collisionFilter, wall.collisionFilter),
              skillContact: canCollide(skill.collisionFilter, contact.collisionFilter),
              contactContact: canCollide(contact.collisionFilter, contact2.collisionFilter),
              contactsAreSensors: contact.isSensor && contact2.isSensor,
              contactPairs: bodies
                .filter((b) => itemMap.get(b.label)?.kind === 'contact')
                .map((c) => ({
                  id: c.label,
                  isSensor: c.isSensor,
                  collidesWithAnySkill: bodies
                    .filter((b) => itemMap.get(b.label)?.kind === 'skill')
                    .some((s) => canCollide(c.collisionFilter, s.collisionFilter)),
                })),
            }
          }
          ;(window as unknown as { __physicsReady?: () => boolean }).__physicsReady = () => interactionEnabled

          runner = Runner.create()
          Runner.run(runner, engine)

          ;(window as unknown as {
            __physicsGet?: () => {
              id: string
              kind: string
              x: number
              y: number
              w: number
              h: number
              angle: number
              sleeping: boolean
              restX: number
              restY: number
            }[]
            __physicsMouse?: () => { x: number; y: number; inCanvas: boolean }
          }).__physicsGet = () =>
            bodies.map((b) => {
              const meta = metaMap.get(b.label)
              const item = itemMap.get(b.label)
              return {
                id: b.label,
                kind: item?.kind ?? 'skill',
                x: b.position.x,
                y: b.position.y,
                w: item?.w ?? 0,
                h: item?.h ?? 0,
                angle: b.angle,
                sleeping: b.isSleeping,
                restX: meta?.restX ?? 0,
                restY: meta?.restY ?? 0,
              }
            })

          ;(window as unknown as { __physicsMouse?: () => { x: number; y: number; inCanvas: boolean } }).__physicsMouse =
            () => ({
              x: mouse?.position.x ?? -1,
              y: mouse?.position.y ?? -1,
              inCanvas: mouseInCanvas,
            })
        }

        const onPointerMove = (e: PointerEvent) => {
          if (!mouse) return
          mouseInCanvas = true
          settled = false

          const prevX = mouse.position.x
          const prevY = mouse.position.y
          syncMouseFromEvent(mouse, canvas, e)
          mouseVel = {
            x: mouse.position.x - prevX,
            y: mouse.position.y - prevY,
          }

          processMouseDisturbance()

          if (pointerDown && !didDrag) {
            const dx = e.clientX - pointerDown.x
            const dy = e.clientY - pointerDown.y
            if (Math.hypot(dx, dy) > CLICK_DRAG_THRESHOLD) didDrag = true
          }
        }

        const onPointerDown = (e: PointerEvent) => {
          if (!mouse || e.button !== 0) return
          mouseInCanvas = true
          syncMouseFromEvent(mouse, canvas, e)
          const hit = (Query.point(bodies, mouse.position) as Body[])[0] ?? null
          if (hit) Sleeping.set(hit, false)
          pointerDown = { x: e.clientX, y: e.clientY, body: hit }
          didDrag = false
        }

        const onPointerUp = () => {
          if (pointerDown && !didDrag && pointerDown.body) {
            const item = itemMap.get(pointerDown.body.label)
            if (item?.href) window.location.href = item.href
          }
          pointerDown = null
          didDrag = false
        }

        const onPointerLeave = () => {
          mouseInCanvas = false
          mouseVel = { x: 0, y: 0 }
          if (mouse) {
            mouse.position.x = -9999
            mouse.position.y = -9999
          }
          hoveredBody = null
          for (const [id, state] of zoneState) {
            zoneState.set(id, { ...state, inProximity: false, inBody: false })
          }
          if (!draggedBody) setCursorHint('default')
        }

        const tick = () => {
          rafId = requestAnimationFrame(tick)
          if (!isVisible || !ctx || !engine || !mouse) return

          const elapsed = performance.now() - bootAt
          if (elapsed > SETTLE_MS && !draggedBody && !mouseInCanvas) {
            sleepCalmBodies()
            settled = true
          } else if (settled && !draggedBody && !mouseInCanvas) {
            sleepCalmBodies()
          }

          containEscapes()

          const mp = mouse.position
          hoveredBody = draggedBody
            ? draggedBody
            : mouseInCanvas
              ? ((Query.point(bodies, mp) as Body[])[0] ?? null)
              : null

          if (!draggedBody) setCursorHint(hoveredBody ? 'drag' : 'default')

          ctx.clearRect(0, 0, cw, ch)

          for (const body of drawBodies) {
            const item = itemMap.get(body.label)
            if (!item) continue

            const { x, y } = body.position
            const angle = body.angle
            const isHover = body === hoveredBody
            const isDrag = body === draggedBody
            const isContact = item.kind === 'contact'
            const hw = item.w / 2
            const hh = item.h / 2
            const r = item.shape === 'pill' ? Math.min(hh, 18) : 10

            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle)
            if (isDrag) ctx.scale(1.03, 1.03)
            else if (isHover && isContact) ctx.scale(1.02, 1.02)

            ctx.shadowColor = isDrag
              ? 'rgba(0,0,0,0.18)'
              : isHover
                ? 'rgba(0,0,0,0.12)'
                : isContact
                  ? 'rgba(0,0,0,0.10)'
                  : 'rgba(0,0,0,0.06)'
            ctx.shadowBlur = isDrag ? 18 : isHover ? 11 : isContact ? 12 : 6
            ctx.shadowOffsetY = isDrag ? 6 : isHover ? 3 : isContact ? 3 : 2

            drawRoundRect(ctx, -hw, -hh, item.w, item.h, r)
            ctx.fillStyle = item.bg
            ctx.fill()

            ctx.shadowColor = 'transparent'
            ctx.shadowBlur = 0
            ctx.shadowOffsetY = 0

            drawRoundRect(ctx, -hw, -hh, item.w, item.h, r)
            ctx.strokeStyle = isContact ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.08)'
            ctx.lineWidth = 1
            ctx.stroke()

            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = item.fg

            if (isContact && item.sub) {
              ctx.font = '600 8px "IBM Plex Mono", "Courier New", monospace'
              ctx.globalAlpha = 0.65
              ctx.fillText(item.sub, 0, -9)
              ctx.globalAlpha = 1
              ctx.font = '600 10px "IBM Plex Mono", "Courier New", monospace'
              let text = item.display
              while (ctx.measureText(text).width > item.w - 16 && text.length > 8) {
                text = `${text.slice(0, -2)}…`
              }
              ctx.fillText(text, 0, 6)
            } else {
              ctx.font = '600 11px "IBM Plex Mono", "Courier New", monospace'
              ctx.fillText(item.display, 0, 0)
            }

            ctx.restore()
          }
        }

        const onResize = () => {
          if (!engine || !floor) return
          const prevW = cw
          const prevH = ch
          if (!sizeCanvas()) return
          if (mouse) mouse.pixelRatio = dpr
          updateMetaFromLayout()
          placeWalls()
          if (prevW > 0 && prevH > 0) {
            const sx = cw / prevW
            const sy = ch / prevH
            for (const body of bodies) {
              const item = itemMap.get(body.label)
              const meta = metaMap.get(body.label)
              if (!meta) continue
              Sleeping.set(body, false)
              if (item?.kind === 'contact') {
                Body.setPosition(body, { x: meta.anchorX, y: meta.anchorY })
              } else {
                Body.setPosition(body, {
                  x: body.position.x * sx,
                  y: Math.min(body.position.y * sy, ch - FLOOR_INSET - 28),
                })
              }
              Body.setVelocity(body, { x: 0, y: 0 })
            }
          }
          settled = false
          initialFallDone = performance.now() - bootAt > SETTLE_MS
        }

        const boot = () => {
          if (disposed) return
          if (container.clientWidth < 40 || container.clientHeight < 40) {
            requestAnimationFrame(boot)
            return
          }

          buildWorld()
          tick()

          canvas.addEventListener('pointermove', onPointerMove, { passive: true })
          canvas.addEventListener('pointerdown', onPointerDown, { passive: true })
          window.addEventListener('pointerup', onPointerUp, { passive: true })
          canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })

          const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting
            if (!runner || !engine) return
            if (isVisible) Runner.run(runner, engine)
            else Runner.stop(runner)
          })
          observer.observe(canvas)

          const ro = new ResizeObserver(() => onResize())
          ro.observe(container)

          cleanup = () => {
            cancelAnimationFrame(rafId)
            observer.disconnect()
            ro.disconnect()
            canvas.removeEventListener('pointermove', onPointerMove)
            canvas.removeEventListener('pointerdown', onPointerDown)
            window.removeEventListener('pointerup', onPointerUp)
            canvas.removeEventListener('pointerleave', onPointerLeave)
            if (runner) Runner.stop(runner)
            if (engine) {
              Engine.clear(engine)
              Composite.clear(engine.world, false)
            }
            delete (window as unknown as { __physicsGet?: unknown }).__physicsGet
            delete (window as unknown as { __physicsMouse?: unknown }).__physicsMouse
            delete (window as unknown as { __impulseCount?: unknown }).__impulseCount
            delete (window as unknown as { __impulsesByBody?: unknown }).__impulsesByBody
            delete (window as unknown as { __collisionMatrix?: unknown }).__collisionMatrix
            delete (window as unknown as { __physicsReady?: unknown }).__physicsReady
            setCursorHint('default')
          }
        }

        boot()
      })
      .catch(() => {
        /* graceful degradation */
      })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [reduced, isMobile])

  if (isMobile || reduced) {
    return (
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {CONTACT.map((t) => (
            <a
              key={t.id}
              href={t.href}
              className="border border-border px-3.5 py-2 font-mono text-[10px] tracking-[0.06em] transition-opacity hover:opacity-80"
              style={{ backgroundColor: t.bg, color: t.fg }}
              data-cursor="link"
            >
              <span className="block text-[8px] tracking-[0.14em] uppercase opacity-70">{t.sub}</span>
              {t.display}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {MOBILE_SKILLS.map((t) => (
            <span
              key={t.id}
              className="border border-border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase"
              style={{ backgroundColor: t.bg, color: t.fg }}
            >
              {t.display}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div className="sr-only">
        <a href={`mailto:${site.email}`}>Email {site.email}</a>
        <a href={`tel:${site.phone}`}>Phone {site.phone}</a>
      </div>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ touchAction: 'pan-y' }}
        aria-hidden
      />
      <p
        ref={labelRef}
        className="pointer-events-none absolute right-3 bottom-3 font-mono text-[9px] tracking-[0.18em] uppercase text-faint/70 transition-opacity duration-700"
        aria-hidden
      >
        Play with the stack · Drag the building blocks
      </p>
    </div>
  )
}
