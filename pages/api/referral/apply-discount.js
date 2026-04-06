// pages/api/referral/apply-discount.js
// Permet au parrain d'appliquer son -20% sur un plan choisi

import { supabaseAdmin } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, plan } = req.body
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiktok-machin-cash-projet-final.vercel.app'

  if (!stripeKey) return res.status(500).json({ error: 'Clé Stripe manquante.' })

  // Vérifier que le parrain a bien une réduction en attente
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('pending_discount, is_premium')
    .eq('id', userId)
    .single()

  if (!profile?.pending_discount) {
    return res.status(400).json({ error: 'Aucune réduction disponible.' })
  }

  if (!profile?.is_premium) {
    return res.status(403).json({ error: 'Tu dois être Premium pour appliquer la réduction.' })
  }

  // Prix avec -20%
  const plans = {
    premium: { name: 'TikTok Cash Machine — Premium (-20% parrainage)', amount: '799' },
    voice:   { name: 'TikTok Cash Machine — Pack Voix (-20% parrainage)', amount: '1039' },
    complete:{ name: 'TikTok Cash Machine — Pack Complet (-20% parrainage)', amount: '2399' },
  }

  const selectedPlan = plans[plan] || plans.premium

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
        'line_items[0][price_data][product_data][name]': selectedPlan.name,
        'line_items[0][price_data][recurring][interval]': 'month',
        'line_items[0][price_data][unit_amount]': selectedPlan.amount,
        'line_items[0][quantity]': '1',
        'success_url': `${baseUrl}/?discount_applied=true&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${baseUrl}/`,
      }).toString(),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(502).json({ error: err.error?.message || 'Erreur Stripe' })
    }

    const session = await response.json()

    // Marquer la réduction comme utilisée
    await supabaseAdmin.from('profiles')
      .update({ pending_discount: false })
      .eq('id', userId)

    // Incrémenter total_discounts_earned
    await supabaseAdmin.from('referral_codes')
      .update({ total_discounts_earned: supabaseAdmin.raw('total_discounts_earned + 1') })
      .eq('user_id', userId)

    return res.status(200).json({ url: session.url })
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}
