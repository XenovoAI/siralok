# SEO Configuration Guide

## Overview
This document outlines all SEO configurations implemented for the SIRCBSE website.

## Meta Tags Implementation

### Location: `/app/app/layout.js`

The following meta tags have been configured:

1. **Basic Meta Tags**
   - Title: SIRCBSE - Best NEET & JEE Preparation Platform | Question Banks & Study Materials
   - Description: Ace NEET & JEE with SIRCBSE's affordable question banks...
   - Keywords: NEET preparation, JEE preparation, biology question bank, etc.
   - Authors: Alok Kumar, Harshit Patidar

2. **Open Graph Meta Tags (Facebook)**
   - og:type: website
   - og:url: https://www.sircbse.com/
   - og:title: SIRCBSE - Best NEET & JEE Preparation Platform
   - og:description: Ace NEET & JEE with affordable question banks...
   - og:image: https://www.sircbse.com/og-image.jpg (1200x630px)

3. **Twitter Card Meta Tags**
   - twitter:card: summary_large_image
   - twitter:title: SIRCBSE - Best NEET & JEE Preparation Platform
   - twitter:description: Ace NEET & JEE with affordable question banks...
   - twitter:image: https://www.sircbse.com/twitter-image.jpg

4. **Robots Meta Tags**
   - index: true
   - follow: true
   - googleBot: max-video-preview, max-image-preview, max-snippet

5. **Canonical URL**
   - https://www.sircbse.com

## Sitemap Configuration

### Location: `/app/app/sitemap.js`

Dynamic sitemap generated with:
- Homepage (Priority: 1.0)
- Materials Page (Priority: 0.9)
- Tests Page (Priority: 0.9)
- Dashboard (Priority: 0.8)
- About, Contact (Priority: 0.7)
- Login, Register (Priority: 0.6)
- Privacy, Terms (Priority: 0.5)

**Access URL:** `https://www.sircbse.com/sitemap.xml`

## Robots.txt Configuration

### Location: `/app/app/robots.js`

Rules configured:
- Allow: All pages for all user agents
- Disallow: /api/, /admin/, /dashboard/
- Sitemap URL: https://www.sircbse.com/sitemap.xml

**Access URL:** `https://www.sircbse.com/robots.txt`

## Structured Data (JSON-LD)

### Location: `/app/app/layout.js`

Schema.org structured data for:
- Organization Type: EducationalOrganization
- Founders: Alok Kumar, Harshit Patidar
- Social Media Links
- Contact Information
- Pricing Information

## Web App Manifest

### Location: `/app/app/manifest.js`

PWA configuration with:
- App name and short name
- Theme color: #0EA5E9 (Sky Blue)
- Icons: 192x192 and 512x512
- Display mode: standalone
- Shortcuts for Materials and Tests pages

**Access URL:** `https://www.sircbse.com/manifest.json`

## Required Assets

Please ensure these assets are available in the `/public` directory:

1. **Open Graph Image**
   - Path: `/public/og-image.jpg`
   - Size: 1200x630 pixels
   - Format: JPG

2. **Twitter Card Image**
   - Path: `/public/twitter-image.jpg`
   - Size: 1200x675 pixels
   - Format: JPG

3. **PWA Icons**
   - `/public/icon-192.png` (192x192)
   - `/public/icon-512.png` (512x512)
   - `/public/icon-materials.png` (96x96)
   - `/public/icon-tests.png` (96x96)

4. **Logo**
   - Path: `/public/logo.png`
   - Format: PNG with transparency

## Google Search Console Setup

To complete the SEO setup:

1. **Verify Ownership**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property: https://www.sircbse.com
   - Update `verification.google` in metadata with your verification code

2. **Submit Sitemap**
   - Submit: https://www.sircbse.com/sitemap.xml

3. **Monitor Performance**
   - Check indexing status
   - Monitor search queries
   - Review page experience

## Social Media Validation

### Facebook/LinkedIn
- Test with: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- URL: https://www.sircbse.com

### Twitter
- Test with: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- URL: https://www.sircbse.com

## Performance Optimization

Current optimizations:
- ✅ Server-side rendering (Next.js)
- ✅ Image optimization (Next.js Image component)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Minification

## Monitoring Tools

Recommended tools to monitor SEO performance:
1. Google Search Console
2. Google Analytics (Already configured)
3. Google Tag Manager (Already configured)
4. PageSpeed Insights
5. Lighthouse (Chrome DevTools)

## Next Steps

1. Create and upload required images (og-image.jpg, twitter-image.jpg, icons)
2. Get Google Search Console verification code
3. Submit sitemap to Google Search Console
4. Set up Google My Business profile
5. Create and submit to other search engines (Bing, Yahoo)

## Social Media Links

Update these URLs in layout.js when social profiles are ready:
- Facebook: https://www.facebook.com/sircbse
- Instagram: https://www.instagram.com/sircbse
- Twitter: https://twitter.com/sircbse
- YouTube: https://www.youtube.com/@sircbse

---

**Last Updated:** October 2025
**Version:** 1.0
