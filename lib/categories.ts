export const categories = [
  'Mimari ve Tarihi Yapılar',
  'Arkeolojik Alan ve Antik Şehirler',
  'Sözlü Kültür, Destan ve Efsaneler',
  'Geleneksel El Sanatları ve Zanaatlar',
  'Müzik, Gösteri ve Sahne Sanatları',
  'Mutfak Kültürü ve Gastronomi',
  'Gelenekler, Görenekler ve Törenler',
  'Doğal ve Kültürel Peyzajlar',
  'Yazılı Eserler ve Minyatürler',
] as const

const legacyCategoryMap: Record<string, string> = {
  'mimari eser': 'Mimari ve Tarihi Yapılar',
  'eski eserler ve mimari': 'Mimari ve Tarihi Yapılar',
  'arkeolojik alan': 'Arkeolojik Alan ve Antik Şehirler',
  'antik şehir': 'Arkeolojik Alan ve Antik Şehirler',
  'sözlü kültür': 'Sözlü Kültür, Destan ve Efsaneler',
}

export function normalizeCategory(category: string | null | undefined) {
  const value = category?.trim()

  if (!value) {
    return ''
  }

  return legacyCategoryMap[value.toLocaleLowerCase('tr-TR')] ?? value
}

export function getSectionTitle(category: string | null | undefined) {
  const normalizedCategory = normalizeCategory(category)

  switch (normalizedCategory) {
    case 'Mimari ve Tarihi Yapılar':
      return 'Mimari Özellikler / Öne Çıkan Detaylar'
    case 'Arkeolojik Alan ve Antik Şehirler':
      return 'Arkeolojik Bulgular / Tarihsel Önem'
    case 'Sözlü Kültür, Destan ve Efsaneler':
      return 'Eser Özellikleri / Analiz'
    case 'Geleneksel El Sanatları ve Zanaatlar':
      return 'Yapım Tekniği / Malzeme'
    case 'Müzik, Gösteri ve Sahne Sanatları':
      return 'İcra Biçimi / Kültürel Bağlam'
    case 'Mutfak Kültürü ve Gastronomi':
      return 'Tarif / Kültürel Önem'
    case 'Gelenekler, Görenekler ve Törenler':
      return 'Geleneksel Uygulamalar / Kültürel Önem'
    case 'Doğal ve Kültürel Peyzajlar':
      return 'Doğal Özellikler / Kültürel Değer'
    case 'Yazılı Eserler ve Minyatürler':
      return 'İçerik / Tarihsel Önem'
    default:
      return getLegacySectionTitle(normalizedCategory)
  }
}

function getLegacySectionTitle(category: string | null | undefined) {
  const normalizedCategory = (category ?? '').toLocaleLowerCase('tr-TR')

  if (normalizedCategory.includes('mimari') || normalizedCategory.includes('antik') || normalizedCategory.includes('arkeolojik')) {
    return 'Mimari / Özellikler'
  }
  if (normalizedCategory.includes('şiir') || normalizedCategory.includes('koşuk') || normalizedCategory.includes('destan') || normalizedCategory.includes('efsane')) {
    return 'Eser Özellikleri / Analiz'
  }
  if (normalizedCategory.includes('gelenek') || normalizedCategory.includes('yaşam')) {
    return 'Geleneksel Özellikler'
  }
  return 'Öne Çıkan Özellikler'
}
