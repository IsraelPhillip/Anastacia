import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { flushSync } from 'react-dom'
import { Magnetic, ease } from './fx'

const LINKS = [
  ['About', '#about'],
  ['Track record', '#journey'],
  ['Expertise', '#expertise'],
  ['Gallery', '#gallery'],
  ['Contact', '#contact'],
]

export function toggleTheme(e) {
  const root = document.documentElement
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  const apply = () => {
    root.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch { /* ignore */ }
  }
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply()
  const x = e?.clientX ?? innerWidth / 2
  const y = e?.clientY ?? 0
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const t = document.startViewTransition(() => flushSync(apply))
  t.ready.then(() =>
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 800, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
    ),
  )
}

export function ThemeButton() {
  return (
    <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle light / dark theme" data-cursor="Theme">
      <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
      </svg>
      <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
      </svg>
    </button>
  )
}

export default function Nav({ loaded }) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(v > prev && v > 200 && !open)
    setScrolled(v > 40)
  })

  return (
    <>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
      <motion.header
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={loaded ? { y: hidden ? -100 : 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease }}
      >
        <a href="#top" className="logo" data-cursor="Top">
          <span>A</span>N<i>.</i>
        </a>
        <nav className="nav-links">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h}>{l}</a>
          ))}
        </nav>
        <div className="nav-right">
          <ThemeButton />
          <Magnetic strength={0.25}>
            <a href="#contact" className="btn btn-sm">Let’s talk</a>
          </Magnetic>
          <button className={`burger ${open ? 'on' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <i /><i />
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            data-lenis-prevent
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.8, ease }}
          >
            {LINKS.map(([l, h], i) => (
              <motion.a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.25 + i * 0.07, duration: 0.7, ease } }}
              >
                <small>0{i + 1}</small>{l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
