import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'SIR CBSE - JEE and NEET Preparation Platform',
  description: 'Comprehensive JEE and NEET preparation with study materials, live tests, and expert guidance',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}