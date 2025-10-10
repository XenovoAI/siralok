'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Award, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TestsPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have cached tests
    const cachedTests = localStorage.getItem('tests')
    if (cachedTests) {
      try {
        const parsed = JSON.parse(cachedTests)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTests(parsed)
        }
      } catch (e) {
        console.error('Error parsing cached tests:', e)
      }
    }
    
    // Fetch fresh data in background
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests', {
        headers: { 'Cache-Control': 'max-age=300' }
      })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setTests(data)
          localStorage.setItem('tests', JSON.stringify(data))
        }
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
    }
  }

  const handleStartTest = (testId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to take tests')
      router.push('/login')
      return
    }
    router.push(`/tests/${testId}`)
  }

  const renderTestCards = (category) => {
    const filteredTests = tests.filter(t => t.category === category)
    
    if (filteredTests.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No tests available in this category yet.</p>
          </CardContent>
        </Card>
      )
    }

    return filteredTests.map((test) => (
      <Card key={test.id} className="hover:shadow-lg transition">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{test.name}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {test.difficulty}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {test.duration} min
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2" />
              {test.questions?.length || 0} questions
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleStartTest(test.id)} className="w-full bg-sky-600 hover:bg-sky-700">
            <Play className="w-4 h-4 mr-2" />
            Start Test
          </Button>
        </CardFooter>
      </Card>
    ))
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Live <span className="text-sky-600">Test Series</span>
            </h1>
            <p className="text-xl text-gray-600">
              Practice with real-time tests and track your progress
            </p>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading tests...</p>
            </div>
          ) : (
            <Tabs defaultValue="sectional" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="sectional">Sectional Tests</TabsTrigger>
                <TabsTrigger value="full-length">Full-Length Tests</TabsTrigger>
                <TabsTrigger value="previous-year">Previous Year Papers</TabsTrigger>
              </TabsList>

              <TabsContent value="sectional" className="space-y-4">
                {renderTestCards('sectional')}
              </TabsContent>

              <TabsContent value="full-length" className="space-y-4">
                {renderTestCards('full-length')}
              </TabsContent>

              <TabsContent value="previous-year" className="space-y-4">
                {renderTestCards('previous-year')}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}