// pages/api/checkout.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return res.status(500).json({ error: 'Clé Stripe manquante.' })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'mode': 'subscription',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': 'TikTok Cash Machine Premium',
        'line_items[0][price_data][product_data][description]': 'Générations illimitées de scripts TikTok viraux',
        'line_items[0][price_data][recurring][interval]': 'month',
        'line_items[0][price_data][unit_amount]': '999',
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
    return res.status(200).json({ url: session.url })
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}
