// pages/api/admin/stats.js
// API protégée par mot de passe admin

import { supabaseAdmin } from '../../../lib/supabase-server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-tiktok-2025'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const secret = req.headers['x-admin-secret'] || req.query.secret
  if (secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Non autorisé' })

  try {
    // ── Utilisateurs ──────────────────────────────────────────
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, email, is_premium, has_voice, has_video, generations_used, created_at, referred_by')
      .order('created_at', { ascending: false })

    const totalUsers = profiles?.length || 0
    const premiumUsers = profiles?.filter(p => p.is_premium && !p.has_voice && !p.has_video).length || 0
    const voiceUsers = profiles?.filter(p => p.has_voice && !p.has_video).length || 0
    const videoUsers = profiles?.filter(p => p.has_video).length || 0
    const freeUsers = profiles?.filter(p => !p.is_premium).length || 0

    // ── Revenus estimés (MRR) ─────────────────────────────────
    const mrr = (premiumUsers * 9.99) + (voiceUsers * 12.99) + (videoUsers * 29.99)

    // ── Scripts générés ───────────────────────────────────────
    const { data: scripts } = await supabaseAdmin
      .from('scripts')
      .select('id, topic, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(100)

    const totalScripts = scripts?.length || 0

    // Scripts des 7 derniers jours
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const scriptsThisWeek = scripts?.filter(s => new Date(s.created_at) > weekAgo).length || 0

    // ── Parrainages ───────────────────────────────────────────
    const { data: referrals } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false })

    const totalReferrals = referrals?.length || 0
    const convertedReferrals = referrals?.filter(r => r.status === 'converted').length || 0
    const conversionRate = totalReferrals > 0 ? Math.round((convertedReferrals / totalReferrals) * 100) : 0

    // ── Emails subscribers ─────────────────────────────────────
    const { data: subscribers } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, email, created_at, sequence_step, active')
      .order('created_at', { ascending: false })

    const totalSubscribers = subscribers?.length || 0
    const activeSubscribers = subscribers?.filter(s => s.active).length || 0

    // ── Nouvelles inscriptions (7 jours) ──────────────────────
    const newUsersThisWeek = profiles?.filter(p => new Date(p.created_at) > weekAgo).length || 0

    // ── Graphique inscriptions par jour (30 derniers jours) ───
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const dailySignups = {}
    profiles?.forEach(p => {
      const date = new Date(p.created_at)
      if (date > thirtyDaysAgo) {
        const day = date.toISOString().split('T')[0]
        dailySignups[day] = (dailySignups[day] || 0) + 1
      }
    })

    // ── Derniers utilisateurs ─────────────────────────────────
    const recentUsers = profiles?.slice(0, 10).map(p => ({
      email: p.email,
      plan: p.has_video ? 'Pack Complet' : p.has_voice ? 'Pack Voix' : p.is_premium ? 'Premium' : 'Gratuit',
      generations: p.generations_used || 0,
      referred: !!p.referred_by,
      createdAt: p.created_at,
    }))

    return res.status(200).json({
      users: {
        total: totalUsers,
        free: freeUsers,
        premium: premiumUsers,
        voice: voiceUsers,
        video: videoUsers,
        newThisWeek: newUsersThisWeek,
        recent: recentUsers,
      },
      revenue: {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12 * 100) / 100,
        premiumRevenue: Math.round(premiumUsers * 9.99 * 100) / 100,
        voiceRevenue: Math.round(voiceUsers * 12.99 * 100) / 100,
        videoRevenue: Math.round(videoUsers * 29.99 * 100) / 100,
      },
      scripts: {
        total: totalScripts,
        thisWeek: scriptsThisWeek,
        recent: scripts?.slice(0, 5).map(s => ({ topic: s.topic, createdAt: s.created_at })),
      },
      referrals: {
        total: totalReferrals,
        converted: convertedReferrals,
        conversionRate,
      },
      email: {
        total: totalSubscribers,
        active: activeSubscribers,
      },
      charts: {
        dailySignups,
      },
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message })
  }
}
