import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Counter, Fade, ScrollWords, SplitWords, ease } from '../components/fx'

const BIO =
  'I am a results-driven banking professional and financial growth advocate committed to empowering individuals and businesses through strategic finance, innovation and leadership. As Managing Director of Dux MFB, I am passionate about transforming capital into opportunity, influence into impact and vision into sustainable success.'

const STATS = [
  { to: 2, prefix: '₦', suffix: 'B+', label: 'Deposits grown in a single operational year' },
  { to: 60, prefix: '₦', suffix: 'M', label: 'Loans disbursed in four months, from a call-centre built from zero' },
  { to: 2, prefix: '₦', suffix: 'B+', label: 'Branch balance sheets managed and expanded' },
  { to: 9, suffix: ' yrs', label: 'Across credit, wealth, private & microfinance banking' },
]

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="about" className="about" ref={ref}>
      <div className="wrap about-grid">
        <div className="about-media">
          <div className="about-outline" aria-hidden="true" />
          <motion.div
            className="frame"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.6, ease }}
          >
            <motion.img src="/img/portrait.jpg" alt="Portrait of Anastacia Nebeolisa" style={{ y, scale: 1.18 }} />
          </motion.div>
          <Fade delay={0.4} className="about-cap">
            <span>Anastacia Nebeolisa</span>
            <small>Managing Director · Dux MFB</small>
          </Fade>
        </div>

        <div className="about-copy">
          <Fade className="eyebrow"><i /> About</Fade>
          <SplitWords as="h2" className="h2" text="Capital with a conscience. Influence with purpose." />
          <ScrollWords className="lead" text={BIO} />
          <Fade delay={0.1} className="creds">
            <div><b>MBA</b><span>Rome Business School</span></div>
            <div><b>MCIB</b><span>Member, Chartered Institute of Bankers</span></div>
            <div><b>ACIB</b><span>Associate, Chartered Institute of Bankers</span></div>
          </Fade>
        </div>
      </div>

      <div className="wrap stats">
        {STATS.map((s, i) => (
          <Fade key={i} delay={i * 0.1} className="stat">
            <div className="num"><Counter to={s.to} prefix={s.prefix} suffix={s.suffix} /></div>
            <p>{s.label}</p>
          </Fade>
        ))}
      </div>
    </section>
  )
}
