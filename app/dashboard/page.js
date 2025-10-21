'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Book, FileText, Clock, Award, TrendingUp, Target } from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error

      if (!session) {
        toast.error('Please login to access dashboard')
        router.push('/login')
        return
      }

      setUser(session.user)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.name || 'Student'}! 👋
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Continue your JEE and NEET preparation journey
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-sky-50 rounded-lg p-4 sm:p-6 text-center">
              <Book className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">4</div>
              <div className="text-xs sm:text-sm text-gray-600">Subjects</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">0</div>
              <div className="text-xs sm:text-sm text-gray-600">Tests Taken</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 text-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">0h</div>
              <div className="text-xs sm:text-sm text-gray-600">Study Time</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 sm:p-6 text-center">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">0%</div>
              <div className="text-xs sm:text-sm text-gray-600">Avg Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
            
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Study Materials Card */}
              <Link href="/materials">
                <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-6 sm:p-8 text-white hover:shadow-xl transition cursor-pointer">
                  <Book className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Study Materials</h3>
                  <p className="mb-3 sm:mb-4 text-sm sm:text-base">Access comprehensive notes and resources for all subjects</p>
                  <Button variant="secondary" className="bg-white text-sky-600 hover:bg-gray-100 w-full sm:w-auto">
                    Browse Materials →
                  </Button>
                </div>
              </Link>

              {/* Practice Tests Card */}
              <Link href="/tests">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 sm:p-8 text-white hover:shadow-xl transition cursor-pointer">
                  <Target className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Practice Tests</h3>
                  <p className="mb-3 sm:mb-4 text-sm sm:text-base">Take mock tests and improve your exam performance</p>
                  <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 w-full sm:w-auto">
                    Start Testing →
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Activity</h2>
            
            <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
              <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 mb-3 sm:mb-4">No recent activity yet</p>
              <p className="text-xs sm:text-sm text-gray-500">
                Start taking tests or accessing study materials to see your progress here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Profile Info */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.user_metadata?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Role</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{user?.user_metadata?.role || 'Student'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Status</p>
                  <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
