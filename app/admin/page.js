'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { 
  Upload, Trash2, Edit, Plus, X, FileText, Image as ImageIcon, 
  Users, Download, BookOpen, TrendingUp, Eye, BarChart3 
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDownloads: 0,
    totalMaterials: 0,
    recentDownloads: 0
  })
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Physics',
    class: 'Class 11',
    pdfFile: null,
    thumbnailFile: null
  })

  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics']
  const classes = ['Class 10', 'Class 11', 'Class 12', 'Dropper']

  useEffect(() => {
    checkAdmin()
    loadMaterials()
    loadStats()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error

      if (!session) {
        toast.error('Please login to access admin panel')
        router.push('/login')
        return
      }

      // Check if user is admin
      if (session.user.user_metadata?.role !== 'admin') {
        toast.error('Access denied. Admin only.')
        router.push('/')
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
    }
  }

  const loadStats = async () => {
    try {
      // Get total users count from auth.users
      const { count: usersCount, error: usersError } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })

      // Get total downloads sum from materials
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select('downloads')

      const totalDownloads = materialsData?.reduce((sum, m) => sum + (m.downloads || 0), 0) || 0

      // Get total materials count
      const { count: materialsCount, error: materialsCountError } = await supabase
        .from('materials')
        .select('*', { count: 'exact', head: true })

      // Get recent downloads (last 7 days) - if material_downloads table exists
      let recentDownloads = 0
      try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        const { count: recentCount } = await supabase
          .from('material_downloads')
          .select('*', { count: 'exact', head: true })
          .gte('downloaded_at', sevenDaysAgo.toISOString())
        
        recentDownloads = recentCount || 0
      } catch (err) {
        // Table might not exist yet, that's okay
        console.log('material_downloads table not found or empty')
      }

      setStats({
        totalUsers: usersCount || 0,
        totalDownloads,
        totalMaterials: materialsCount || 0,
        recentDownloads
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    if (type === 'pdf' && file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    if (type === 'thumbnail' && !file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setFormData(prev => ({
      ...prev,
      [type === 'pdf' ? 'pdfFile' : 'thumbnailFile']: file
    }))
  }

  const uploadFile = async (file, bucket, folder) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.subject) {
      toast.error('Please fill all required fields')
      return
    }

    if (!editingMaterial && (!formData.pdfFile || !formData.thumbnailFile)) {
      toast.error('Please upload both PDF and thumbnail')
      return
    }

    setUploading(true)

    try {
      let pdfUrl = editingMaterial?.pdf_url
      let thumbnailUrl = editingMaterial?.thumbnail_url

      // Upload new PDF if provided
      if (formData.pdfFile) {
        pdfUrl = await uploadFile(formData.pdfFile, 'materials-pdfs', formData.subject.toLowerCase())
      }

      // Upload new thumbnail if provided
      if (formData.thumbnailFile) {
        thumbnailUrl = await uploadFile(formData.thumbnailFile, 'materials-thumbnails', formData.subject.toLowerCase())
      }

      const materialData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        class: formData.class,
        pdf_url: pdfUrl,
        thumbnail_url: thumbnailUrl,
        downloads: editingMaterial?.downloads || 0,
        updated_at: new Date().toISOString()
      }

      if (editingMaterial) {
        // Update existing material
        const { error } = await supabase
          .from('materials')
          .update(materialData)
          .eq('id', editingMaterial.id)

        if (error) throw error
        toast.success('Material updated successfully!')
      } else {
        // Create new material
        materialData.created_at = new Date().toISOString()
        
        const { error } = await supabase
          .from('materials')
          .insert([materialData])

        if (error) throw error
        toast.success('Material added successfully!')
      }

      // Reset form and reload
      setFormData({
        title: '',
        description: '',
        subject: 'Physics',
        class: 'Class 11',
        pdfFile: null,
        thumbnailFile: null
      })
      setShowAddModal(false)
      setEditingMaterial(null)
      loadMaterials()
    } catch (error) {
      console.error('Error saving material:', error)
      toast.error(error.message || 'Failed to save material')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (material) => {
    setEditingMaterial(material)
    setFormData({
      title: material.title,
      description: material.description,
      subject: material.subject,
      class: material.class || 'Class 11',
      pdfFile: null,
      thumbnailFile: null
    })
    setShowAddModal(true)
  }

  const handleDelete = async (material) => {
    if (!confirm(`Are you sure you want to delete "${material.title}"?`)) return

    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', material.id)

      if (error) throw error

      toast.success('Material deleted successfully!')
      loadMaterials()
    } catch (error) {
      console.error('Error deleting material:', error)
      toast.error('Failed to delete material')
    }
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingMaterial(null)
    setFormData({
      title: '',
      description: '',
      subject: 'Physics',
      class: 'Class 11',
      pdfFile: null,
      thumbnailFile: null
    })
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage study materials and monitor statistics</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>

          {/* Total Downloads */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Download className="w-6 h-6" />
              </div>
              <BarChart3 className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Downloads</h3>
            <p className="text-3xl font-bold">{stats.totalDownloads}</p>
          </div>

          {/* Total Materials */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <FileText className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Materials</h3>
            <p className="text-3xl font-bold">{stats.totalMaterials}</p>
          </div>

          {/* Recent Downloads (7 days) */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Eye className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Recent (7 days)</h3>
            <p className="text-3xl font-bold">{stats.recentDownloads}</p>
          </div>
        </div>

        {/* Materials Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
            <p className="text-gray-600 text-sm">Manage and organize all materials</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>

        {/* Materials List - Unified Card View */}
        {materials.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first study material</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Material
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {materials.map((material) => (
              <div key={material.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={material.thumbnail_url}
                    alt={material.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subject badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-sky-600 rounded-lg text-xs font-bold shadow-md">
                      {material.subject}
                    </span>
                  </div>
                  {/* Downloads badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {material.downloads || 0}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {material.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {material.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(material)}
                      className="flex-1 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(material)}
                      className="flex-1 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-4 sm:my-8">
            <div className="max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 sticky top-0 bg-white border-b z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingMaterial ? 'Edit Material' : 'Add New Material'}
                  </h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 p-1">
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., Mechanics Chapter Notes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Brief description of the material"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PDF File {!editingMaterial && '*'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, 'pdf')}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.pdfFile ? formData.pdfFile.name : 'Click to upload PDF'}
                      </p>
                      {editingMaterial && !formData.pdfFile && (
                        <p className="text-xs text-gray-500 mt-1">Leave empty to keep current PDF</p>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image {!editingMaterial && '*'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'thumbnail')}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {formData.thumbnailFile ? (
                        <div>
                          <img
                            src={URL.createObjectURL(formData.thumbnailFile)}
                            alt="Preview"
                            className="w-32 h-40 object-cover rounded mx-auto mb-2"
                          />
                          <p className="text-sm text-gray-600">{formData.thumbnailFile.name}</p>
                        </div>
                      ) : editingMaterial?.thumbnail_url ? (
                        <div>
                          <img
                            src={editingMaterial.thumbnail_url}
                            alt="Current"
                            className="w-32 h-40 object-cover rounded mx-auto mb-2"
                          />
                          <p className="text-sm text-gray-600">Click to change thumbnail</p>
                        </div>
                      ) : (
                        <div>
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t sticky bottom-0 bg-white pb-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 order-1 sm:order-1"
                  >
                    {uploading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {editingMaterial ? 'Update Material' : 'Add Material'}
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={uploading}
                    className="flex-1 order-2 sm:order-2"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
