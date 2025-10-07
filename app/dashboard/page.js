'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Clock, Award, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [testAttempts, setTestAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to view dashboard')
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        fetchTestAttempts(token)
      } else {
        localStorage.removeItem('token')
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/login')
    }
  }

  const fetchTestAttempts = async (token) => {
    try {
      const response = await fetch('/api/test-attempts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestAttempts(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching test attempts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    if (testAttempts.length === 0) return { avg: 0, total: 0, best: 0 }
    
    const scores = testAttempts.map(a => a.score)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const best = Math.max(...scores)
    
    return {
      avg: Math.round(avg * 100) / 100,
      total: testAttempts.length,
      best: Math.round(best * 100) / 100
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-orange-600">{user?.name}</span>!
          </h1>
          <p className="text-gray-600">Track your progress and continue your preparation</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Attempted</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total tests completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avg}%</div>
              <p className="text-xs text-muted-foreground">Across all tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.best}%</div>
              <p className="text-xs text-muted-foreground">Personal best</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Attempts</CardTitle>
            <CardDescription>Your latest test performances</CardDescription>
          </CardHeader>
          <CardContent>
            {testAttempts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't taken any tests yet</p>
                <a href="/tests" className="text-orange-600 hover:underline">
                  Browse available tests →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {testAttempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Test ID: {attempt.testId}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(attempt.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">{attempt.score}%</p>
                      <p className="text-sm text-gray-600">
                        {attempt.correctAnswers}/{attempt.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}