import nodemailer from 'nodemailer'

// Vercel serverless function: delivers site messages straight to Anastacia's inbox over Gmail SMTP.
// Env vars (Vercel → Project → Settings → Environment Variables):
//   GMAIL_USER          the Gmail address that SENDS (e.g. a dedicated site account)
//   GMAIL_APP_PASSWORD  16-char Google "App password" for that account
//   MAIL_TO             optional, defaults to anastacianebeolisa@gmail.com
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' })
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return res.status(501).json({ success: false, message: 'Mailer not configured' })

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  if (b._honey) return res.status(200).json({ success: true })
  const name = String(b.name || 'Website visitor').slice(0, 120)
  const email = String(b.email || '').slice(0, 160)
  const message = String(b.message || '').slice(0, 5000)
  if (!message.trim()) return res.status(400).json({ success: false, message: 'Message required' })
  const subject = String(b._subject || `New message from ${name}`).slice(0, 200)

  const rows = [['Name', name], ['Email', email || '—'], ['Topic', b.topic || b.source || '—']]
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;border:1px solid #e6d9b8;border-radius:12px;overflow:hidden">
    <div style="background:#0a0907;color:#d9a94b;padding:18px 24px;font-size:20px">Capital &amp; Influence — new message</div>
    <div style="padding:24px;color:#222">
      ${rows.map(([k, v]) => `<p style="margin:0 0 6px"><b>${k}:</b> ${esc(v)}</p>`).join('')}
      <hr style="border:0;border-top:1px solid #eee;margin:16px 0"/>
      <p style="white-space:pre-wrap;line-height:1.6">${esc(message)}</p>
    </div></div>`

  try {
    const t = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } })
    await t.sendMail({
      from: `"Anastacia's Website" <${GMAIL_USER}>`,
      to: process.env.MAIL_TO || 'anastacianebeolisa@gmail.com',
      replyTo: email || undefined,
      subject,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`,
      html,
    })
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Send failed' })
  }
}
