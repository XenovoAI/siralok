'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      setUser(session?.user || null)
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-gray-900">SIR</span>
              <span className="text-sky-600">CBSE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-sky-600 transition">Home</Link>
            <Link href="/materials" className="text-gray-700 hover:text-sky-600 transition">Study Materials</Link>
            <Link href="/tests" className="text-gray-700 hover:text-sky-600 transition">Tests</Link>
            <Link href="/about" className="text-gray-700 hover:text-sky-600 transition">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-sky-600 transition">Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.user_metadata?.name || user.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
                {user.user_metadata?.role === 'admin' && (
                  <Link href="/admin">
                    <Button className="bg-sky-600 hover:bg-sky-700">Admin Panel</Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-sky-600 hover:bg-sky-700">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link href="/" className="block text-gray-700 hover:text-sky-600 py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/materials" className="block text-gray-700 hover:text-sky-600 py-2" onClick={() => setMobileMenuOpen(false)}>Study Materials</Link>
            <Link href="/tests" className="block text-gray-700 hover:text-sky-600 py-2" onClick={() => setMobileMenuOpen(false)}>Tests</Link>
            <Link href="/about" className="block text-gray-700 hover:text-sky-600 py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="block text-gray-700 hover:text-sky-600 py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            <div className="border-t pt-4">
              {loading ? (
                <div className="w-full h-10 animate-pulse bg-gray-200 rounded"></div>
              ) : user ? (
                <>
                  <div className="mb-3 pb-3 border-b">
                    <span className="block text-sm text-gray-600">
                      Welcome, <span className="font-medium">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">Dashboard</Button>
                    </Link>
                    {user.user_metadata?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-sky-600 hover:bg-sky-700 justify-start">Admin Panel</Button>
                      </Link>
                    )}
                    <Button 
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }} 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-sky-600 hover:bg-sky-700">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}