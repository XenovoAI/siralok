'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Upload, Trash2, Edit, Plus, X, FileText, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Physics',
    pdfFile: null,
    thumbnailFile: null
  })

  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics']

  useEffect(() => {
    checkAdmin()
    loadMaterials()
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage study materials</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>

        {/* Materials List - Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No materials yet. Click "Add Material" to get started.
                    </td>
                  </tr>
                ) : (
                  materials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-6 py-4">
                        <img
                          src={material.thumbnail_url}
                          alt={material.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{material.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{material.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-sky-100 text-sky-600 rounded text-sm">
                          {material.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{material.downloads || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(material)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(material)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Materials List - Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {materials.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No materials yet. Click "Add Material" to get started.
            </div>
          ) : (
            materials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4">
                  <img
                    src={material.thumbnail_url}
                    alt={material.title}
                    className="w-20 h-24 sm:w-24 sm:h-32 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{material.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{material.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-sky-100 text-sky-600 rounded text-xs font-medium">
                        {material.subject}
                      </span>
                      <span className="text-xs text-gray-500">{material.downloads || 0} downloads</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(material)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(material)}
                        className="flex-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMaterial ? 'Edit Material' : 'Add New Material'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-sky-600 hover:bg-sky-700"
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
