import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Fade, SplitWords } from '../components/fx'

const SHOTS = [
  ['beige', 'The Strategist', 'tall'],
  ['red', 'In conversation with books', 'tall'],
  ['bw', 'ACIB', 'tall'],
  ['meet', 'Leading the room', 'wide'],
  ['grad', 'Rome Business School', 'tall'],
  ['braids', 'Capital & Influence', 'tall'],
]

export default function Gallery() {
  const ref = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(1800)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useLayoutEffect(() => {
    const m = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    m()
    addEventListener('resize', m)
    const t = setTimeout(m, 800)
    return () => { removeEventListener('resize', m); clearTimeout(t) }
  }, [])

  return (
    <section id="gallery" className="gallery" ref={ref} style={{ height: `calc(100vh + ${dist}px * 0.9)` }}>
      <div className="g-sticky">
        <div className="g-head wrap">
          <div>
            <Fade className="eyebrow"><i /> Gallery</Fade>
            <SplitWords as="h2" className="h2" text="Moments & milestones." />
          </div>
          <div className="g-prog"><motion.i style={{ width: bar }} /></div>
        </div>
        <motion.div className="g-track" ref={track} style={{ x }}>
          {SHOTS.map(([img, cap, shape], i) => (
            <figure className={`shot ${shape}`} key={img} data-cursor="View">
              <div className="shot-img">
                <motion.img src={`/img/${img}.jpg`} alt={cap} loading="lazy" whileHover={{ scale: 1.08 }} transition={{ duration: 1.2 }} />
              </div>
              <figcaption><span>{String(i + 1).padStart(2, '0')}</span>{cap}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
