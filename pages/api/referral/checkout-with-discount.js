// pages/api/referral/checkout-with-discount.js
// Checkout avec -10% pour filleul — minimum Premium 9,99€ requis

import { supabaseAdmin } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, plan } = req.body
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiktok-machin-cash-projet-final.vercel.app'

  if (!stripeKey) return res.status(500).json({ error: 'Clé Stripe manquante.' })
  if (!plan || !['premium', 'voice', 'complete'].includes(plan)) {
    return res.status(400).json({ error: 'Plan invalide. Choisis premium, voice ou complete.' })
  }

  // Vérifier si le filleul a une réduction active (24h)
  const { data: referral } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .eq('referred_id', userId)
    .eq('status', 'pending')
    .gte('expires_at', new Date().toISOString())
    .single()

  const hasDiscount = !!referral

  // Prix de base et avec -10%
  const plans = {
    premium: { name: 'TikTok Cash Machine — Premium', base: 999, discounted: 899 },
    voice:   { name: 'TikTok Cash Machine — Pack Voix', base: 1299, discounted: 1169 },
    complete:{ name: 'TikTok Cash Machine — Pack Complet', base: 2999, discounted: 2699 },
  }

  const selectedPlan = plans[plan]
  const amount = hasDiscount ? selectedPlan.discounted : selectedPlan.base
  const planName = selectedPlan.name + (hasDiscount ? ' (-10% parrainage)' : '')

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'mode': 'subscription',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': planName,
        'line_items[0][price_data][recurring][interval]': 'month',
        'line_items[0][price_data][unit_amount]': amount.toString(),
        'line_items[0][quantity]': '1',
        'success_url': `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${baseUrl}/?canceled=true`,
      }).toString(),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(502).json({ error: err.error?.message || 'Erreur Stripe' })
    }

    const session = await response.json()

    // Marquer le parrainage comme converti + donner -20% au parrain
    if (hasDiscount && referral) {
      await supabaseAdmin.from('referrals').update({
        status: 'converted',
        converted_at: new Date().toISOString(),
      }).eq('id', referral.id)

      // Parrain reçoit -20% à appliquer sur son prochain paiement
      await supabaseAdmin.from('profiles').update({
        pending_discount: true,
      }).eq('id', referral.referrer_id)

      // Mettre à jour le compteur du parrain
      await supabaseAdmin.from('referral_codes')
        .update({ total_discounts_earned: supabaseAdmin.raw('total_discounts_earned + 1') })
        .eq('user_id', referral.referrer_id)

      // Email au parrain pour le prévenir
      const { data: referrerProfile } = await supabaseAdmin
        .from('profiles').select('email').eq('id', referral.referrer_id).single()

      if (referrerProfile?.email && process.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'TikTok Cash Machine <noreply@nexvari.com>',
            to: [referrerProfile.email],
            subject: '💰 Ton filleul vient de s\'abonner ! Tu as -20%',
            html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
  </div>
  <div style="background:#0F0F0F;border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:32px;text-align:center;">
    <div style="font-size:64px;margin-bottom:16px;">💰</div>
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 12px;">Ton filleul s'est abonné !</h1>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
      Félicitations ! Ton parrainage a fonctionné. Tu as gagné <strong style="color:#10B981;">-20% sur ton prochain paiement mensuel</strong>.
    </p>
    <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="color:#10B981;font-weight:700;font-size:18px;margin:0;">-20% disponible</p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0;">Connecte-toi pour choisir sur quel plan appliquer ta réduction</p>
    </div>
    <a href="${baseUrl}" style="display:inline-block;background:linear-gradient(135deg,#10B981,#059669);color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;">
      Appliquer ma réduction
    </a>
  </div>
</div></body></html>`,
          }),
        })
      }
    }

    return res.status(200).json({
      url: session.url,
      hasDiscount,
      discount: hasDiscount ? '10%' : null,
      finalPrice: amount / 100,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}
