'use client'

import Link from 'next/link'
import { Book, Video, BarChart, Smartphone, Users, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Ace Your <span className="text-sky-600">JEE and NEET</span> Exam with Expert Study Materials
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access comprehensive JEE and NEET preparation materials and practice tests. Prepare effectively and boost your confidence for the exam.
            </p>
            <Link href="/materials">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg">
                Explore Study Materials
                <ChevronRight className="ml-2" />
              </Button>
            </Link>
          </div>
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

      {/* Quick Links Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/materials" className="block">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-8 text-white hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-2">Study Materials</h3>
                <p className="mb-4">Access comprehensive notes and resources</p>
                <Button variant="secondary">Browse Materials →</Button>
              </div>
            </Link>
            <Link href="/tests" className="block">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-2">Live Test Series</h3>
                <p className="mb-4">Practice with mock exams and assessments</p>
                <Button variant="secondary">Start Testing →</Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}