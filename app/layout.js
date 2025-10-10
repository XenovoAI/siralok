import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata = {
  title: 'SIR CBSE - JEE and NEET Preparation Platform',
  description: 'Comprehensive JEE and NEET preparation with study materials, live tests, and expert guidance',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}