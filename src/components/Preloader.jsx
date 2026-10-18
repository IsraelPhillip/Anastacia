import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ease } from './fx'

export default function Preloader({ onDone }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const dur = 2000
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, 350)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <motion.div className="pre" exit={{ y: '-100%' }} transition={{ duration: 1.1, ease }}>
      <motion.div className="pre-script" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
        Anastacia Nebeolisa
      </motion.div>
      <div className="pre-sub">Capital &amp; Influence</div>
      <div className="pre-bar"><motion.i style={{ scaleX: n / 100 }} /></div>
      <div className="pre-n">{String(n).padStart(3, '0')}</div>
    </motion.div>
  )
}
