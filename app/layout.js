import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import Script from 'next/script'

export const metadata = {
  title: 'SIRCBSE - Best NEET & JEE Preparation Platform | Question Banks & Study Materials',
  description: 'Ace NEET & JEE with SIRCBSE\'s affordable question banks, study materials, and practice tests. Made by MBBS students. Class 11, 12 & Droppers PDFs starting at ₹29.',
  keywords: 'NEET preparation, JEE preparation, biology question bank, physics questions, chemistry questions, study materials, mock tests, NEET 2026, JEE 2026',
  authors: [{ name: 'Alok Kumar' }, { name: 'Harshit Patidar' }],
  creator: 'SIRCBSE',
  publisher: 'SIRCBSE',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.jpg',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/logo.jpg',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.sircbse.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.sircbse.com/',
    title: 'SIRCBSE - Best NEET & JEE Preparation Platform',
    description: 'Ace NEET & JEE with affordable question banks, study materials & practice tests. Made by MBBS students.',
    siteName: 'SIRCBSE',
    images: [
      {
        url: 'https://www.sircbse.com/og-image.jpg',
        width: 512,
        height: 512,
        alt: 'SIRCBSE - NEET & JEE Preparation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIRCBSE - Best NEET & JEE Preparation Platform',
    description: 'Ace NEET & JEE with affordable question banks & study materials.',
    images: ['https://www.sircbse.com/twitter-image.jpg'],
    creator: '@sircbse',
    site: '@sircbse',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'education',
  other: {
    'revisit-after': '7 days',
    language: 'English',
  },
}

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'SIRCBSE',
    description: 'Best NEET & JEE Preparation Platform with affordable question banks and study materials',
    url: 'https://www.sircbse.com',
    logo: 'https://www.sircbse.com/logo.jpg',
    image: 'https://www.sircbse.com/logo.jpg',
    founder: [
      {
        '@type': 'Person',
        name: 'Alok Kumar',
      },
      {
        '@type': 'Person',
        name: 'Harshit Patidar',
      },
    ],
    sameAs: [
      'https://www.facebook.com/sircbse',
      'https://www.instagram.com/sircbse',
      'https://twitter.com/sircbse',
      'https://www.youtube.com/@sircbse',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@sircbse.com',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '29',
      highPrice: '499',
      offerCount: '100',
    },
  }

  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W972CNXL');
          `}
        </Script>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RHQ962WEHV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RHQ962WEHV');
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6482344217580450"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W972CNXL"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
