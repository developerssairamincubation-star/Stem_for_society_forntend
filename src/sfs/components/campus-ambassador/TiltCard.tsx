import { motion, useMotionValueEvent, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export type Pointer = { x: number; y: number } | null

/** Maximum rotation in degrees; kept small so the card feels alive, not toy-like. */
const MAX_TILT = 4

const clamp = (n: number) => Math.max(-1, Math.min(1, n))

interface TiltCardProps {
  /** Shared cursor position (viewport coordinates) of the surrounding container, or null when it has left. */
  pointer: MotionValue<Pointer>
  /** False on touch devices and for reduced motion: the card then stays still. */
  enabled: boolean
  children: ReactNode
  className?: string
}

/** Leans gently toward the cursor, measured against this card's own centre, and springs back on leave. */
export function TiltCard({ pointer, enabled, children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const spring = { stiffness: 140, damping: 20, mass: 0.5 }
  const rotateX = useSpring(0, spring)
  const rotateY = useSpring(0, spring)
  const glow = useSpring(0, spring)
  const boxShadow = useTransform(
    glow,
    [0, 1],
    ['0 0 0 0 rgb(0 84 159 / 0)', '0 14px 28px -14px rgb(0 84 159 / 0.4)'],
  )

  useMotionValueEvent(pointer, 'change', (p) => {
    const el = ref.current
    if (!enabled || !el) return
    if (!p) {
      rotateX.set(0)
      rotateY.set(0)
      glow.set(0)
      return
    }
    const r = el.getBoundingClientRect()
    const dx = (p.x - (r.left + r.width / 2)) / (r.width * 1.5)
    const dy = (p.y - (r.top + r.height / 2)) / (r.height * 1.5)
    rotateY.set(clamp(dx) * MAX_TILT)
    rotateX.set(-clamp(dy) * MAX_TILT)
    glow.set(Math.max(0, 1 - Math.hypot(dx, dy)))
  })

  if (!enabled) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, boxShadow, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  )
}
