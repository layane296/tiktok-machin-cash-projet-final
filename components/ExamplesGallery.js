// components/ExamplesGallery.js
import { useState, useRef } from 'react'

const CATEGORIES = ['Tous', 'Argent', 'Motivation', 'Business', 'IA', 'Facts', 'Histoire', 'Sport', 'Santé', 'Lifestyle']

const STYLES = {
  faceless: { label: 'Faceless', color: '#FF2D55' },
  storytelling: { label: 'Storytelling', color: '#8B5CF6' },
  facts: { label: 'Facts', color: '#00F5FF' },
  tutorial: { label: 'Tuto', color: '#FFD700' },
  motivation: { label: 'Motivation', color: '#FF8C00' },
  ranking: { label: 'Ranking', color: '#10B981' },
}

const EXAMPLES = [
  // ARGENT
  { id: 1, category: 'Argent', style: 'faceless', hook: '🤑 J\'ai gagné 3000€ ce mois sans bosser', script: 'Voici les 3 sources de revenus passifs que personne ne te dit. La première m\'a changé la vie...', views: '2.1M', emoji: '💰' },
  { id: 2, category: 'Argent', style: 'tutorial', hook: '💳 Le secret des riches que ta banque te cache', script: 'Ils placent leur argent ici et toi tu laisses tout dormir. Voici comment faire pareil...', views: '890K', emoji: '🏦' },
  { id: 3, category: 'Argent', style: 'facts', hook: '📈 Investis 50€/mois et deviens millionnaire', script: 'Les intérêts composés font tout le travail. Voici le calcul exact sur 30 ans...', views: '3.4M', emoji: '📊' },
  { id: 4, category: 'Argent', style: 'storytelling', hook: '😱 De 0 à 10K€/mois en 6 mois', script: 'J\'avais 0 compétence et 0 expérience. Voici exactement ce que j\'ai fait mois par mois...', views: '1.7M', emoji: '🚀' },
  { id: 5, category: 'Argent', style: 'tutorial', hook: '🛒 Ce side hustle rapporte 500€/semaine', script: 'Tu peux le lancer ce soir depuis ton canapé. Zéro investissement, zéro stock...', views: '4.2M', emoji: '💡' },
  { id: 6, category: 'Argent', style: 'faceless', hook: '💸 Arrête de travailler pour l\'argent', script: 'Fais travailler l\'argent pour toi. Les 3 règles que les millionnaires suivent tous...', views: '988K', emoji: '🏆' },
  { id: 7, category: 'Argent', style: 'ranking', hook: '🔝 Top 5 apps pour gagner de l\'argent en 2025', script: 'J\'ai testé 47 apps. Seules ces 5 valent vraiment le coup. Numéro 1 est insane...', views: '2.8M', emoji: '📱' },
  { id: 8, category: 'Argent', style: 'facts', hook: '🤯 Le dropshipping est-il encore rentable ?', script: 'Spoiler : oui mais pas comme avant. Voici la nouvelle méthode qui fonctionne en 2025...', views: '1.1M', emoji: '📦' },
  { id: 9, category: 'Argent', style: 'tutorial', hook: '💰 Vends tes compétences en ligne dès demain', script: 'Peu importe ce que tu sais faire, il y a quelqu\'un prêt à payer. Voici comment trouver tes premiers clients...', views: '756K', emoji: '🎯' },
  { id: 10, category: 'Argent', style: 'faceless', hook: '📊 Pourquoi 90% des gens restent pauvres', script: 'Ce n\'est pas une question de talent. C\'est une question de mindset et de ces 3 habitudes...', views: '5.1M', emoji: '🧠' },

  // MOTIVATION
  { id: 11, category: 'Motivation', style: 'motivation', hook: '🔥 Tu te plains mais tu ne changes rien', script: 'Dans 5 ans tu seras exactement là où tu es aujourd\'hui si tu ne fais rien maintenant. Agis.', views: '8.3M', emoji: '⚡' },
  { id: 12, category: 'Motivation', style: 'storytelling', hook: '😤 Ils m\'ont dit que j\'allais échouer', script: 'Mon patron, ma famille, mes amis. Ils avaient tous tort. Voici ce que j\'ai fait à la place...', views: '3.2M', emoji: '💪' },
  { id: 13, category: 'Motivation', style: 'motivation', hook: '⏰ Tu perds 4h par jour sans t\'en rendre compte', script: 'Les réseaux sociaux volent ta vie. Voici comment reprendre le contrôle de ton temps...', views: '6.7M', emoji: '🕐' },
  { id: 14, category: 'Motivation', style: 'facts', hook: '🌅 La routine matinale des millionnaires', script: 'Ils se lèvent tous avant 6h. Voici exactement ce qu\'ils font les 2 premières heures...', views: '4.9M', emoji: '☀️' },
  { id: 15, category: 'Motivation', style: 'motivation', hook: '💫 Un an de discipline change tout', script: 'Sport, nutrition, travail, mindset. 365 jours de constance. Voici à quoi ça ressemble...', views: '7.1M', emoji: '📅' },
  { id: 16, category: 'Motivation', style: 'tutorial', hook: '🧠 La technique des 5 secondes qui change tout', script: 'Mel Robbins a découvert ça et ça a tout changé. 5-4-3-2-1 et tu agis...', views: '2.4M', emoji: '🎯' },
  { id: 17, category: 'Motivation', style: 'storytelling', hook: '😢 J\'ai tout perdu à 30 ans. Voici comment j\'ai rebondi', script: 'Divorce, faillite, dépression. En 18 mois j\'avais tout reconstruit. Voici mon chemin...', views: '9.8M', emoji: '🦋' },

  // BUSINESS
  { id: 18, category: 'Business', style: 'tutorial', hook: '🏢 Lance ton business en 24h sans argent', script: 'Le business model que personne ne te montre. Zéro capital, zéro risque, 100% en ligne...', views: '3.6M', emoji: '💼' },
  { id: 19, category: 'Business', style: 'facts', hook: '📧 L\'email marketing rapporte 42€ pour 1€ investi', script: 'C\'est le meilleur ROI de tous les canaux marketing. Voici comment construire ta liste...', views: '1.3M', emoji: '📨' },
  { id: 20, category: 'Business', style: 'ranking', hook: '🔝 Top 5 niches ultra rentables en 2025', script: 'J\'ai analysé 500 business en ligne. Ces 5 niches explosent en ce moment. La #1 est insane...', views: '4.4M', emoji: '💎' },
  { id: 21, category: 'Business', style: 'tutorial', hook: '🤖 Comment j\'utilise l\'IA pour 10x mon business', script: 'Ces 5 outils IA remplacent 3 employés. Voici comment je les utilise au quotidien...', views: '5.2M', emoji: '⚙️' },
  { id: 22, category: 'Business', style: 'storytelling', hook: '📱 Mon app a fait 100K€ sans une ligne de code', script: 'No-code, idée simple, bon marketing. Voici comment j\'ai lancé en 2 semaines...', views: '2.7M', emoji: '🛠️' },
  { id: 23, category: 'Business', style: 'faceless', hook: '🎯 Le tunnel de vente qui convertit à 40%', script: 'La plupart convertissent à 2%. Voici la structure exacte de mes funnels qui cartonnent...', views: '987K', emoji: '📈' },
  { id: 24, category: 'Business', style: 'tutorial', hook: '💬 Comment closer n\'importe quel client', script: 'La technique de vente que j\'ai apprise chez Apple. 3 questions et ils disent oui...', views: '1.8M', emoji: '🤝' },
  { id: 25, category: 'Business', style: 'facts', hook: '📊 Le business model le plus scalable au monde', script: 'Pas le SaaS, pas le e-commerce. C\'est celui-là et voici pourquoi tu devrais le faire...', views: '3.1M', emoji: '🌐' },

  // IA
  { id: 26, category: 'IA', style: 'facts', hook: '🤖 ChatGPT peut faire ça et tu ne le savais pas', script: 'Ces 10 prompts secrets que les pros utilisent. Le #7 m\'a économisé 20h de travail...', views: '12.4M', emoji: '💬' },
  { id: 27, category: 'IA', style: 'tutorial', hook: '🎨 Crée des images IA qui font 100K vues', script: 'Le prompt exact que j\'utilise sur Midjourney. Copy-paste et génère tes propres visuels...', views: '6.8M', emoji: '🖼️' },
  { id: 28, category: 'IA', style: 'faceless', hook: '😱 L\'IA va remplacer ton job dans 2 ans', script: 'Ces 10 métiers vont disparaître. Mais voici les 5 nouveaux métiers qui vont exploser...', views: '9.3M', emoji: '⚠️' },
  { id: 29, category: 'IA', style: 'tutorial', hook: '🔧 J\'ai créé un agent IA qui bosse à ma place', script: 'Il répond aux emails, gère mon calendrier, et fait mes devis. Voici comment le créer...', views: '4.1M', emoji: '🤖' },
  { id: 30, category: 'IA', style: 'ranking', hook: '📱 Top 10 outils IA qui vont changer ta vie', script: 'Ces outils existent depuis moins d\'un an mais ils sont déjà indispensables. Le #3 est fou...', views: '7.6M', emoji: '🛸' },
  { id: 31, category: 'IA', style: 'facts', hook: '🧠 Comment l\'IA va rendre tout le monde millionnaire', script: 'Pour la première fois dans l\'histoire, l\'accès aux outils est équitable. Voici pourquoi...', views: '3.9M', emoji: '💡' },
  { id: 32, category: 'IA', style: 'tutorial', hook: '🎬 Crée des vidéos TikTok avec l\'IA en 5 min', script: 'Script + voix off + images + montage. Tout automatisé. Voici le workflow exact...', views: '8.2M', emoji: '🎥' },

  // FACTS
  { id: 33, category: 'Facts', style: 'facts', hook: '🤯 Le fait qui va te choquer aujourd\'hui', script: 'L\'eau chaude gèle plus vite que l\'eau froide. C\'est prouvé et voici l\'explication...', views: '15.2M', emoji: '❄️' },
  { id: 34, category: 'Facts', style: 'facts', hook: '🐙 Les pieuvres ont 3 cœurs et du sang bleu', script: 'Et c\'est le plus petit de leurs superpouvoirs. Voici les 5 faits insensés sur les pieuvres...', views: '8.7M', emoji: '🌊' },
  { id: 35, category: 'Facts', style: 'facts', hook: '🌍 Ce pays n\'existe sur aucune carte officielle', script: 'Il a sa propre monnaie, son gouvernement, ses lois. Mais aucun pays ne le reconnaît...', views: '11.3M', emoji: '🗺️' },
  { id: 36, category: 'Facts', style: 'facts', hook: '🧬 Ton corps remplace 96% de ses cellules en 1 an', script: 'Dans un an, tu seras littéralement une nouvelle personne. Voici ce qui ne change jamais...', views: '6.4M', emoji: '🔬' },
  { id: 37, category: 'Facts', style: 'facts', hook: '🕳️ Le trou noir le plus proche est à côté de toi', script: 'À seulement 1500 années lumière. Et il est en train de grandir. Voici ce que ça change...', views: '9.1M', emoji: '🌌' },
  { id: 38, category: 'Facts', style: 'facts', hook: '🏛️ L\'empire romain était plus moderne que tu ne crois', script: 'Chauffage central, eau courante, fast food. Voici 7 inventions romaines qui te choquent...', views: '7.3M', emoji: '⚔️' },
  { id: 39, category: 'Facts', style: 'facts', hook: '🌴 L\'arbre qui peut tuer un humain en quelques heures', script: 'Il pousse en Floride et ressemble à un pommier. Ne t\'abrite jamais sous lui s\'il pleut...', views: '18.6M', emoji: '☠️' },
  { id: 40, category: 'Facts', style: 'facts', hook: '🐜 Les fourmis pourraient soulever un immeuble', script: 'Proportionnellement à leur taille, elles sont 100 fois plus fortes que nous. Voici pourquoi...', views: '4.8M', emoji: '💪' },

  // HISTOIRE
  { id: 41, category: 'Histoire', style: 'storytelling', hook: '⚔️ La bataille la plus courte de l\'histoire : 38 minutes', script: 'En 1896, la guerre Anglo-Zanzibar durait moins d\'une heure. Voici ce qui s\'est passé...', views: '6.2M', emoji: '🏴' },
  { id: 42, category: 'Histoire', style: 'storytelling', hook: '🕵️ L\'espion qui a changé la Seconde Guerre mondiale', script: 'Il était double agent et personne ne le savait. Son opération secrète a sauvé des milliers de vies...', views: '9.4M', emoji: '🔍' },
  { id: 43, category: 'Histoire', style: 'facts', hook: '🗽 La vraie histoire de la Statue de la Liberté', script: 'Elle n\'était pas destinée aux États-Unis au départ. Et sa couleur verte est un accident...', views: '7.8M', emoji: '🇫🇷' },
  { id: 44, category: 'Histoire', style: 'storytelling', hook: '🚢 Le Titanic avait reçu 6 avertissements de glaces', script: 'Ils ont tous été ignorés. Voici pourquoi le capitaine a maintenu la vitesse maximale...', views: '11.2M', emoji: '🧊' },
  { id: 45, category: 'Histoire', style: 'facts', hook: '🧱 La Grande Muraille de Chine n\'est pas visible depuis l\'espace', script: 'C\'est un mythe qu\'on t\'a enseigné à l\'école. Voici ce qu\'on peut vraiment voir depuis l\'espace...', views: '5.6M', emoji: '🚀' },
  { id: 46, category: 'Histoire', style: 'storytelling', hook: '💀 L\'homme qui a survécu à 2 bombes atomiques', script: 'Tsutomu Yamaguchi était à Hiroshima puis à Nagasaki. Il a vécu jusqu\'à 93 ans...', views: '14.3M', emoji: '☢️' },

  // SPORT
  { id: 47, category: 'Sport', style: 'facts', hook: '⚽ Pourquoi Ronaldo dort 5 fois par jour', script: 'Son programme de sommeil est scientifiquement optimisé. Voici comment il récupère 3x plus vite...', views: '8.9M', emoji: '😴' },
  { id: 48, category: 'Sport', style: 'tutorial', hook: '🏋️ Le seul exercice que tu dois faire chaque jour', script: 'Pas les pompes, pas les abdos. Cet exercice de 10 min change tout en 30 jours...', views: '4.3M', emoji: '💪' },
  { id: 49, category: 'Sport', style: 'facts', hook: '🏊 Michael Phelps a des superpouvoirs génétiques', script: 'Ses poumons sont 3x plus grands que la normale. Son corps produit moins d\'acide lactique...', views: '6.7M', emoji: '🥇' },
  { id: 50, category: 'Sport', style: 'motivation', hook: '🎯 Kobe Bryant s\'entraînait à 4h du matin', script: 'Il arrivait quand les autres dormaient encore. Voici sa philosophie de la "Mamba Mentality"...', views: '12.1M', emoji: '🏀' },
  { id: 51, category: 'Sport', style: 'tutorial', hook: '🏃 Cours plus vite avec cette technique simple', script: 'Les pros font ça naturellement. Tu peux l\'apprendre en 10 minutes. Voici comment...', views: '2.9M', emoji: '⚡' },
  { id: 52, category: 'Sport', style: 'facts', hook: '🥊 Pourquoi les boxeurs coupent leur poids', script: 'C\'est légal mais dangereux. Voici comment ils perdent 10kg en 24h et les risques...', views: '5.4M', emoji: '⚖️' },

  // SANTÉ
  { id: 53, category: 'Santé', style: 'facts', hook: '🧠 Tu utilises 100% de ton cerveau (pas 10%)', script: 'Ce mythe vient d\'une mauvaise interprétation scientifique. Voici comment fonctionne vraiment ton cerveau...', views: '7.2M', emoji: '🔬' },
  { id: 54, category: 'Santé', style: 'tutorial', hook: '😴 Le protocole sommeil qui double ton énergie', script: 'Heure de coucher, température, lumière bleue. Ces 3 changements transforment ton sommeil...', views: '5.8M', emoji: '🌙' },
  { id: 55, category: 'Santé', style: 'facts', hook: '🍎 L\'aliment le plus sain au monde selon la science', script: 'Ce n\'est pas la pomme. C\'est accessible, pas cher et tu l\'ignores probablement...', views: '9.6M', emoji: '🥗' },
  { id: 56, category: 'Santé', style: 'tutorial', hook: '💊 L\'eau froide le matin change tout', script: '2 minutes de douche froide modifient ta chimie cérébrale. Voici les effets prouvés...', views: '6.3M', emoji: '🚿' },
  { id: 57, category: 'Santé', style: 'facts', hook: '🫁 Tu respires mal et ça détruit ta santé', script: 'La plupart respirent par la bouche. Voici pourquoi le nez est crucial et comment changer...', views: '4.1M', emoji: '💨' },
  { id: 58, category: 'Santé', style: 'tutorial', hook: '🧘 5 min de méditation = 2h de sommeil en plus', script: 'La science confirme ce que les moines savent depuis 2000 ans. Voici la technique exacte...', views: '3.7M', emoji: '☯️' },
  { id: 59, category: 'Santé', style: 'facts', hook: '🦷 Pourquoi tu dois te brosser les dents AVANT le café', script: 'Le café après le brossage protège l\'émail. Voici l\'ordre exact de ta routine matin...', views: '8.4M', emoji: '☕' },

  // LIFESTYLE
  { id: 60, category: 'Lifestyle', style: 'tutorial', hook: '✈️ Voyage business class pour le prix de l\'économique', script: 'Les miles et les programmes de fidélité ont des failles. Voici comment upgrader gratuitement...', views: '4.6M', emoji: '🛫' },
  { id: 61, category: 'Lifestyle', style: 'faceless', hook: '🏡 Le nomadisme digital expliqué en 60 secondes', script: 'Travailler depuis Bali, Lisbonne ou Montréal. Voici ce qu\'on ne te dit pas sur cette vie...', views: '5.3M', emoji: '🌍' },
  { id: 62, category: 'Lifestyle', style: 'tutorial', hook: '📚 Lis 52 livres par an avec cette méthode', script: '1 livre par semaine en lisant seulement 20 minutes par jour. La technique exacte...', views: '3.8M', emoji: '📖' },
  { id: 63, category: 'Lifestyle', style: 'ranking', hook: '🌏 Top 5 pays où vivre avec 1500€/mois comme un roi', script: 'Pas le Portugal. Ces 5 pays ont un coût de vie incroyable et une qualité de vie exceptionnelle...', views: '6.9M', emoji: '👑' },
  { id: 64, category: 'Lifestyle', style: 'tutorial', hook: '🛋️ Décore ton appartement style luxe pour 200€', script: 'Les secrets des designers d\'intérieur que tu peux appliquer ce weekend. Avant/après...', views: '2.4M', emoji: '🎨' },
  { id: 65, category: 'Lifestyle', style: 'storytelling', hook: '🚗 J\'ai vendu ma voiture et économisé 8000€/an', script: 'Vélo + transports + location occasionnelle. Le calcul exact qui m\'a convaincu de changer...', views: '3.1M', emoji: '🚲' },

  // BONUS rounds
  { id: 66, category: 'IA', style: 'tutorial', hook: '🎙️ Clone ta voix avec l\'IA en 30 secondes', script: 'ElevenLabs te permet de créer une voix off parfaite. Voici le workflow complet...', views: '7.4M', emoji: '🔊' },
  { id: 67, category: 'Business', style: 'tutorial', hook: '📲 0 à 10K abonnés TikTok en 30 jours', script: 'La stratégie de contenu que j\'ai utilisée. Posting schedule, hooks, et trending sounds...', views: '5.7M', emoji: '📈' },
  { id: 68, category: 'Argent', style: 'facts', hook: '💎 Le Bitcoin à 0€ ou à 1 million ? La réponse', script: 'Les 2 scénarios possibles selon les experts. Voici les signaux à surveiller...', views: '6.2M', emoji: '₿' },
  { id: 69, category: 'Motivation', style: 'motivation', hook: '🎓 Arrête d\'attendre d\'être prêt', script: 'Tu ne seras jamais prêt. C\'est une illusion. Voici pourquoi commencer imparfait est la clé...', views: '4.8M', emoji: '🚀' },
  { id: 70, category: 'Facts', style: 'facts', hook: '🦈 Les requins existent depuis avant les arbres', script: 'Les requins ont 450 millions d\'années. Les arbres seulement 350 millions. Mind blown...', views: '19.2M', emoji: '🌳' },
  { id: 71, category: 'Histoire', style: 'storytelling', hook: '🔐 Le code secret qui a sauvé l\'Angleterre', script: 'Alan Turing et Enigma. Comment un mathématicien a raccourci la guerre de 2 ans...', views: '8.3M', emoji: '💻' },
  { id: 72, category: 'Sport', style: 'facts', hook: '🎾 Pourquoi Djokovic ne mange pas de gluten', script: 'Son régime alimentaire ultra strict. Voici comment la nourriture a transformé sa carrière...', views: '5.1M', emoji: '🥦' },
  { id: 73, category: 'Santé', style: 'tutorial', hook: '🍵 Le thé qui double la concentration', script: 'La L-théanine + caféine = combo parfait. Voici les quantités exactes et quand le prendre...', views: '4.4M', emoji: '🧠' },
  { id: 74, category: 'Business', style: 'storytelling', hook: '💡 L\'idée à 1M€ que tout le monde avait', script: 'Airbnb, Uber, Instagram. Ces idées semblaient stupides au départ. Voici leur première version...', views: '7.9M', emoji: '💭' },
  { id: 75, category: 'IA', style: 'faceless', hook: '🤖 L\'IA qui prédit ta mort avec 90% de précision', script: 'Des chercheurs danois ont créé Life2vec. Voici comment elle fonctionne et les implications...', views: '14.7M', emoji: '⏳' },
  { id: 76, category: 'Argent', style: 'tutorial', hook: '🏠 Achète ton premier immeuble sans apport', script: 'La stratégie BRRRR que les investisseurs immobiliers utilisent. Voici comment démarrer...', views: '3.2M', emoji: '🏗️' },
  { id: 77, category: 'Lifestyle', style: 'ranking', hook: '⌚ Les 5 montres qui gardent leur valeur', script: 'Rolex Submariner, Patek Philippe... Ces montres sont de meilleures investissements que l\'or...', views: '4.6M', emoji: '💰' },
  { id: 78, category: 'Motivation', style: 'storytelling', hook: '🎤 Steve Jobs était un génie ou un voleur ?', script: 'Il a piqué l\'interface graphique à Xerox. Et le MP3 player existait avant l\'iPod...', views: '6.8M', emoji: '🍎' },
  { id: 79, category: 'Facts', style: 'facts', hook: '🌡️ La température de l\'espace est -270°C', script: 'Mais les astronautes ont chaud dans leur combinaison. Voici pourquoi le vide ne refroidit pas...', views: '7.3M', emoji: '🌌' },
  { id: 80, category: 'Business', style: 'tutorial', hook: '📊 Analyse tes concurrents en 10 minutes', script: 'Ces outils gratuits te donnent toutes leurs données. Trafic, mots-clés, backlinks...', views: '2.1M', emoji: '🔍' },
  { id: 81, category: 'IA', style: 'tutorial', hook: '✍️ Écris comme un pro avec ces prompts IA', script: 'Copywriting, storytelling, emails. Ces 5 prompts remplacent un copywriter à 5000€/mois...', views: '5.4M', emoji: '📝' },
  { id: 82, category: 'Santé', style: 'facts', hook: '😊 L\'exercice est plus efficace que les antidépresseurs', script: 'Une étude de Duke University le prouve. 30 min de cardio 3 fois/semaine suffit...', views: '9.7M', emoji: '🏃' },
  { id: 83, category: 'Argent', style: 'faceless', hook: '💳 Hack les points de carte bancaire légalement', script: 'Tu laisses des milliers d\'euros en cashback dormir. Voici les meilleures cartes et stratégies...', views: '3.8M', emoji: '🎁' },
  { id: 84, category: 'Histoire', style: 'facts', hook: '🍕 La pizza Margherita a été créée pour une reine', script: 'En 1889 à Naples, le pizzaiolo Raffaele Esposito... Les couleurs = le drapeau italien...', views: '5.2M', emoji: '👑' },
  { id: 85, category: 'Sport', style: 'motivation', hook: '🏊 David Goggins a couru 160km avec des os cassés', script: 'SEAL, ultra-marathonien, auteur. Voici sa philosophie de la souffrance comme outil...', views: '10.3M', emoji: '🔥' },
  { id: 86, category: 'Lifestyle', style: 'tutorial', hook: '☕ Prépare un café 5 étoiles chez toi pour 0,50€', script: 'Le barista de chez Blue Bottle m\'a montré ses secrets. Température, mouture, timing...', views: '3.4M', emoji: '☕' },
  { id: 87, category: 'Business', style: 'facts', hook: '🎮 Twitch paye mieux que la plupart des jobs', script: 'Ces streamers gagnent 100K€/mois. Voici la stratégie pour atteindre 1000 abonnés payants...', views: '4.1M', emoji: '🎮' },
  { id: 88, category: 'IA', style: 'ranking', hook: '🤖 Top 5 IA pour créer du contenu en 2025', script: 'ChatGPT, Claude, Gemini... Voici lequel est le meilleur pour chaque cas d\'usage...', views: '6.3M', emoji: '⚡' },
  { id: 89, category: 'Motivation', style: 'faceless', hook: '📱 Supprime Instagram 30 jours. Voici ce qui change', script: 'Mon expérience de digital detox. Productivité, sommeil, relations. Les données réelles...', views: '5.7M', emoji: '🔕' },
  { id: 90, category: 'Facts', style: 'facts', hook: '🐘 Les éléphants sont les seuls animaux qui pleurent leurs morts', script: 'Ils reviennent sur les squelettes de leurs proches. Et se souviennent de chaque éléphanteau...', views: '13.4M', emoji: '💧' },
  { id: 91, category: 'Argent', style: 'tutorial', hook: '📈 ETF S&P500 : tout ce que tu dois savoir', script: 'L\'investissement le plus simple qui bat 90% des gérants. Voici comment démarrer avec 50€...', views: '4.9M', emoji: '💹' },
  { id: 92, category: 'Business', style: 'storytelling', hook: '🍔 Comment McDonald\'s gagne de l\'argent (pas avec les burgers)', script: 'McDonald\'s est en réalité une entreprise immobilière. Voici leur vrai business model...', views: '8.6M', emoji: '🏢' },
  { id: 93, category: 'Santé', style: 'tutorial', hook: '🥶 La méthode Wim Hof expliquée en 60 secondes', script: 'Hyperventilation + rétention + froid. Voici le protocole exact et les bénéfices prouvés...', views: '6.1M', emoji: '❄️' },
  { id: 94, category: 'Histoire', style: 'storytelling', hook: '🚀 La vraie histoire de la course à la lune', script: 'La NASA employait des mathématiciennes noires. Sans elles, Apollo 11 ne décolle jamais...', views: '9.8M', emoji: '🌙' },
  { id: 95, category: 'IA', style: 'tutorial', hook: '🎵 Crée une chanson avec l\'IA en 5 minutes', script: 'Suno AI génère des chansons professionnelles. Voici le prompt pour une chanson virale...', views: '7.2M', emoji: '🎶' },
  { id: 96, category: 'Sport', style: 'facts', hook: '⚽ Le secret de la frappe de Messi révélé', script: 'Biomécanique, centre de gravité, placement du pied. Les ingénieurs ont tout analysé...', views: '11.4M', emoji: '🦵' },
  { id: 97, category: 'Lifestyle', style: 'tutorial', hook: '🌿 Minimalisme : vendre 90% de ses affaires', script: 'J\'ai vendu 200 objets sur Vinted et eBay. Voici ce que ça m\'a rapporté et libéré...', views: '4.3M', emoji: '🏠' },
  { id: 98, category: 'Argent', style: 'storytelling', hook: '🎰 Pourquoi les casinos gagnent toujours', script: 'L\'avantage mathématique de la maison. Et pourquoi même les meilleurs joueurs perdent...', views: '7.8M', emoji: '🃏' },
  { id: 99, category: 'Facts', style: 'facts', hook: '🌊 Il y a plus d\'étoiles que de grains de sable', script: '10^24 étoiles dans l\'univers observable. Et on n\'a exploré que 5% de nos océans...', views: '16.7M', emoji: '⭐' },
  { id: 100, category: 'Business', style: 'tutorial', hook: '🚀 Lance un SaaS en 30 jours avec l\'IA', script: 'Idée, validation, développement no-code, lancement. Le playbook complet que j\'ai suivi...', views: '5.5M', emoji: '💻' },
]

function formatViews(views) {
  return views
}

export default function ExamplesGallery({ onCTAClick }) {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef(null)

  const filtered = activeCategory === 'Tous'
    ? EXAMPLES
    : EXAMPLES.filter(e => e.category === activeCategory)

  const style = (s) => STYLES[s] || STYLES.faceless

  const CARDS_VISIBLE = 3
  const maxIndex = Math.max(0, filtered.length - CARDS_VISIBLE)

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1))
  const next = () => setCurrentIndex(i => Math.min(maxIndex, i + 1))

  // Reset index on category change
  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setCurrentIndex(0)
  }

  const visibleCards = filtered.slice(currentIndex, currentIndex + CARDS_VISIBLE)

  return (
    <section className="py-16 px-4 relative overflow-hidden">

      {/* Section header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border"
             style={{ borderColor: 'rgba(255,45,85,0.3)', background: 'rgba(255,45,85,0.08)', color: '#FF2D55' }}>
          🎬 100+ exemples
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
          Exemples de vidéos que tu peux créer
        </h2>
        <p className="text-white/50 text-base">
          Inspire-toi de ces idées et génère les tiennes en 1 clic
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 max-w-3xl mx-auto"
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => handleCategory(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? '#FF2D55' : 'rgba(255,255,255,0.05)',
                    color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative max-w-3xl mx-auto">

        {/* Flèche gauche */}
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="absolute -left-5 sm:-left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-4">
          {visibleCards.map((example) => {
            const s = style(example.style)
            return (
              <div key={example.id}
                   className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
                   style={{
                     background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                     border: '1px solid rgba(255,255,255,0.06)',
                     aspectRatio: '9/16',
                   }}>

                {/* Gradient background */}
                <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
                     style={{ background: `radial-gradient(circle at top, ${s.color}, transparent 70%)` }} />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-3">

                  {/* Top */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}>
                      {s.label}
                    </span>
                    <span className="text-white/30 text-xs">#{currentIndex + visibleCards.indexOf(example) + 1}</span>
                  </div>

                  {/* Middle - emoji */}
                  <div className="flex items-center justify-center flex-1">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {example.emoji}
                    </span>
                  </div>

                  {/* Bottom */}
                  <div>
                    <p className="text-white text-xs font-bold leading-tight mb-1.5 line-clamp-2">
                      {example.hook}
                    </p>
                    <p className="text-white/40 text-xs leading-snug line-clamp-2 mb-2">
                      {example.script}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs">👁 {example.views}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                        #{example.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                     style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                  <button onClick={onCTAClick}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
                    Générer ça ⚡
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Flèche droite */}
        <button
          onClick={next}
          disabled={currentIndex >= maxIndex}
          className="absolute -right-5 sm:-right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mt-6 mb-8">
        {Array.from({ length: Math.ceil(filtered.length / CARDS_VISIBLE) }).map((_, i) => (
          <button key={i}
                  onClick={() => setCurrentIndex(Math.min(i * CARDS_VISIBLE, maxIndex))}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: Math.floor(currentIndex / CARDS_VISIBLE) === i ? '20px' : '6px',
                    height: '6px',
                    background: Math.floor(currentIndex / CARDS_VISIBLE) === i ? '#FF2D55' : 'rgba(255,255,255,0.15)',
                  }} />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center mb-6">
        <p className="text-white/30 text-xs">
          {currentIndex + 1}–{Math.min(currentIndex + CARDS_VISIBLE, filtered.length)} sur {filtered.length} exemples
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button onClick={onCTAClick}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FF2D55, #c0392b)',
                  boxShadow: '0 0 40px rgba(255,45,85,0.4)',
                }}>
          ⚡ Générer ma vidéo gratuitement
        </button>
        <p className="text-white/20 text-xs mt-3">Sans carte bancaire • 1 génération gratuite</p>
      </div>
    </section>
  )
}

