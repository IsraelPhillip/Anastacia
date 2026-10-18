import { useEffect, useState } from 'react'
import { PERSON } from '../config'

const HOUR = 36e5

// 'today' | 'eve' (within 36h before) | 'none'. ?birthday=today|eve forces a state for previews.
function compute() {
  const force = new URLSearchParams(window.location.search).get('birthday')
  const now = new Date()
  const { month, day } = PERSON.birthday
  let target = new Date(now.getFullYear(), month - 1, day)
  if (target - now < -24 * HOUR) target = new Date(now.getFullYear() + 1, month - 1, day)
  if (force === 'eve') return { state: 'eve', ms: 9 * HOUR + 12 * 60000 }
  if (force === 'today' || force === '1') return { state: 'today', ms: 0 }
  const isToday = now.getMonth() === month - 1 && now.getDate() === day
  if (isToday) return { state: 'today', ms: 0 }
  const ms = target - now
  if (ms > 0 && ms <= 36 * HOUR) return { state: 'eve', ms }
  return { state: 'none', ms }
}

export function useBirthday() {
  const [b, setB] = useState(compute)
  useEffect(() => {
    const id = setInterval(() => setB(compute()), 1000)
    return () => clearInterval(id)
  }, [])
  return b
}

export function fmtCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const p = (n) => String(n).padStart(2, '0')
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`
}
