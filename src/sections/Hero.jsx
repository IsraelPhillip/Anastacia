import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PERSON } from '../config'
import { Magnetic, ease } from '../components/fx'

function Letters({ text, go, base = 0, className }) {
  return (
    <span className={className} aria-hidden="true">
      {text.split('').map((c, i) => (
        <span className="mask hero-mask" key={i}>
          <motion.span
            className="mask-in"
            initial={{ y: '110%' }}
            animate={go ? { y: 0 } : {}}
            transition={{ duration: 1.3, ease, delay: base + i * 0.05 }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function Hero({ loaded, bday }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const imgS = useTransform(scrollYProgress, [0, 1], [1.16, 1.32])
  const firstY = useTransform(scrollYProgress, [0, 1], ['0%', '-55%'])
  const lastY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section id="top" ref={ref} className="hero">
      <div className="hero-glow" />
      <div className="hero-grid" />

      <motion.div className="hero-stage" style={{ opacity: fade }}>
        <motion.h1 className="hero-first" style={{ y: firstY }} aria-label={PERSON.name}>
          <Letters text="Anastacia" go={loaded} base={0.3} />
        </motion.h1>

        <div className="arch-wrap">
          <motion.svg className="arch-ring" viewBox="0 0 100 130" initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}} transition={{ delay: 1.2, duration: 1.4 }}>
            <motion.path
              d="M4 130 V50 A46 46 0 0 1 96 50 V130"
              fill="none" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }} animate={loaded ? { pathLength: 1 } : {}} transition={{ delay: 0.9, duration: 2.2, ease }}
            />
          </motion.svg>
          <motion.div
            className="arch"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={loaded ? { clipPath: 'inset(0% 0 0 0)' } : {}}
            transition={{ duration: 1.6, ease, delay: 0.15 }}
          >
            <motion.img src="/img/hero.jpg" alt="Anastacia Nebeolisa, banker and financial strategist" style={{ y: imgY, scale: imgS }} />
          </motion.div>
        </div>

        <motion.h1 className="hero-last" style={{ y: lastY }} aria-hidden="true">
          <Letters text="NEBEOLISA" go={loaded} base={0.6} />
        </motion.h1>
      </motion.div>

      <motion.div className="hero-left" initial={{ opacity: 0, x: -30 }} animate={loaded ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1.6, duration: 1, ease }}>
        {bday.state === 'today' && <div className="pill gold">🎂 Today is her day</div>}
        <p>
          Transforming <em>capital</em> into opportunity, <em>influence</em> into impact and <em>vision</em> into sustainable success.
        </p>
        <Magnetic>
          <a className="btn" href="#journey" data-cursor="Explore">See the track record <span>→</span></a>
        </Magnetic>
      </motion.div>

      <motion.ul className="hero-right" initial={{ opacity: 0, x: 30 }} animate={loaded ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1.8, duration: 1, ease }}>
        <li><small>01</small>Banker</li>
        <li><small>02</small>Managing Director, Dux MFB</li>
        <li><small>03</small>Financial Strategist</li>
        <li className="cred">{PERSON.postnominals}</li>
      </motion.ul>

      <motion.a href="#about" className="scroll-hint" initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}} transition={{ delay: 2.4 }}>
        <span>Scroll</span><i />
      </motion.a>
    </section>
  )
}

export function Marquee() {
  const items = ['Banking', 'Capital', 'Influence', 'Financial Strategy', 'Deposit Mobilization', 'Leadership', 'Wealth', 'Impact']
  const row = items.map((t) => (
    <span key={t}>{t}<b>✦</b></span>
  ))
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div>{row}</div>
        <div>{row}</div>
      </div>
    </div>
  )
}
