// pages/api/email/subscribe.js
// Inscription à la liste email + envoi de la séquence automatique

import { supabaseAdmin } from '../../../lib/supabase-server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'TikTok Cash Machine <noreply@nexvari.com>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiktok-machin-cash-projet-final.vercel.app'

// ─── Templates emails ─────────────────────────────────────────────
const emailTemplates = {
  welcome: (name) => ({
    subject: '🎬 Ta génération gratuite t\'attend !',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#FF2D55,#8B5CF6);padding:12px 20px;border-radius:12px;margin-bottom:16px;">
        <span style="color:white;font-size:24px;font-weight:900;letter-spacing:2px;">TIKTOK CASH MACHINE</span>
      </div>
    </div>

    <!-- Hero -->
    <div style="background:#0F0F0F;border:1px solid rgba(255,45,85,0.3);border-radius:20px;padding:32px;margin-bottom:24px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">🎬</div>
      <h1 style="color:white;font-size:28px;font-weight:900;margin:0 0 12px;letter-spacing:-0.5px;">
        Bienvenue ${name ? name : ''} ! 🔥
      </h1>
      <p style="color:rgba(255,255,255,0.6);font-size:16px;line-height:1.6;margin:0 0 24px;">
        Tu viens de rejoindre les créateurs qui génèrent du contenu TikTok viral grâce à l'IA. 
        Ta <strong style="color:#FF2D55;">génération gratuite</strong> t'attend.
      </p>
      <a href="${BASE_URL}" style="display:inline-block;background:linear-gradient(135deg,#FF2D55,#c0392b);color:white;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:700;font-size:16px;">
        ⚡ Générer mon premier script
      </a>
    </div>

    <!-- What you get -->
    <div style="background:#0F0F0F;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin-bottom:24px;">
      <h2 style="color:white;font-size:18px;font-weight:700;margin:0 0 16px;">Ce que tu peux créer :</h2>
      ${['🪝 Un hook qui arrête le scroll en 3 secondes', '📜 Un script TikTok structuré en 3 actes', '#️⃣ 20 hashtags optimisés pour l\'algorithme', '🎙️ Une voix off professionnelle en MP3', '🎬 Une vidéo complète avec images IA'].map(item => `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        <span style="font-size:16px;">${item}</span>
      </div>`).join('')}
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0;">
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
        TikTok Cash Machine • <a href="${BASE_URL}" style="color:#FF2D55;">Accéder au site</a>
        <br><br>
        <a href="${BASE_URL}/api/email/unsubscribe?email={{email}}" style="color:rgba(255,255,255,0.2);font-size:11px;">Se désinscrire</a>
      </p>
    </div>
  </div>
</body>
</html>`
  }),

  day2: () => ({
    subject: '🔥 Le hook qui fait 2M de vues (copie-le)',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <div style="text-align:center;margin-bottom:32px;">
      <span style="background:linear-gradient(135deg,#FF2D55,#8B5CF6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;font-weight:900;">TIKTOK CASH MACHINE</span>
    </div>

    <div style="background:#0F0F0F;border:1px solid rgba(0,245,255,0.3);border-radius:20px;padding:32px;margin-bottom:24px;">
      <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;">Le secret des vidéos à 2M de vues 🤫</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px;">Jour 2 • Astuce exclusive</p>
      
      <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 20px;">
        Les créateurs qui cartonnent ont tous un point commun : <strong style="color:#00F5FF;">leur hook arrête le scroll en moins de 3 secondes.</strong>
      </p>

      <div style="background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="color:#00F5FF;font-size:13px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">✨ Les 3 structures de hooks qui marchent toujours</p>
        ${[
          '"POV : tu découvres que..."',
          '"Ce que personne ne te dit sur..."',
          '"J\'ai testé X pendant 30 jours et voici..."'
        ].map((h, i) => `<p style="color:white;font-size:15px;margin:0 0 8px;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px;">${i+1}. ${h}</p>`).join('')}
      </div>

      <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
        Avec TikTok Cash Machine, tu n'as pas besoin d'y réfléchir. L'IA génère le hook parfait pour ton sujet en 10 secondes.
      </p>

      <a href="${BASE_URL}" style="display:inline-block;background:linear-gradient(135deg,#FF2D55,#c0392b);color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;">
        ⚡ Générer mon hook viral maintenant
      </a>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="color:rgba(255,255,255,0.3);font-size:12px;">
        <a href="${BASE_URL}/api/email/unsubscribe?email={{email}}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
      </p>
    </div>
  </div>
</body>
</html>`
  }),

  day4: () => ({
    subject: '💰 De 0 à 50K vues en 2 semaines (son témoignage)',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
    </div>

    <div style="background:#0F0F0F;border:1px solid rgba(255,215,0,0.3);border-radius:20px;padding:32px;margin-bottom:24px;">
      <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 24px;">
        "J'ai eu 50K vues sur ma première vidéo" 🤯
      </h1>

      <!-- Testimonial -->
      <div style="background:rgba(255,215,0,0.06);border-left:3px solid #FFD700;padding:20px;border-radius:0 12px 12px 0;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.7;margin:0 0 12px;font-style:italic;">
          "J'avais jamais fait de TikTok de ma vie. J'ai entré 'les 3 règles des millionnaires' et en 20 secondes j'avais un script complet. J'ai posté la vidéo et elle a explosé. 50K vues en 2 semaines."
        </p>
        <p style="color:#FFD700;font-size:13px;font-weight:700;margin:0;">— Alexandre M., créateur lifestyle</p>
      </div>

      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 20px;">
        Avec le <strong style="color:#FFD700;">Plan Premium</strong>, tu accèdes à des générations illimitées. 
        Poste chaque jour, teste différents sujets, et trouve ta niche qui cartonne.
      </p>

      <div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#FFD700;font-size:28px;font-weight:900;margin:0;">9,99€<span style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.4)">/mois</span></p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0;">Scripts illimités • Résiliable à tout moment</p>
      </div>

      <a href="${BASE_URL}" style="display:inline-block;background:linear-gradient(135deg,#FFD700,#FF8C00);color:black;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;width:100%;text-align:center;box-sizing:border-box;">
        👑 Passer Premium — 9,99€/mois
      </a>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="color:rgba(255,255,255,0.3);font-size:12px;">
        <a href="${BASE_URL}/api/email/unsubscribe?email={{email}}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
      </p>
    </div>
  </div>
</body>
</html>`
  }),

  day6: () => ({
    subject: '🎙️ Nouveau : génère ta voix off en 5 secondes',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:#8B5CF6;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
    </div>

    <div style="background:#0F0F0F;border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:32px;margin-bottom:24px;">
      <div style="font-size:48px;text-align:center;margin-bottom:16px;">🎙️</div>
      <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 12px;text-align:center;">
        Ta voix off IA est prête
      </h1>
      <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;text-align:center;">
        Le Pack Voix transforme ton script en voix off naturelle. Télécharge le MP3 et colle-le dans CapCut.
      </p>

      ${[
        ['⚡', 'Génération en 5 secondes'],
        ['🎙️', 'Voix naturelle OpenAI'],
        ['⬇️', 'Téléchargement MP3 illimité'],
        ['🎬', 'Compatible CapCut, Premiere, Final Cut'],
      ].map(([emoji, text]) => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <span style="font-size:20px;">${emoji}</span>
        <span style="color:rgba(255,255,255,0.8);font-size:15px;">${text}</span>
      </div>`).join('')}

      <div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:16px;margin:24px 0;text-align:center;">
        <p style="color:#8B5CF6;font-size:28px;font-weight:900;margin:0;">12,99€<span style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.4)">/mois</span></p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0;">Scripts illimités + Voix off</p>
      </div>

      <a href="${BASE_URL}" style="display:inline-block;background:linear-gradient(135deg,#8B5CF6,#00F5FF);color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;width:100%;text-align:center;box-sizing:border-box;">
        🎙️ Activer le Pack Voix
      </a>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="color:rgba(255,255,255,0.3);font-size:12px;">
        <a href="${BASE_URL}/api/email/unsubscribe?email={{email}}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
      </p>
    </div>
  </div>
</body>
</html>`
  }),

  day7: () => ({
    subject: '⚠️ Dernière chance — offre spéciale ce soir',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:#FF2D55;font-size:28px;font-weight:900;">TIKTOK CASH MACHINE</span>
    </div>

    <div style="background:#0F0F0F;border:1px solid rgba(255,45,85,0.5);border-radius:20px;padding:32px;margin-bottom:24px;">
      <div style="background:rgba(255,45,85,0.1);border:1px solid rgba(255,45,85,0.3);border-radius:10px;padding:12px;text-align:center;margin-bottom:24px;">
        <span style="color:#FF2D55;font-weight:700;font-size:14px;">⚠️ Dernier email de la séquence</span>
      </div>

      <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 16px;">
        Tu laisses de l'argent sur la table 💸
      </h1>

      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 20px;">
        Pendant que tu lis cet email, des créateurs postent leur 10ème vidéo de la semaine générée en 10 secondes. Pendant ce temps, toi tu cherches encore des idées.
      </p>

      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 24px;">
        <strong style="color:white;">La différence ?</strong> Ils ont un outil. Toi aussi tu peux l'avoir dès maintenant.
      </p>

      <!-- Plans -->
      ${[
        { name: 'Premium', price: '9,99€', desc: 'Scripts illimités', color: '#FFD700', gradient: 'linear-gradient(135deg,#FFD700,#FF8C00)', textColor: 'black' },
        { name: 'Pack Voix', price: '12,99€', desc: 'Scripts + Voix off MP3', color: '#8B5CF6', gradient: 'linear-gradient(135deg,#8B5CF6,#00F5FF)', textColor: 'white' },
        { name: 'Pack Complet', price: '29,99€', desc: 'Scripts + Voix + Vidéo IA', color: '#FF2D55', gradient: 'linear-gradient(135deg,#FF2D55,#8B5CF6)', textColor: 'white' },
      ].map(p => `
      <a href="${BASE_URL}" style="display:block;background:${p.gradient};color:${p.textColor};text-decoration:none;padding:14px 20px;border-radius:12px;margin-bottom:10px;text-align:left;">
        <span style="font-weight:700;font-size:15px;">${p.name} — ${p.price}/mois</span>
        <span style="display:block;font-size:13px;opacity:0.8;margin-top:2px;">${p.desc}</span>
      </a>`).join('')}

      <p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;margin:16px 0 0;">
        Résiliable à tout moment • Paiement sécurisé Stripe
      </p>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="color:rgba(255,255,255,0.3);font-size:12px;">
        <a href="${BASE_URL}/api/email/unsubscribe?email={{email}}" style="color:rgba(255,255,255,0.2);">Se désinscrire</a>
      </p>
    </div>
  </div>
</body>
</html>`
  }),
}

// ─── Envoyer un email via Resend ──────────────────────────────────
async function sendEmail(to, template) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject: template.subject,
      html: template.html.replace(/{{email}}/g, encodeURIComponent(to)),
    }),
  })
  return res.ok
}

// ─── Handler principal ────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name, userId } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide.' })
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Clé Resend manquante.' })
  }

  try {
    // Vérifier si déjà inscrit
    const { data: existing } = await supabaseAdmin
      .from('email_subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return res.status(200).json({ success: true, message: 'Déjà inscrit !' })
    }

    // Enregistrer en base
    await supabaseAdmin.from('email_subscribers').insert({
      email,
      name: name || '',
      user_id: userId || null,
      subscribed_at: new Date().toISOString(),
      sequence_step: 1,
      next_send_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // J+2
    })

    // Envoyer l'email de bienvenue immédiatement
    await sendEmail(email, emailTemplates.welcome(name))

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}
