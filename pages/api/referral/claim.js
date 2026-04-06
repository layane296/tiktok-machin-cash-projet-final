// pages/api/referral/claim.js
// Appelé quand un filleul s'inscrit avec un code de parrainage

import { supabaseAdmin } from '../../../lib/supabase-server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nexvari.com'

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TikTok Cash Machine <noreply@nexvari.com>',
      to: [to],
      subject,
      html,
    }),
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { code, referredUserId } = req.body

  if (!code || !referredUserId) {
    return res.status(400).json({ error: 'Code et userId requis.' })
  }

  // Vérifier que le code existe
  const { data: codeData } = await supabaseAdmin
    .from('referral_codes')
    .select('*, profiles!referral_codes_user_id_fkey(email)')
    .eq('code', code.toUpperCase())
    .single()

  if (!codeData) {
    return res.status(404).json({ error: 'Code invalide.' })
  }

  // Vérifier que le filleul n'est pas déjà parrainé
  const { data: referred } = await supabaseAdmin
    .from('profiles')
    .select('referred_by, email, bonus_generations')
    .eq('id', referredUserId)
    .single()

  if (referred?.referred_by) {
    return res.status(400).json({ error: 'Tu as déjà utilisé un code de parrainage.' })
  }

  // Vérifier que le filleul ne parraine pas lui-même
  if (codeData.user_id === referredUserId) {
    return res.status(400).json({ error: 'Tu ne peux pas utiliser ton propre code.' })
  }

  // Créer le parrainage
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  await supabaseAdmin.from('referrals').insert({
    referrer_id: codeData.user_id,
    referred_id: referredUserId,
    code: code.toUpperCase(),
    status: 'pending',
    bonus_scripts: 1,
    expires_at: expiresAt.toISOString(),
  })

  // Donner +1 script gratuit au filleul
  await supabaseAdmin.from('profiles').update({
    referred_by: code.toUpperCase(),
    bonus_generations: (referred?.bonus_generations || 0) + 1,
  }).eq('id', referredUserId)

  // Mettre à jour le compteur du parrain
  await supabaseAdmin.from('referral_codes').update({
    total_referrals: codeData.total_referrals + 1,
  }).eq('code', code.toUpperCase())

  // Email au filleul
  await sendEmail(
    referred.email,
    '🎁 Tu as reçu 1 script gratuit !',
    `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
  </div>
  <div style="background:#0F0F0F;border:1px solid rgba(255,215,0,0.3);border-radius:20px;padding:32px;text-align:center;">
    <div style="font-size:64px;margin-bottom:16px;">🎁</div>
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 12px;">Tu as reçu 1 script gratuit !</h1>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
      Un ami t'a parrainé sur TikTok Cash Machine. Tu as maintenant <strong style="color:#FFD700;">1 génération supplémentaire gratuite</strong> sur ton compte.
    </p>
    <div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="color:#FFD700;font-weight:700;margin:0;">⏰ Offre spéciale 24h</p>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:8px 0 0;">Prends un abonnement dans les 24h et bénéficie de <strong style="color:white;">-10% à vie</strong> sur ton plan.</p>
    </div>
    <a href="${BASE_URL}" style="display:inline-block;background:linear-gradient(135deg,#FF2D55,#c0392b);color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;">⚡ Utiliser mon script gratuit</a>
  </div>
</div></body></html>`
  )

  // Email au parrain
  const referrerEmail = codeData.profiles?.email
  if (referrerEmail) {
    await sendEmail(
      referrerEmail,
      '🎉 Quelqu\'un a utilisé ton code de parrainage !',
      `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
  </div>
  <div style="background:#0F0F0F;border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:32px;text-align:center;">
    <div style="font-size:64px;margin-bottom:16px;">🎉</div>
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 12px;">Ton parrainage a fonctionné !</h1>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
      Quelqu'un vient d'utiliser ton code <strong style="color:#10B981;">${code.toUpperCase()}</strong>. Si cette personne prend un abonnement dans les 24h, tu recevras automatiquement <strong style="color:#FFD700;">-20% sur ton prochain paiement</strong>.
    </p>
    <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:16px;">
      <p style="color:#10B981;font-weight:700;margin:0;">💰 Récompense en attente</p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0;">-20% sur ton prochain paiement mensuel si conversion dans 24h</p>
    </div>
  </div>
</div></body></html>`
    )
  }

  return res.status(200).json({
    success: true,
    bonusScripts: 1,
    discountAvailable: true,
    expiresAt: expiresAt.toISOString(),
  })
}
