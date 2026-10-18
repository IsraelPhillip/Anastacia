import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PERSON } from '../config'
import { sendMail } from '../lib/mail'
import { burst } from '../components/Birthday'
import { Fade, Magnetic, SplitWords, ease } from '../components/fx'
import { ThemeButton } from '../components/Nav'

const TOPICS = ['Business enquiry', 'Speaking / Media', 'Financial advisory', 'Partnership', 'Say hello']

const Icon = {
  ig: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>,
  in: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.5H3zM9.75 9.75h3.8v1.6h.06c.53-1 1.82-2 3.75-2 4 0 4.74 2.63 4.74 6.05v5.85h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4z" /></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>,
}

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', topic: TOPICS[0], message: '', _honey: '' })
  const [state, setState] = useState('idle')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (f._honey) return
    setState('sending')
    try {
      await sendMail({
        _subject: `${f.topic} — message from ${f.name} (website)`,
        _replyto: f.email,
        name: f.name,
        email: f.email,
        topic: f.topic,
        message: f.message,
      })
      setState('sent')
      burst()
      setF({ name: '', email: '', topic: TOPICS[0], message: '', _honey: '' })
    } catch {
      setState('error')
    }
  }

  const { instagram, instagramHandle, instagram2, instagram2Handle, linkedin } = PERSON.socials

  return (
    <section id="contact" className="contact">
      <div className="wrap contact-grid">
        <div>
          <Fade className="eyebrow"><i /> Contact</Fade>
          <SplitWords as="h2" className="h1" text="Let’s build something that lasts." />
          <Fade delay={0.2} className="muted">
            For business enquiries, speaking, partnerships or financial strategy, send a message and it lands straight in her inbox.
          </Fade>
          <Fade delay={0.3} className="links">
            <a href={`mailto:${PERSON.email}`} data-cursor="Email">{Icon.mail}<span>{PERSON.email}</span><i>↗</i></a>
            <a href={linkedin} target="_blank" rel="noreferrer" data-cursor="LinkedIn">{Icon.in}<span>LinkedIn</span><i>↗</i></a>
            <a href={instagram} target="_blank" rel="noreferrer" data-cursor="Instagram">{Icon.ig}<span>{instagramHandle}</span><i>↗</i></a>
            <a href={instagram2} target="_blank" rel="noreferrer" data-cursor="Instagram">{Icon.ig}<span>{instagram2Handle}</span><i>↗</i></a>
          </Fade>
        </div>

        <Fade delay={0.15} className="form-card">
          <AnimatePresence mode="wait">
            {state === 'sent' ? (
              <motion.div key="ok" className="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
                <motion.svg viewBox="0 0 52 52" width="84" height="84" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <motion.circle cx="26" cy="26" r="23" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
                  <motion.path d="m15 27 8 8 15-17" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.6 }} />
                </motion.svg>
                <h3>Message sent</h3>
                <p>Thank you. Your note is on its way to {PERSON.first}’s inbox.</p>
                <button className="btn ghost" onClick={() => setState('idle')}>Send another</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }}>
                <div className="two">
                  <label>Name<input required value={f.name} onChange={set('name')} placeholder="Your name" /></label>
                  <label>Email<input required type="email" value={f.email} onChange={set('email')} placeholder="you@email.com" /></label>
                </div>
                <div className="chips" role="radiogroup" aria-label="Topic">
                  {TOPICS.map((t) => (
                    <button type="button" key={t} className={f.topic === t ? 'on' : ''} onClick={() => setF({ ...f, topic: t })}>{t}</button>
                  ))}
                </div>
                <label>Message<textarea required rows={5} value={f.message} onChange={set('message')} placeholder="How can we work together?" /></label>
                <input className="honey" tabIndex={-1} autoComplete="off" value={f._honey} onChange={set('_honey')} aria-hidden="true" />
                <Magnetic strength={0.15}>
                  <button className="btn big" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'} <span>→</span></button>
                </Magnetic>
                {state === 'error' && <p className="err">Couldn’t send right now. Please try again or email {PERSON.email}.</p>}
              </motion.form>
            )}
          </AnimatePresence>
        </Fade>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="foot-name" aria-hidden="true">Anastacia Nebeolisa</div>
      <div className="wrap foot-row">
        <span>© {new Date().getFullYear()} {PERSON.name} · {PERSON.postnominals}</span>
        <span className="foot-r"><ThemeButton /><a href="#top">Back to top ↑</a></span>
      </div>
    </footer>
  )
}
