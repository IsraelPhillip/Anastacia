import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ACHIEVEMENTS } from '../config'
import { Fade, SplitWords, ease } from '../components/fx'

export default function Journey() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.7'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="journey" className="journey">
      <div className="wrap journey-grid">
        <div className="journey-head">
          <Fade className="eyebrow"><i /> Track record</Fade>
          <SplitWords as="h2" className="h2" text="Results that compound." />
          <Fade delay={0.2} className="muted">
            From credit analysis in 2017 to leading a bank’s growth in 2025: every chapter built on the last.
          </Fade>
        </div>

        <div className="timeline" ref={ref}>
          <div className="tl-line"><motion.i style={{ scaleY: line }} /></div>
          {ACHIEVEMENTS.map((a, i) => (
            <motion.article
              className="tl-item"
              key={i}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 1, ease }}
              data-cursor="•"
            >
              <span className="tl-dot" />
              <div className="tl-year">{a.year}</div>
              <div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
