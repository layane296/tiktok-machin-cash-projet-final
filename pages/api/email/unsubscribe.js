// pages/api/email/unsubscribe.js
export default async function handler(req, res) {
  const { email } = req.query
  if (!email) return res.status(400).send('Email manquant')

  const { supabaseAdmin } = await import('../../../lib/supabase-server')

  await supabaseAdmin
    .from('email_subscribers')
    .update({ active: false })
    .eq('email', decodeURIComponent(email))

  return res.send(`
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Désinscription</title></head>
<body style="background:#080808;color:white;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <div style="text-align:center;padding:40px;">
    <div style="font-size:48px;margin-bottom:16px;">✅</div>
    <h1 style="font-size:24px;margin:0 0 8px;">Tu es désinscrit(e)</h1>
    <p style="color:rgba(255,255,255,0.5);">Tu ne recevras plus d'emails de TikTok Cash Machine.</p>
    <a href="https://tiktok-machin-cash-projet-final.vercel.app" style="display:inline-block;margin-top:24px;background:#FF2D55;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold;">Retour au site</a>
  </div>
</body>
</html>`)
}
