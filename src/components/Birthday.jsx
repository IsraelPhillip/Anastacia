import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { PERSON } from '../config'
import { sendMail } from '../lib/mail'
import { fmtCountdown } from '../lib/birthday'
import { Magnetic, ease } from './fx'

const COLORS = ['#d9a94b', '#f2d089', '#fff3d1', '#a8741a', '#ffffff']

export function burst(big = false) {
  const end = Date.now() + (big ? 3200 : 900)
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, colors: COLORS })
    confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, colors: COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
  if (big) confetti({ particleCount: 160, spread: 120, startVelocity: 48, origin: { y: 0.55 }, colors: COLORS, scalar: 1.1 })
}

const DEFAULT_WISH = `Happy Birthday, ${PERSON.first}! 🎂\n\nWishing you a year of bigger vision, bolder wins and everything your heart is working towards. Thank you for the example you set. Enjoy your day, Ma!`

export function WishForm({ onSent, compact }) {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState(DEFAULT_WISH)
  const [state, setState] = useState('idle')
  const submit = async (e) => {
    e.preventDefault()
    setState('sending')
    try {
      await sendMail({
        _subject: `🎂 Happy Birthday ${PERSON.first}! A wish from ${name || 'someone special'}`,
        name: name || 'Anonymous well-wisher',
        message: msg,
        source: 'Birthday wish — website',
      })
      setState('sent')
      burst(true)
      onSent?.()
    } catch {
      setState('error')
    }
  }
  if (state === 'sent')
    return (
      <div className="wish-done">
        <div className="big">💌</div>
        <h3>Wish delivered</h3>
        <p>It’s in her inbox. Thank you for making her day brighter.</p>
      </div>
    )
  return (
    <form className={`wish-form ${compact ? 'compact' : ''}`} onSubmit={submit}>
      <label>
        Your name
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Who is this from?" required />
      </label>
      <label>
        Your wish
        <textarea rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} required />
      </label>
      <button className="btn" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send wish to her inbox'}
      </button>
      {state === 'error' && <p className="err">Couldn’t send just now — please try again.</p>}
    </form>
  )
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [onClose])
  return (
    <motion.div className="modal" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal-card"
        initial={{ y: 60, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.6, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-x" onClick={onClose} aria-label="Close">×</button>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function Birthday({ bday, loaded }) {
  const [welcome, setWelcome] = useState(false)
  const [wish, setWish] = useState(false)
  const fired = useRef(false)

  // Celebration opens once the preloader has gone.
  useEffect(() => {
    if (bday.state !== 'today' || !loaded || fired.current) return
    fired.current = true
    const t = setTimeout(() => { setWelcome(true); burst(true) }, 700)
    return () => clearTimeout(t)
  }, [bday.state, loaded])

  // ?autosend=1 on the birthday itself fires one greeting from the site to her inbox (once per browser/year).
  useEffect(() => {
    if (bday.state !== 'today') return
    if (new URLSearchParams(location.search).get('autosend') !== '1') return
    const key = `bday-sent-${new Date().getFullYear()}`
    try { if (localStorage.getItem(key)) return } catch { /* ignore */ }
    sendMail({
      _subject: `🎂 Happy Birthday, ${PERSON.first}!`,
      name: 'Your website',
      message: `Happy Birthday, ${PERSON.first}! 🎉\n\nYour website has been dressed in gold for you today. Here is to another year of turning capital into opportunity, influence into impact, and vision into sustainable success.\n\nWith love and admiration — from everyone who works with you.`,
      source: 'Automatic birthday greeting',
    }).then(() => { try { localStorage.setItem(key, '1') } catch { /* ignore */ } }).catch(() => {})
  }, [bday.state])

  return (
    <>
      {bday.state === 'eve' && (
        <motion.div className="eve" initial={{ y: -60 }} animate={loaded ? { y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.4 }}>
          <span>🎂 Something golden is coming for {PERSON.first}</span>
          <b>{fmtCountdown(bday.ms)}</b>
        </motion.div>
      )}

      {bday.state === 'today' && (
        <>
          <Magnetic>
            <button className="gift" onClick={() => { setWish(true); burst() }} data-cursor="Wish">
              <span>🎁</span> Send a birthday wish
            </button>
          </Magnetic>
          <AnimatePresence>
            {welcome && (
              <motion.div className="modal bday" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.6 } }}>
                <div className="bday-inner">
                  <motion.div className="bday-script" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1, ease }}>
                    it’s a special day
                  </motion.div>
                  <h2>
                    {'Happy Birthday'.split('').map((c, i) => (
                      <motion.span
                        key={i}
                        initial={{ y: 80, opacity: 0, rotate: 8 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.045, duration: 0.9, ease }}
                        style={{ display: 'inline-block', whiteSpace: 'pre' }}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </h2>
                  <motion.h3 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 1, ease }}>
                    {PERSON.name}
                  </motion.h3>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                    Banker · Managing Director · Financial Strategist — and a leader who turns vision into sustainable success.
                    May this new year be your most profitable yet.
                  </motion.p>
                  <motion.div className="bday-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}>
                    <button className="btn" onClick={() => setWelcome(false)}>Enter the website</button>
                    <button className="btn ghost" onClick={() => { setWelcome(false); setWish(true) }}>Send her a wish 💌</button>
                  </motion.div>
                </div>
              </motion.div>
            )}
            {wish && (
              <Modal onClose={() => setWish(false)}>
                <div className="bday-script sm">send some love</div>
                <h3 className="modal-title">Wish {PERSON.first} a happy birthday</h3>
                <WishForm />
              </Modal>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}
