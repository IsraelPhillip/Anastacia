import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { PERSON } from '../config'
import { Fade, Magnetic, SplitWords } from '../components/fx'

export function Quote() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  const x1 = useTransform(scrollYProgress, [0, 1], ['10%', '-30%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-30%', '10%'])
  return (
    <section className="quote" ref={ref}>
      <motion.img className="quote-bg" src="/img/arms.jpg" alt="" style={{ y: bgY }} loading="lazy" />
      <div className="quote-veil" />
      <motion.div className="quote-big" style={{ x: x1 }} aria-hidden="true">WAITING FOR THE PERFECT TIME</motion.div>
      <div className="wrap quote-body">
        <Fade className="eyebrow"><i /> Philosophy</Fade>
        <SplitWords as="h2" className="quote-h" text="The market never waits." />
        <Fade delay={0.3} className="quote-p">Opportunity rewards the prepared and the decisive. Start with what you have. Build capital, build influence, and let both compound.</Fade>
      </div>
      <motion.div className="quote-big out" style={{ x: x2 }} aria-hidden="true">CAPITAL &amp; INFLUENCE</motion.div>
    </section>
  )
}

function Tilt() {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 150, damping: 18 }), sy = useSpring(ry, { stiffness: 150, damping: 18 })
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 14); rx.set((0.5 - py) * 14)
    e.currentTarget.style.setProperty('--gx', px * 100 + '%'); e.currentTarget.style.setProperty('--gy', py * 100 + '%')
  }
  return (
    <motion.div
      className="brand-media"
      initial={{ opacity: 0, x: -80, rotate: -4 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="tilt" style={{ rotateX: sx, rotateY: sy }} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0) }}>
        <motion.img src="/img/blue.jpg" alt="Anastacia Nebeolisa, Capital & Influence" loading="lazy" initial={{ scale: 1.25 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} />
      </motion.div>
      <div className="badge">
        <motion.svg viewBox="0 0 100 100" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}>
          <defs><path id="b" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
          <text><textPath href="#b" textLength="236" lengthAdjust="spacing">LEVEL UP YOUR FINANCIAL LITERACY ✦ </textPath></text>
        </motion.svg>
        <b>↗</b>
      </div>
    </motion.div>
  )
}

export function Brand() {
  const { instagram, instagramHandle } = PERSON.socials
  return (
    <section className="brand">
      <div className="wrap brand-grid">
        <Tilt />
        <div className="brand-copy">
          <Fade className="eyebrow"><i /> Capital &amp; Influence</Fade>
          <SplitWords as="h2" className="h2" text="Level up your financial literacy." />
          <Fade delay={0.2} className="muted">
            Join the conversation on practical money tips, growth strategy and the mindset behind building wealth, shared weekly with a community that’s learning to turn capital into opportunity.
          </Fade>
          <Fade delay={0.3} className="row">
            <Magnetic><a className="btn" href={instagram} target="_blank" rel="noreferrer">Follow {instagramHandle} <span>↗</span></a></Magnetic>
          </Fade>
        </div>
      </div>
    </section>
  )
}
