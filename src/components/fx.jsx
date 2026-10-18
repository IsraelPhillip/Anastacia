import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

/** Headline whose words rise out of a mask when scrolled into view. */
export function SplitWords({ text, className, as = 'h2', delay = 0, stagger = 0.07 }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      aria-label={text}
      initial="h"
      whileInView="v"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {text.split(' ').map((w, i) => (
        <span key={i} className="mask" aria-hidden="true">
          <motion.span
            className="mask-in"
            variants={{ h: { y: '115%', rotate: 4 }, v: { y: 0, rotate: 0, transition: { duration: 1.1, ease } } }}
          >
            {w}
          </motion.span>
          {' '}
        </span>
      ))}
    </Tag>
  )
}

/** Paragraph whose words light up as you scroll through it. */
export function ScrollWords({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </ScrollWord>
      ))}
    </p>
  )
}
function ScrollWord({ p, range, children }) {
  const opacity = useTransform(p, range, [0.16, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  )
}

export function Fade({ children, delay = 0, y = 40, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </Tag>
  )
}

/** Wrapper that pulls its child toward the pointer. */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

export function Counter({ to, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = prefix + v.toFixed(decimals) + suffix },
    })
    return () => c.stop()
  }, [inView, to, prefix, suffix, decimals])
  return <span ref={ref}>{prefix}0{suffix}</span>
}

/** Cursor-following spotlight for cards (sets --mx / --my). */
export function spot(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}
