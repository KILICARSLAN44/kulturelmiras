import type { MetadataRoute } from 'next'

const siteUrl = 'https://www.kulturelmiras.me'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/ekle`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
