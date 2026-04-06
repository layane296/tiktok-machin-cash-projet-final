// lib/useLanguage.js
import { useState, useEffect } from 'react'
import { useTranslation } from './translations'

export function useLanguage() {
  const [lang, setLang] = useState('fr')

  useEffect(() => {
    // Détecter la langue du navigateur
    const savedLang = localStorage.getItem('tcm_lang')
    if (savedLang) {
      setLang(savedLang)
    } else {
      const browserLang = navigator.language?.substring(0, 2)
      const detected = browserLang === 'en' ? 'en' : 'fr'
      setLang(detected)
      localStorage.setItem('tcm_lang', detected)
    }
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr'
    setLang(newLang)
    localStorage.setItem('tcm_lang', newLang)
  }

  const { t } = useTranslation(lang)

  return { lang, toggleLang, t }
}
