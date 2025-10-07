'use client'

import { useState, useEffect } from 'react'
import { Book, Beaker, Microscope, Calculator, Video, BarChart, Smartphone, Users, Clock, Award, ChevronRight, Menu, X, Play, Download, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [user, setUser] = useState(null)
  const [tests, setTests] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [testAnswers, setTestAnswers] = useState({})
  const [testTimer, setTestTimer] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Check for existing auth token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCurrentUser(token)
    }
    
    // Initialize subjects
    initializeSubjects()
    fetchTests()
  }, [])

  // Timer effect
  useEffect(() => {
    if (selectedTest && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && selectedTest) {
      // Auto-submit when time runs out
      handleSubmitTest()
    }
  }, [timeRemaining, selectedTest])

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const initializeSubjects = async () => {
    try {
      // Check if subjects exist
      const response = await fetch('/api/subjects')
      
      if (!response.ok) {
        throw new Error('Failed to fetch subjects')
      }
      
      const existingSubjects = await response.json()
      
      // Ensure we have an array
      if (Array.isArray(existingSubjects) && existingSubjects.length > 0) {
        setSubjects(existingSubjects)
      } else {
        // Initialize default subjects if none exist
        const defaultSubjects = [
          {
            name: 'Physics',
            description: 'Comprehensive physics notes and problem-solving techniques',
            icon: 'atom',
            chapters: 25
          },
          {
            name: 'Chemistry',
            description: 'Organic, Inorganic, and Physical chemistry concepts',
            icon: 'flask',
            chapters: 28
          },
          {
            name: 'Biology',
            description: 'Botany and Zoology for NEET preparation',
            icon: 'microscope',
            chapters: 38
          },
          {
            name: 'Mathematics',
            description: 'Advanced mathematics for JEE preparation',
            icon: 'calculator',
            chapters: 22
          }
        ]
        
        setSubjects(defaultSubjects)
      }
    } catch (error) {
      console.error('Error initializing subjects:', error)
      // Set default subjects on error
      const defaultSubjects = [
        {
          name: 'Physics',
          description: 'Comprehensive physics notes and problem-solving techniques',
          icon: 'atom',
          chapters: 25
        },
        {
          name: 'Chemistry',
          description: 'Organic, Inorganic, and Physical chemistry concepts',
          icon: 'flask',
          chapters: 28
        },
        {
          name: 'Biology',
          description: 'Botany and Zoology for NEET preparation',
          icon: 'microscope',
          chapters: 38
        },
        {
          name: 'Mathematics',
          description: 'Advanced mathematics for JEE preparation',
          icon: 'calculator',
          chapters: 22
        }
      ]
      setSubjects(defaultSubjects)
    }
  }

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests')
      if (response.ok) {
        const data = await response.json()
        setTests(data)
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('token', result.token)
        setUser(result.user)
        setShowAuthDialog(false)
        toast.success(authMode === 'login' ? 'Logged in successfully!' : 'Registration successful!')
      } else {
        toast.error(result.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const handleStartTest = async (test) => {
    if (!user) {
      toast.error('Please login to take tests')
      setShowAuthDialog(true)
      return
    }

    setSelectedTest(test)
    setTestAnswers({})
    setTimeRemaining(test.duration * 60) // Convert minutes to seconds
    setShowTestDialog(true)
  }

  const handleAnswerChange = (questionId, answer) => {
    setTestAnswers({
      ...testAnswers,
      [questionId]: answer
    })
  }

  const handleSubmitTest = async () => {
    if (!selectedTest) return

    try {
      const token = localStorage.getItem('token')
      const timeSpent = (selectedTest.duration * 60) - timeRemaining
      
      const response = await fetch('/api/test-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testId: selectedTest.id,
          answers: testAnswers,
          timeSpent
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Test submitted! Your score: ${result.score}%`)
        setShowTestDialog(false)
        setSelectedTest(null)
        setTestAnswers({})
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

  const getSubjectIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'physics': return <Book className="w-8 h-8" />
      case 'chemistry': return <Beaker className="w-8 h-8" />
      case 'biology': return <Microscope className="w-8 h-8" />
      case 'mathematics': return <Calculator className="w-8 h-8" />
      default: return <Book className="w-8 h-8" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">SIR</span>
                <span className="text-orange-600">CBSE</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-orange-600 transition">Home</a>
              <a href="#materials" className="text-gray-700 hover:text-orange-600 transition">Study Materials</a>
              <a href="#tests" className="text-gray-700 hover:text-orange-600 transition">Tests</a>
              <a href="#about" className="text-gray-700 hover:text-orange-600 transition">About</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition">Contact</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  <Button onClick={handleLogout} variant="outline">Logout</Button>
                  {user.role === 'admin' && (
                    <Button variant="default" className="bg-orange-600 hover:bg-orange-700">Admin Panel</Button>
                  )}
                </div>
              ) : (
                <>
                  <Button onClick={() => { setAuthMode('login'); setShowAuthDialog(true); }} variant="outline">
                    Login
                  </Button>
                  <Button onClick={() => { setAuthMode('register'); setShowAuthDialog(true); }} className="bg-orange-600 hover:bg-orange-700">
                    Register
                  </Button>
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
              <a href="#home" className="block text-gray-700">Home</a>
              <a href="#materials" className="block text-gray-700">Study Materials</a>
              <a href="#tests" className="block text-gray-700">Tests</a>
              <a href="#about" className="block text-gray-700">About</a>
              <a href="#contact" className="block text-gray-700">Contact</a>
              {user ? (
                <>
                  <span className="block text-sm text-gray-600">Welcome, {user.name}</span>
                  <Button onClick={handleLogout} variant="outline" className="w-full">Logout</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => { setAuthMode('login'); setShowAuthDialog(true); }} variant="outline" className="w-full">
                    Login
                  </Button>
                  <Button onClick={() => { setAuthMode('register'); setShowAuthDialog(true); }} className="w-full bg-orange-600 hover:bg-orange-700">
                    Register
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Ace Your <span className="text-orange-600">JEE and NEET</span> Exam with Expert Study Materials
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access comprehensive JEE and NEET preparation materials and practice tests. Prepare effectively and boost your confidence for the exam.
            </p>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg">
              <a href="#materials">Explore Study Materials</a>
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Study Materials Section */}
      <section id="materials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Study Materials</h2>
            <p className="text-xl text-gray-600">Master every subject with our expertly curated content</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(subjects) && subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <Card key={index} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                      {getSubjectIcon(subject.name)}
                    </div>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{subject.chapters} Chapters</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Access Materials
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Loading subjects...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Test Series Section */}
      <section id="tests" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live Test Series & Mock Exams</h2>
            <p className="text-xl text-gray-600">Practice with real-time tests and track your progress</p>
          </div>

          <Tabs defaultValue="sectional" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sectional">Sectional Tests</TabsTrigger>
              <TabsTrigger value="full-length">Full-Length Tests</TabsTrigger>
              <TabsTrigger value="previous-year">Previous Year Papers</TabsTrigger>
            </TabsList>

            <TabsContent value="sectional" className="space-y-4 mt-6">
              {tests.filter(t => t.category === 'sectional').length > 0 ? (
                tests.filter(t => t.category === 'sectional').map((test) => (
                  <Card key={test.id}>
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
                      <Button onClick={() => handleStartTest(test)} className="w-full bg-orange-600 hover:bg-orange-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Test
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600">No sectional tests available yet. Check back soon!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="full-length" className="space-y-4 mt-6">
              {tests.filter(t => t.category === 'full-length').length > 0 ? (
                tests.filter(t => t.category === 'full-length').map((test) => (
                  <Card key={test.id}>
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
                      <Button onClick={() => handleStartTest(test)} className="w-full bg-orange-600 hover:bg-orange-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Test
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600">No full-length tests available yet. Check back soon!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="previous-year" className="space-y-4 mt-6">
              {tests.filter(t => t.category === 'previous-year').length > 0 ? (
                tests.filter(t => t.category === 'previous-year').map((test) => (
                  <Card key={test.id}>
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
                      <Button onClick={() => handleStartTest(test)} className="w-full bg-orange-600 hover:bg-orange-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Test
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600">No previous year papers available yet. Check back soon!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SIR CBSE?</h2>
            <p className="text-xl text-gray-600">Everything you need for JEE and NEET success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Notes</h3>
              <p className="text-gray-600">Detailed notes covering entire syllabus</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Solutions</h3>
              <p className="text-gray-600">Step-by-step video explanations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Track your progress with detailed insights</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Study anywhere, anytime on any device</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600">Learn from experienced educators</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Students Nationwide</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">50,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
              <p className="text-gray-600">Practice Tests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-white">SIR</span>
                <span className="text-orange-600">CBSE</span>
              </h3>
              <p className="text-gray-400">Your partner in JEE and NEET success</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-orange-600">About Us</a></li>
                <li><a href="#" className="hover:text-orange-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-600">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@sircbse.com</li>
                <li>Phone: +91 1234567890</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <Input placeholder="Your email" className="mb-2 bg-gray-800 border-gray-700" />
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Subscribe</Button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SIR CBSE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Login' : 'Register'} to SIR CBSE</DialogTitle>
            <DialogDescription>
              {authMode === 'login' ? 'Enter your credentials to access your account' : 'Create a new account to get started'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuth}>
            <div className="space-y-4 py-4">
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
            </div>
            <DialogFooter className="flex-col space-y-2">
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                {authMode === 'login' ? 'Login' : 'Register'}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-orange-600"
              >
                {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{selectedTest?.name}</DialogTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-orange-600 font-semibold">
                  <Clock className="w-5 h-5 mr-2" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
            <DialogDescription>{selectedTest?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedTest?.questions && selectedTest.questions.length > 0 ? (
              selectedTest.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">
                    {index + 1}. {question.text}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={testAnswers[question.id] === option}
                          onChange={() => handleAnswerChange(question.id, option)}
                          className="w-4 h-4 text-orange-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>No questions available for this test yet.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmitTest}
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={!selectedTest?.questions || selectedTest.questions.length === 0}
            >
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function App() {
  return <Home />
}

export default App