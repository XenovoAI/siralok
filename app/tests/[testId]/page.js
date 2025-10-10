'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'

export default function TestTakingPage() {
  const [test, setTest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const testId = params.testId

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to take tests')
      router.push('/login')
      return
    }
    fetchTest()
  }, [testId])

  useEffect(() => {
    if (test && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && test) {
      handleSubmit()
    }
  }, [timeRemaining, test])

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}`)
      if (response.ok) {
        const data = await response.json()
        setTest(data)
        setTimeRemaining(data.duration * 60)
      } else {
        toast.error('Test not found')
        router.push('/tests')
      }
    } catch (error) {
      console.error('Error fetching test:', error)
      toast.error('Failed to load test')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    })
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const timeSpent = test.duration * 60 - timeRemaining

    try {
      const response = await fetch('/api/test-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testId: test.id,
          answers,
          timeSpent
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Test submitted! Your score: ${result.score}%`)
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Failed to submit test')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      toast.error('An error occurred while submitting the test')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Test Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{test?.name}</h1>
              <p className="text-gray-600 mt-1">{test?.description}</p>
            </div>
            <div className="flex items-center space-x-2 text-sky-600 font-semibold text-xl">
              <Clock className="w-6 h-6" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {test?.questions && test.questions.length > 0 ? (
            test.questions.map((question, index) => (
              <Card key={question.id} className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  {index + 1}. {question.text}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer border"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        className="w-4 h-4 text-sky-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No questions available for this test.</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {test?.questions && test.questions.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 px-12"
            >
              Submit Test
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}