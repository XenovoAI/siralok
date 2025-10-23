'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { Button } from '@/components/ui/button'
import { Search, Download, Eye, BookOpen, Filter, Lock, TrendingUp, Award } from 'lucide-react'
import { toast } from 'sonner'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedClass, setSelectedClass] = useState('All')
  const [viewingPdf, setViewingPdf] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const subjects = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics']
  const classes = ['All', 'Class 10', 'Class 11', 'Class 12', 'Dropper']

  useEffect(() => {
    loadMaterials()
  }, [])

  useEffect(() => {
    filterMaterials()
  }, [materials, searchQuery, selectedSubject, selectedClass])

  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMaterials(data || [])
    } catch (error) {
      console.error('Error loading materials:', error)
      toast.error('Failed to load materials')
    } finally {
      setLoading(false)
    }
  }

  const filterMaterials = () => {
    let filtered = materials

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(m => m.subject === selectedSubject)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredMaterials(filtered)
  }

  const handleDownload = async (material) => {
    // Check if user is logged in
    if (!user) {
      setPendingAction({ type: 'download', material })
      setShowAuthModal(true)
      return
    }

    try {
      // Check if user has already downloaded this material
      const { data: existingDownload } = await supabase
        .from('material_downloads')
        .select('*')
        .eq('user_id', user.id)
        .eq('material_id', material.id)
        .single()

      let isNewDownload = !existingDownload

      // If not already downloaded, create download record
      if (isNewDownload) {
        const { error: insertError } = await supabase
          .from('material_downloads')
          .insert({
            user_id: user.id,
            user_email: user.email,
            material_id: material.id,
            material_title: material.title,
            material_type: 'free'
          })

        if (insertError) {
          console.error('Error tracking download:', insertError)
          // Don't block download if tracking fails
          isNewDownload = false
        }

        // Update download counter only for new downloads
        if (!insertError) {
          const { error: updateError } = await supabase
            .from('materials')
            .update({ downloads: (material.downloads || 0) + 1 })
            .eq('id', material.id)

          if (updateError) {
            console.error('Error updating download count:', updateError)
          }
        }
      }

      // Trigger download
      window.open(material.pdf_url, '_blank')
      
      if (isNewDownload) {
        toast.success('🎉 Download started!')
      } else {
        toast.success('Download started! (already counted)')
      }
      
      // Refresh materials to update counter
      loadMaterials()
    } catch (error) {
      console.error('Error downloading:', error)
      toast.error('Failed to download')
    }
  }

  const handleView = (material) => {
    // Check if user is logged in
    if (!user) {
      setPendingAction({ type: 'view', material })
      setShowAuthModal(true)
      return
    }
    setViewingPdf(material)
  }

  const handleAuthSuccess = () => {
    // Execute pending action after successful auth
    if (pendingAction) {
      if (pendingAction.type === 'download') {
        // Reload page to get user context, then download will work
        window.location.reload()
      } else if (pendingAction.type === 'view') {
        window.location.reload()
      }
      setPendingAction(null)
    }
  }

  const closePdfViewer = () => {
    setViewingPdf(null)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading materials...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Hero Section - Enhanced */}
      <section className="relative py-16 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/30">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">1000+ Study Materials Available</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Premium Study Materials
              <br />
              <span className="text-sky-200">for JEE & NEET</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Access comprehensive study materials, detailed notes, and quality books curated by experts
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-sm text-white/80">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-white/80">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-white/80">Success Rate</div>
              </div>
            </div>

            {/* Search Bar - Enhanced */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for materials, subjects, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900 placeholder-gray-400 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Filter Section - Enhanced */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                  selectedSubject === subject
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white scale-105 shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedSubject !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Materials will appear here once added by admin'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredMaterials.length}</span> material
                  {filteredMaterials.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-sky-200"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img
                        src={material.thumbnail_url}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
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
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                        {material.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                        {material.description}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleView(material)}
                          variant="outline"
                          className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 border-gray-200 rounded-xl"
                          size="sm"
                        >
                          {!user ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          onClick={() => handleDownload(material)}
                          className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-xl flex items-center justify-center gap-2 rounded-xl transition-all duration-200"
                          size="sm"
                        >
                          {!user ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                          <span className="font-semibold">Download</span>
                        </Button>
                      </div>

                      {/* Login prompt for non-logged users */}
                      {!user && (
                        <div className="mt-3 text-center">
                          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Login required to access</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-bold text-lg">{viewingPdf.title}</h3>
                <p className="text-sm text-gray-600">{viewingPdf.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDownload(viewingPdf)}
                  className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  onClick={closePdfViewer}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={viewingPdf.pdf_url}
                className="w-full h-full"
                title={viewingPdf.title}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
