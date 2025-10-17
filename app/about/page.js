'use client'

import { Target, Users, Award, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-sky-600">SIR CBSE</span>
            </h1>
            <p className="text-xl text-gray-600">
              Empowering students to achieve their JEE and NEET dreams
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              At SIR CBSE, we believe that quality education should be accessible to every aspiring student. 
              Our platform provides comprehensive study materials, practice tests, and expert guidance to help 
              students excel in their JEE and NEET examinations.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Focused Learning</h3>
                <p className="text-gray-600">
                  Curated content aligned with JEE and NEET syllabus for targeted preparation
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
                <p className="text-gray-600">
                  Content created by experienced educators with proven track records
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-gray-600">
                  Thousands of students have achieved their goals using our platform
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Regular Updates</h3>
                <p className="text-gray-600">
                  Fresh content and tests added regularly to keep you prepared
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Leadership Team</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Founder and CEO */}
              <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-sky-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  AK
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Alok Kumar</h3>
                <p className="text-sky-600 font-semibold mb-1">Founder & CEO</p>
                <p className="text-sm text-sky-500 mb-4">EdTech Influencer</p>
                <a href="mailto:sircbse@gmail.com" className="text-gray-600 hover:text-sky-600 transition-colors inline-flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  sircbse@gmail.com
                </a>
                <div className="pt-4 border-t border-sky-100">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    A passionate educator and EdTech influencer dedicated to revolutionizing online education. With years of experience in the education sector, Alok founded SIR CBSE to make quality JEE and NEET preparation accessible to every student.
                  </p>
                </div>
              </div>

              {/* Co-founder and CTO */}
              <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-sky-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  HP
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Harshit Patidar</h3>
                <p className="text-sky-600 font-semibold mb-3">Co-Founder & CTO</p>
                <a href="mailto:xenovoai@gmail.com" className="text-gray-600 hover:text-sky-600 transition-colors inline-flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  xenovoai@gmail.com
                </a>
                <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-sky-100">
                  Also the Founder & CEO of <span className="font-semibold text-sky-600">Xenovo AI</span>, an AI innovation company
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">50,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">1000+</div>
              <p className="text-gray-600">Practice Tests</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}