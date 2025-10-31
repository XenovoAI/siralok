'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Book, Video, BarChart, Smartphone, Users, Clock, ChevronRight, Download, Star, TrendingUp, MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Autoplay from 'embla-carousel-autoplay'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { toast } from 'sonner'

export default function Home() {
  const [featuredMaterials, setFeaturedMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    loadFeaturedMaterials()
  }, [])

  const loadFeaturedMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('downloads', { ascending: false })
        .limit(8)

      if (error) throw error
      setFeaturedMaterials(data || [])
    } catch (error) {
      console.error('Error loading featured materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (material) => {
    if (!user) {
      setPendingAction({ type: 'download', material })
      setShowAuthModal(true)
      return
    }

    try {
      window.open(material.pdf_url, '_blank')
      toast.success('Download started!')
    } catch (error) {
      console.error('Error downloading:', error)
      toast.error('Failed to download')
    }
  }

  const handleAuthSuccess = () => {
    if (pendingAction) {
      if (pendingAction.type === 'download') {
        window.location.reload()
      }
      setPendingAction(null)
    }
  }

  const getSubjectColor = (subject) => {
    const colors = {
      Physics: 'bg-blue-100 text-blue-600',
      Chemistry: 'bg-green-100 text-green-600',
      Biology: 'bg-purple-100 text-purple-600',
      Mathematics: 'bg-orange-100 text-orange-600'
    }
    return colors[subject] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

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

      {/* Featured Materials Carousel */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Study Materials</h2>
            <p className="text-xl text-gray-600">Most downloaded materials by our students</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
          ) : featuredMaterials.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: false,
                dragFree: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                }),
              ]}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredMaterials.map((material) => (
                  <CarouselItem key={material.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6">
                    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {material.thumbnail_url ? (
                          <Image
                            src={material.thumbnail_url}
                            alt={material.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            priority={false}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                            <Book className="w-16 h-16 text-sky-600" />
                          </div>
                        )}

                        {/* Subject badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm ${getSubjectColor(material.subject)}`}>
                            {material.subject}
                          </span>
                        </div>

                        {/* Download count badge */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                          <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                          <span className="text-xs font-semibold text-gray-800">{material.downloads || 0} downloads</span>
                        </div>

                        {/* Price/Free badge */}
                        <div className="absolute bottom-3 right-3">
                          {material.is_free ? (
                            <span className="px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white rounded-lg text-xs font-bold shadow-lg">
                              FREE
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-sm text-white rounded-lg text-xs font-bold shadow-lg">
                              ₹{material.price || 0}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {material.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {material.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                        </div>

                        {/* Download Button */}
                        <Button
                          onClick={() => handleDownload(material)}
                          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-xl flex items-center justify-center gap-2 rounded-xl transition-all duration-200"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Featured materials will appear here once added</p>
            </div>
          )}
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
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Notes</h3>
              <p className="text-gray-600">Detailed notes covering entire syllabus</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Solutions</h3>
              <p className="text-gray-600">Step-by-step video explanations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Track your progress with detailed insights</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Study anywhere, anytime on any device</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600">Learn from experienced educators</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
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
              <div className="text-4xl font-bold text-sky-600 mb-2">50,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">1000+</div>
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
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-8 text-white hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-2">Study Materials</h3>
                <p className="mb-4">Access comprehensive notes and resources</p>
                <Button variant="secondary">Browse Materials →</Button>
              </div>
            </Link>
            <Link href="/tests" className="block">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-8 text-white hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-2">Live Test Series</h3>
                <p className="mb-4">Practice with mock exams and assessments</p>
                <Button variant="secondary">Start Testing →</Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions about SIR CBSE</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="download" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-gray-900">How do I download materials?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6">
                  Simply click the "Download" button on any material. You'll need to sign up for a free account first. Once logged in, all downloads are instant and available in your dashboard for future access.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="free" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-gray-900">Is SIRCBSE completely free?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6">
                  Yes! SIR CBSE offers completely free access to all study materials, practice tests, and resources. We believe quality education should be accessible to all students preparing for JEE and NEET exams.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="included" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-gray-900">What are included in study materials?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6">
                  Our study materials include comprehensive notes, formula sheets, practice questions, previous year papers, mock tests, video solutions, and detailed explanations for Physics, Chemistry, Biology, and Mathematics covering the complete JEE and NEET syllabus.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="updates" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-gray-900">How often are materials updated?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6">
                  We regularly update our materials to align with the latest exam patterns and curriculum changes. New content is added monthly, and existing materials are reviewed and improved based on student feedback and exam trends.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sharing" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-gray-900">Can I share materials with friends?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6">
                  While we encourage collaborative learning, each account is personal. We recommend your friends create their own free accounts to access all materials. This helps us maintain quality service and track usage for improvements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="success" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-gray-900">What's the success rate?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6">
                  Our students have achieved a 95% success rate in JEE and NEET exams. This is attributed to our comprehensive study materials, regular practice tests, and personalized learning approach that helps students identify and improve their weak areas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Floating Telegram Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <a href="https://t.me/SIRCBSENETWORK" target="_blank" rel="noopener noreferrer">
          <Button className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </Button>
        </a>
      </div>

      <Footer />
    </div>
  )
}
