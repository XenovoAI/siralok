'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Use Supabase helper to parse the auth result from the URL and store the session.
      try {
        // supabase.auth.getSessionFromUrl reads tokens from the URL (hash or query)
        // and will store the session in local storage if present.
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })

        if (error) {
          console.error('Error getting session from URL:', error)
          toast.error('Failed to complete sign in')
          router.push('/login')
          return
        }

        if (!data?.session) {
          toast.error('No session returned after OAuth')
          router.push('/login')
          return
        }

        toast.success('Logged in successfully!')
        router.push('/dashboard')
      } catch (err) {
        console.error('Error during OAuth callback handling:', err)
        toast.error('Error during login process')
        router.push('/login')
      }
    }

    handleOAuthRedirect()
  }, [router])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>Signing you in...</div>
    </div>
  )
}
