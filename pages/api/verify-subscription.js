// pages/api/verify-subscription.js
// Vérifie si une session Stripe est valide et active

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { sessionId } = req.body
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID manquant.' })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return res.status(500).json({ error: 'Clé Stripe manquante.' })
  }

  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    })

    if (!response.ok) {
      return res.status(502).json({ isPremium: false })
    }

    const session = await response.json()
    const isPremium = session.payment_status === 'paid' && session.status === 'complete'

    return res.status(200).json({ isPremium, email: session.customer_details?.email || '' })
  } catch (err) {
    return res.status(500).json({ isPremium: false })
  }
}
