import { motion } from 'framer-motion'
import { Fade, SplitWords, ease, spot } from '../components/fx'

const ITEMS = [
  { n: '01', t: 'Deposit mobilization', d: 'Liability growth strategies that turn relationships into balance-sheet strength — proven from ₦500M to ₦2B+.' },
  { n: '02', t: 'Wealth & private banking', d: 'Advisory and relationship management for high-net-worth individuals and corporate organizations.' },
  { n: '03', t: 'Credit & SME finance', d: 'Credit analysis, risk assessment and loan structuring for corporate and SME portfolios.' },
  { n: '04', t: 'Banking leadership', d: 'Building institutions: units, teams and foundations that scale — from Telemarketing to the C-suite.' },
  { n: '05', t: 'Marketing & growth', d: 'Chief Marketing Officer experience driving brand, acquisition and product adoption in microfinance.' },
  { n: '06', t: 'Financial literacy', d: 'Through Capital & Influence, making money knowledge accessible, practical and empowering.' },
]

export default function Expertise() {
  return (
    <section id="expertise" className="expertise">
      <div className="wrap">
        <Fade className="eyebrow"><i /> Expertise</Fade>
        <SplitWords as="h2" className="h2 wide" text="Where capital meets strategy." />
        <div className="cards">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.n}
              className="card"
              onMouseMove={spot}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.9, ease, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <span className="card-n">{it.n}</span>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
              <span className="card-arrow">↗</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
