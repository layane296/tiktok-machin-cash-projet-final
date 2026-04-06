// pages/api/referral/get-code.js
import { supabaseAdmin } from '../../../lib/supabase-server'

function generateCode(userId) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const prefix = 'TCM'
  let suffix = ''
  const seed = userId.replace(/-/g, '').substring(0, 6)
  for (let i = 0; i < 6; i++) {
    suffix += chars[parseInt(seed[i], 16) % chars.length]
  }
  return `${prefix}-${suffix}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId requis' })

  try {
    // Vérifier que l'utilisateur est Premium
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_premium, referral_code')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profil introuvable.' })
    }

    if (!profile.is_premium) {
      return res.status(403).json({ error: 'PREMIUM_REQUIRED' })
    }

    // Si code déjà existant, retourner les stats
    if (profile.referral_code) {
      const { data: codeData } = await supabaseAdmin
        .from('referral_codes')
        .select('total_referrals, total_discounts_earned')
        .eq('code', profile.referral_code)
        .single()

      return res.status(200).json({
        code: profile.referral_code,
        stats: codeData || { total_referrals: 0, total_discounts_earned: 0 }
      })
    }

    // Générer un nouveau code unique
    let code = generateCode(userId)

    // Vérifier l'unicité
    const { data: existing } = await supabaseAdmin
      .from('referral_codes')
      .select('code')
      .eq('code', code)
      .single()

    if (existing) {
      // Ajouter un suffixe aléatoire si collision
      code = code + Math.floor(Math.random() * 9)
    }

    // Insérer dans referral_codes
    const { error: insertError } = await supabaseAdmin
      .from('referral_codes')
      .insert({ user_id: userId, code })

    if (insertError) {
      console.error('Insert error:', insertError)
      return res.status(500).json({ error: 'Erreur création code: ' + insertError.message })
    }

    // Mettre à jour le profil
    await supabaseAdmin
      .from('profiles')
      .update({ referral_code: code })
      .eq('id', userId)

    return res.status(200).json({
      code,
      stats: { total_referrals: 0, total_discounts_earned: 0 }
    })
  } catch (err) {
    console.error('get-code error:', err)
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message })
  }
}
