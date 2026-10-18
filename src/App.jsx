import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { useBirthday } from './lib/birthday'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Birthday from './components/Birthday'
import Hero, { Marquee } from './sections/Hero'
import About from './sections/About'
import Journey from './sections/Journey'
import Expertise from './sections/Expertise'
import Gallery from './sections/Gallery'
import { Quote, Brand } from './sections/Brand'
import Contact, { Footer } from './sections/Contact'

export default function App() {
  const [loaded, setLoaded] = useState(() => new URLSearchParams(location.search).has('skip'))
  const bday = useBirthday()
  const done = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    if (bday.state === 'today') document.title = '🎂 Happy Birthday, Anastacia Nebeolisa!'
  }, [bday.state])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, anchors: true })
    window.__lenis = lenis
    lenis.stop()
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  useEffect(() => {
    if (loaded) window.__lenis?.start()
  }, [loaded])

  return (
    <>
      <Cursor />
      <AnimatePresence>{!loaded && <Preloader onDone={done} />}</AnimatePresence>
      <Birthday bday={bday} loaded={loaded} />
      <Nav loaded={loaded} />
      <main>
        <Hero loaded={loaded} bday={bday} />
        <Marquee />
        <About />
        <Journey />
        <Expertise />
        <Quote />
        <Gallery />
        <Brand />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
