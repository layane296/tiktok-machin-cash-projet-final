// pages/api/email/send-sequence.js
// Cron job qui envoie les emails de la séquence automatique
// À appeler via un cron Vercel ou un service externe (cron-job.org)
// URL: /api/email/send-sequence?secret=CRON_SECRET

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'TikTok Cash Machine <noreply@nexvari.com>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiktok-machin-cash-projet-final.vercel.app'
const CRON_SECRET = process.env.CRON_SECRET || 'tiktok-cron-2025'

const SEQUENCE = [
  { step: 2, subject: '🔥 Le hook qui fait 2M de vues (copie-le)', templateKey: 'day2' },
  { step: 3, subject: '💰 De 0 à 50K vues en 2 semaines', templateKey: 'day4' },
  { step: 4, subject: '🎙️ Nouveau : génère ta voix off en 5 secondes', templateKey: 'day6' },
  { step: 5, subject: '⚠️ Dernière chance — offre spéciale ce soir', templateKey: 'day7' },
]

const templates = {
  day2: (email) => `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
  </div>
  <div style="background:#0F0F0F;border:1px solid rgba(0,245,255,0.3);border-radius:20px;padding:32px;margin-bottom:24px;">
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;">Le secret des vidéos à 2M de vues 🤫</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 20px;">
      Les créateurs qui cartonnent ont tous un point commun : <strong style="color:#00F5FF;">leur hook arrête le scroll en moins de 3 secondes.</strong>
    </p>
    <div style="background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="color:#00F5FF;font-size:13px;font-weight:700;margin:0 0 12px;">✨ Les 3 structures qui marchent toujours :</p>
      <p style="color:white;font-size:14px;margin:0 0 8px;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px;">1. "POV : tu découvres que..."</p>
      <p style="color:white;font-size:14px;margin:0 0 8px;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px;">2. "Ce que personne ne te dit sur..."</p>
      <p style="color:white;font-size:14px;margin:0;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px;">3. "J'ai testé X pendant 30 jours et voici..."</p>
    </div>
    <a href="${BASE_URL}" style="display:inline-block;background:linear-gradient(135deg,#FF2D55,#c0392b);color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;">⚡ Générer mon hook viral</a>
  </div>
  <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;">
    <a href="${BASE_URL}/api/email/unsubscribe?email=${encodeURIComponent(email)}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
  </p>
</div></body></html>`,

  day4: (email) => `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
  </div>
  <div style="background:#0F0F0F;border:1px solid rgba(255,215,0,0.3);border-radius:20px;padding:32px;">
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 24px;">"J'ai eu 50K vues sur ma première vidéo" 🤯</h1>
    <div style="background:rgba(255,215,0,0.06);border-left:3px solid #FFD700;padding:20px;border-radius:0 12px 12px 0;margin-bottom:24px;">
      <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.7;margin:0 0 12px;font-style:italic;">"J'avais jamais fait de TikTok. J'ai entré mon sujet et en 20 secondes j'avais un script complet. 50K vues en 2 semaines."</p>
      <p style="color:#FFD700;font-size:13px;font-weight:700;margin:0;">— Alexandre M., créateur lifestyle</p>
    </div>
    <div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="color:#FFD700;font-size:28px;font-weight:900;margin:0;">9,99€<span style="font-size:14px;color:rgba(255,255,255,0.4)">/mois</span></p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0;">Scripts illimités • Résiliable à tout moment</p>
    </div>
    <a href="${BASE_URL}" style="display:block;background:linear-gradient(135deg,#FFD700,#FF8C00);color:black;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;text-align:center;">👑 Passer Premium — 9,99€/mois</a>
  </div>
  <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;margin-top:20px;">
    <a href="${BASE_URL}/api/email/unsubscribe?email=${encodeURIComponent(email)}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
  </p>
</div></body></html>`,

  day6: (email) => `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="color:#8B5CF6;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
  </div>
  <div style="background:#0F0F0F;border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:32px;">
    <div style="font-size:48px;text-align:center;margin-bottom:16px;">🎙️</div>
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 16px;text-align:center;">Ta voix off IA est prête</h1>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;text-align:center;">Script → Voix off naturelle → MP3 téléchargeable. En 5 secondes.</p>
    <div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="color:#8B5CF6;font-size:28px;font-weight:900;margin:0;">12,99€<span style="font-size:14px;color:rgba(255,255,255,0.4)">/mois</span></p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0;">Scripts illimités + Voix off MP3</p>
    </div>
    <a href="${BASE_URL}" style="display:block;background:linear-gradient(135deg,#8B5CF6,#00F5FF);color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;text-align:center;">🎙️ Activer le Pack Voix</a>
  </div>
  <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;margin-top:20px;">
    <a href="${BASE_URL}/api/email/unsubscribe?email=${encodeURIComponent(email)}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
  </p>
</div></body></html>`,

  day7: (email) => `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
  </div>
  <div style="background:#0F0F0F;border:1px solid rgba(255,45,85,0.5);border-radius:20px;padding:32px;">
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 16px;">Tu laisses de l'argent sur la table 💸</h1>
    <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 24px;">Pendant que tu lis cet email, des créateurs postent leur 10ème vidéo de la semaine générée en 10 secondes. Il est temps de les rejoindre.</p>
    <a href="${BASE_URL}" style="display:block;background:linear-gradient(135deg,#FFD700,#FF8C00);color:black;text-decoration:none;padding:14px 20px;border-radius:12px;margin-bottom:10px;text-align:center;font-weight:700;">⚡ Premium — 9,99€/mois</a>
    <a href="${BASE_URL}" style="display:block;background:linear-gradient(135deg,#8B5CF6,#00F5FF);color:white;text-decoration:none;padding:14px 20px;border-radius:12px;margin-bottom:10px;text-align:center;font-weight:700;">🎙️ Pack Voix — 12,99€/mois</a>
    <a href="${BASE_URL}" style="display:block;background:linear-gradient(135deg,#FF2D55,#8B5CF6);color:white;text-decoration:none;padding:14px 20px;border-radius:12px;text-align:center;font-weight:700;">🎬 Pack Complet — 29,99€/mois</a>
  </div>
  <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;margin-top:20px;">
    <a href="${BASE_URL}/api/email/unsubscribe?email=${encodeURIComponent(email)}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
  </p>
</div></body></html>`,
}

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  })
  return res.ok
}

export default async function handler(req, res) {
  // Sécurité : vérifier le secret
  const secret = req.query.secret || req.headers['x-cron-secret']
  if (secret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  const { supabaseAdmin } = await import('../../../lib/supabase-server')

  const now = new Date()

  // Récupérer les abonnés dont le prochain email est dû
  const { data: subscribers } = await supabaseAdmin
    .from('email_subscribers')
    .select('*')
    .lte('next_send_at', now.toISOString())
    .eq('active', true)
    .lt('sequence_step', 6) // Max 5 emails

  if (!subscribers || subscribers.length === 0) {
    return res.status(200).json({ sent: 0, message: 'Aucun email à envoyer' })
  }

  let sent = 0
  const DELAYS = [0, 2, 4, 6, 7] // jours entre chaque email

  for (const sub of subscribers) {
    const seq = SEQUENCE.find(s => s.step === sub.sequence_step)
    if (!seq) continue

    const html = templates[seq.templateKey](sub.email)
    const ok = await sendEmail(sub.email, seq.subject, html)

    if (ok) {
      const nextStep = sub.sequence_step + 1
      const nextDelay = DELAYS[nextStep - 1] || 7
      const nextSendAt = new Date(Date.now() + nextDelay * 24 * 60 * 60 * 1000)

      await supabaseAdmin
        .from('email_subscribers')
        .update({
          sequence_step: nextStep,
          next_send_at: nextStep <= 5 ? nextSendAt.toISOString() : null,
          active: nextStep <= 5,
          last_sent_at: now.toISOString(),
        })
        .eq('id', sub.id)

      sent++
    }
  }

  return res.status(200).json({ sent, total: subscribers.length })
}
