'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Search, Download, Eye, BookOpen, Filter } from 'lucide-react'
import { toast } from 'sonner'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [viewingPdf, setViewingPdf] = useState(null)

  const subjects = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics']

  useEffect(() => {
    loadMaterials()
  }, [])

  useEffect(() => {
    filterMaterials()
  }, [materials, searchQuery, selectedSubject])

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
    try {
      // Increment download counter
      const { error } = await supabase
        .from('materials')
        .update({ downloads: (material.downloads || 0) + 1 })
        .eq('id', material.id)

      if (error) throw error

      // Trigger download
      window.open(material.pdf_url, '_blank')
      toast.success('Download started!')
      
      // Refresh materials to update counter
      loadMaterials()
    } catch (error) {
      console.error('Error downloading:', error)
      toast.error('Failed to download')
    }
  }

  const handleView = (material) => {
    setViewingPdf(material)
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Study <span className="text-sky-600">Materials</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access comprehensive study materials, notes, and books for JEE and NEET preparation
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search materials by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-gray-700 font-medium whitespace-nowrap">
              <Filter className="w-5 h-5" />
              Filter:
            </div>
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  selectedSubject === subject
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      <img
                        src={material.thumbnail_url}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSubjectColor(material.subject)}`}>
                          {material.subject}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {material.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {material.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <Download className="w-4 h-4" />
                        <span>{material.downloads || 0} downloads</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleView(material)}
                          variant="outline"
                          className="flex-1 flex items-center justify-center gap-2"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDownload(material)}
                          className="flex-1 bg-sky-600 hover:bg-sky-700 flex items-center justify-center gap-2"
                          size="sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
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
