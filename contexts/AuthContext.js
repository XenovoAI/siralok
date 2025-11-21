'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: 'student' // Default role
          }
        }
      })

      if (error) throw error

      if (data.user) {
        toast.success('Account created successfully!')
        return { success: true, user: data.user }
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account')
      return { success: false, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        toast.success('Logged in successfully!')
        return { success: true, user: data.user }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Invalid credentials')
      return { success: false, error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      // OAuth will redirect, so we don't need to handle success here
      return { success: true }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error(error.message || 'Failed to login with Google')
      return { success: false, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      toast.success('Password reset email sent!')
      return { success: true }
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error(error.message || 'Failed to send reset email')
      return { success: false, error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')

      const { error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error

      // Refresh user data
      await checkUser()
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Failed to update profile')
      return { success: false, error }
    }
  }

  const hasActiveSubscription = () => {
    if (!user || !user.user_metadata?.subscription_type) return false
    if (user.user_metadata?.subscription_type === 'free') return false
    if (!user.user_metadata?.subscription_expires) return false
    return new Date(user.user_metadata.subscription_expires) > new Date()
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    hasActiveSubscription,
    isSubscribed: hasActiveSubscription(),
    subscriptionType: user?.user_metadata?.subscription_type || 'free'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
