import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import Script from 'next/script'

export const metadata = {
  title: 'SIR CBSE - JEE and NEET Preparation Platform',
  description: 'Comprehensive JEE and NEET preparation with study materials, live tests, and expert guidance',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}