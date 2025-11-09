'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Book, FileText, Clock, Award, TrendingUp, Target, Download, Receipt, Calendar, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const [purchasesLoading, setPurchasesLoading] = useState(false)
  const [downloadHistory, setDownloadHistory] = useState([])
  const [downloadHistoryLoading, setDownloadHistoryLoading] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchPurchases()
      fetchDownloadHistory()
      setupRealtimeSubscription()
    }
  }, [user])

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) throw error

      if (!session) {
        toast.error('Please login to access dashboard')
        router.push('/login')
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

  const fetchPurchases = async () => {
    try {
      setPurchasesLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/payment/my-purchases', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      } else {
        console.error('Failed to fetch purchases')
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setPurchasesLoading(false)
    }
  }

  const fetchDownloadHistory = async () => {
    try {
      setDownloadHistoryLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/user/download-history', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDownloadHistory(data)
      } else {
        console.error('Failed to fetch download history')
      }
    } catch (error) {
      console.error('Error fetching download history:', error)
    } finally {
      setDownloadHistoryLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('purchases_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'purchases',
        filter: `user_id=eq.${user?.id}`,
      }, () => {
        fetchPurchases()
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'material_downloads',
        filter: `user_id=eq.${user?.id}`,
      }, () => {
        fetchPurchases()
        fetchDownloadHistory()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleDownload = async (material) => {
    try {
      // Record download
      const { data: { session } } = await supabase.auth.getSession()
      await fetch('/api/materials/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          materialId: material.id,
          materialTitle: material.title,
        }),
      })

      // Open PDF in new tab
      window.open(material.pdf_url, '_blank')
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download material')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.name || 'Student'}! 👋
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Continue your JEE and NEET preparation journey
            </p>
          </div>
        </div>
      </section>

      {/* My Purchases Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Purchases</h2>
              <p className="text-gray-600">Your purchased study materials and download history</p>
            </div>

            {purchasesLoading ? (
              <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading purchases...</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                <Receipt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 mb-3 sm:mb-4">No purchases yet</p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  Purchase study materials to see them here
                </p>
                <Link href="/materials">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Browse Materials
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {purchase.materials?.thumbnail_url && (
                            <img
                              src={purchase.materials.thumbnail_url}
                              alt={purchase.materials.title}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                              {purchase.materials?.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {purchase.materials?.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Book className="w-4 h-4" />
                                {purchase.materials?.subject} {purchase.materials?.class && `- ${purchase.materials.class}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Purchased: {formatDate(purchase.created_at)}
                              </span>
                              {purchase.last_downloaded && (
                                <span className="flex items-center gap-1">
                                  <Download className="w-4 h-4" />
                                  Last downloaded: {formatDate(purchase.last_downloaded)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:items-end">
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-end gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {purchase.amount / 100}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Transaction: {purchase.payments?.transaction_id?.slice(-8)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleDownload(purchase.materials)}
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => {
                              // Show receipt modal or details
                              toast.info('Receipt feature coming soon!')
                            }}
                          >
                            <Receipt className="w-4 h-4" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Basic Dashboard Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Basic Dashboard</h2>
              <p className="text-gray-600">Your learning progress and quick actions</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
              <div className="bg-sky-50 rounded-lg p-4 sm:p-6 text-center">
                <Book className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">4</div>
                <div className="text-xs sm:text-sm text-gray-600">Subjects</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">0</div>
                <div className="text-xs sm:text-sm text-gray-600">Tests Taken</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">0h</div>
                <div className="text-xs sm:text-sm text-gray-600">Study Time</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 sm:p-6 text-center">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">0%</div>
                <div className="text-xs sm:text-sm text-gray-600">Avg Score</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Study Materials Card */}
                <Link href="/materials">
                  <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-6 sm:p-8 text-white hover:shadow-xl transition cursor-pointer">
                    <Book className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
                    <h4 className="text-xl sm:text-2xl font-bold mb-2">Study Materials</h4>
                    <p className="mb-3 sm:mb-4 text-sm sm:text-base">Access comprehensive notes and resources for all subjects</p>
                    <Button variant="secondary" className="bg-white text-sky-600 hover:bg-gray-100 w-full sm:w-auto">
                      Browse Materials →
                    </Button>
                  </div>
                </Link>

                {/* Practice Tests Card */}
                <Link href="/tests">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 sm:p-8 text-white hover:shadow-xl transition cursor-pointer">
                    <Target className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
                    <h4 className="text-xl sm:text-2xl font-bold mb-2">Practice Tests</h4>
                    <p className="mb-3 sm:mb-4 text-sm sm:text-base">Take mock tests and improve your exam performance</p>
                    <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 w-full sm:w-auto">
                      Start Testing →
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download History Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Download History</h2>

            {downloadHistoryLoading ? (
              <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading download history...</p>
              </div>
            ) : downloadHistory.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                <Download className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 mb-3 sm:mb-4">No downloads yet</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Download study materials to see your history here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {downloadHistory.map((download) => (
                  <div key={download.id} className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-sky-500">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {download.materials?.thumbnail_url && (
                            <img
                              src={download.materials.thumbnail_url}
                              alt={download.material_title}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                              {download.material_title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {download.materials?.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Book className="w-4 h-4" />
                                {download.materials?.subject} {download.materials?.class && `- ${download.materials.class}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Downloaded: {formatDate(download.downloaded_at)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                download.material_type === 'paid'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                {download.material_type === 'paid' ? 'Paid' : 'Free'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDownload(download.materials)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Again
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User Profile Info */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.user_metadata?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Role</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{user?.user_metadata?.role || 'Student'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Status</p>
                  <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
