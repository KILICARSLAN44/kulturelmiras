import type { MetadataRoute } from 'next'

const siteUrl = 'https://kulturelmiras.me'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/duzenle/', '/login/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
