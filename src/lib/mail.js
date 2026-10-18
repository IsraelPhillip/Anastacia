import { PERSON } from '../config'

// FormSubmit relays JSON posts straight to her inbox — no backend needed.
// First ever submission sends her an activation email she must confirm once.
// Override with VITE_FORM_ENDPOINT (e.g. a Web3Forms / own API URL) in .env.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || `https://formsubmit.co/ajax/${PERSON.email}`

export async function sendMail(fields) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _template: 'table', _captcha: 'false', ...fields }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === 'false' || data.success === false) {
    throw new Error(data.message || 'Message could not be sent')
  }
  return data
}
