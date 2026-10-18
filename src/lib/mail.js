import { PERSON } from '../config'

// 1) /api/contact  — Vercel function that sends through Gmail SMTP (no activation step).
// 2) FormSubmit    — fallback when the function isn't configured (needs one-time activation by the recipient).
const FALLBACK = import.meta.env.VITE_FORM_ENDPOINT || `https://formsubmit.co/ajax/${PERSON.email}`

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === 'false' || data.success === false) throw new Error(data.message || 'Message could not be sent')
  return data
}

export async function sendMail(fields) {
  try {
    return await post('/api/contact', fields)
  } catch {
    return post(FALLBACK, { _template: 'table', _captcha: 'false', ...fields })
  }
}
