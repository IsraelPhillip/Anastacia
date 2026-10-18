import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [fine, setFine] = useState(false)
  const [big, setBig] = useState(false)
  const [label, setLabel] = useState('')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 })

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    setFine(true)
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    const over = (e) => {
      const t = e.target.closest?.('a,button,input,textarea,select,[data-cursor]')
      setBig(!!t)
      setLabel(t?.dataset?.cursor || '')
    }
    addEventListener('mousemove', move)
    addEventListener('mouseover', over)
    return () => { removeEventListener('mousemove', move); removeEventListener('mouseover', over) }
  }, [x, y])

  if (!fine) return null
  return (
    <>
      <motion.div className="cur-dot" style={{ x, y }} />
      <motion.div className={`cur-ring ${big ? 'big' : ''} ${label ? 'lab' : ''}`} style={{ x: rx, y: ry }}>
        <span>{label}</span>
      </motion.div>
    </>
  )
}
