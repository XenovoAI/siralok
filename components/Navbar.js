'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
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
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline">Logout</Button>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button className="bg-orange-600 hover:bg-orange-700">Admin Panel</Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-orange-600 hover:bg-orange-700">Register</Button>
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
          <div className="md:hidden py-4 space-y-4">
            <Link href="/" className="block text-gray-700">Home</Link>
            <Link href="/materials" className="block text-gray-700">Study Materials</Link>
            <Link href="/tests" className="block text-gray-700">Tests</Link>
            <Link href="/about" className="block text-gray-700">About</Link>
            <Link href="/contact" className="block text-gray-700">Contact</Link>
            {user ? (
              <>
                <span className="block text-sm text-gray-600">Welcome, {user.name}</span>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="w-full">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Register</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}