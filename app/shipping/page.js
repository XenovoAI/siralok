'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Shipping() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shipping & Delivery Policy
        </h1>
        <p className="text-gray-600 mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              1. Digital Product Delivery
            </h2>
            <p className="mb-3">
              SIR CBSE is a fully digital educational platform. All our products and services are delivered electronically, which means:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>No Physical Shipping:</strong> We do not ship any physical products</li>
              <li><strong>Instant Access:</strong> All study materials, test series, and course content are available immediately upon purchase</li>
              <li><strong>No Shipping Charges:</strong> Since all products are digital, there are no shipping or handling fees</li>
              <li><strong>Global Availability:</strong> Our platform is accessible from anywhere in the world with an internet connection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              2. How to Access Your Content
            </h2>
            <p className="mb-3">
              After completing your purchase or registration:
            </p>
            <ol className="list-decimal ml-6 space-y-2">
              <li><strong>Immediate Activation:</strong> Your account is activated instantly upon successful payment</li>
              <li><strong>Login Access:</strong> Use your registered email and password to log in to your account</li>
              <li><strong>Dashboard Access:</strong> Navigate to your dashboard to access all purchased materials</li>
              <li><strong>Download Materials:</strong> Study materials can be downloaded as PDF files for offline access</li>
              <li><strong>Online Tests:</strong> Test series are available online and can be accessed directly from your account</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. Delivery Timeline
            </h2>
            <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded mb-3">
              <p className="font-semibold text-gray-900 mb-2">All digital content is delivered instantly</p>
              <p>There are no waiting periods or delivery delays for digital products</p>
            </div>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Subscription Activation:</strong> Instant (within seconds of payment confirmation)</li>
              <li><strong>Study Materials:</strong> Available immediately in your dashboard</li>
              <li><strong>Test Series:</strong> Accessible as soon as your account is active</li>
              <li><strong>Video Content:</strong> Streaming begins instantly; no buffering or download time required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. System Requirements
            </h2>
            <p className="mb-3">
              To ensure smooth delivery and access to our digital content:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Internet Connection:</strong> Stable broadband connection (minimum 2 Mbps recommended)</li>
              <li><strong>Devices:</strong> Compatible with desktop computers, laptops, tablets, and smartphones</li>
              <li><strong>Browsers:</strong> Latest versions of Chrome, Firefox, Safari, or Edge</li>
              <li><strong>PDF Reader:</strong> Required for downloading and viewing study materials</li>
              <li><strong>Storage Space:</strong> Adequate device storage for downloading materials (varies by content)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Access Duration
            </h2>
            <p className="mb-3">
              Your access to purchased content depends on your subscription type:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Monthly Subscription:</strong> Access for 30 days from the date of purchase</li>
              <li><strong>Annual Subscription:</strong> Access for 365 days from the date of purchase</li>
              <li><strong>Lifetime Access:</strong> Certain premium materials offer lifetime access</li>
              <li><strong>Downloaded Materials:</strong> PDFs downloaded to your device remain accessible even after subscription ends</li>
              <li><strong>Auto-Renewal:</strong> Subscriptions auto-renew unless cancelled before the renewal date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Delivery Issues & Technical Support
            </h2>
            <p className="mb-3">
              If you experience any issues accessing your content:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Login Problems:</strong> Check your email for account activation link; reset password if needed</li>
              <li><strong>Content Not Visible:</strong> Clear browser cache and cookies, then log in again</li>
              <li><strong>Download Failures:</strong> Ensure stable internet connection; try a different browser</li>
              <li><strong>Payment Processed but No Access:</strong> Wait 5-10 minutes for system synchronization; contact support if issue persists</li>
              <li><strong>Technical Support:</strong> Available 24/7 via email at info@sircbse.com or phone at +91 1234567890</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Content Updates & Additions
            </h2>
            <p>
              We regularly update our study materials and add new content:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Automatic Updates:</strong> All content updates are delivered automatically to active subscribers</li>
              <li><strong>New Test Series:</strong> Added regularly as part of your subscription</li>
              <li><strong>Syllabus Changes:</strong> Materials are updated to reflect any changes in JEE/NEET syllabus</li>
              <li><strong>No Additional Charges:</strong> All updates are included in your subscription at no extra cost</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. Multiple Device Access
            </h2>
            <p className="mb-3">
              Your account can be accessed on multiple devices:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Concurrent Logins:</strong> Up to 2 devices simultaneously (varies by subscription plan)</li>
              <li><strong>Device Switching:</strong> You can switch between devices freely</li>
              <li><strong>Account Sharing:</strong> Strictly prohibited; accounts are for individual use only</li>
              <li><strong>Security:</strong> Suspicious activity may result in account suspension</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              9. Offline Access
            </h2>
            <p>
              While our platform is primarily online, we offer limited offline capabilities:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>PDF Downloads:</strong> Study materials can be downloaded for offline viewing</li>
              <li><strong>Test Series:</strong> Must be taken online; offline access not available</li>
              <li><strong>Video Content:</strong> Online streaming only; download option not currently available</li>
              <li><strong>Progress Tracking:</strong> Requires internet connection to sync with your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              10. Physical Study Materials (If Applicable)
            </h2>
            <p className="mb-3">
              In rare cases where we offer physical books or materials:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Separate Purchase:</strong> Physical materials are sold separately from digital subscriptions</li>
              <li><strong>Shipping Partners:</strong> We partner with reliable courier services for delivery</li>
              <li><strong>Delivery Time:</strong> 5-7 business days for Indian metros; 7-10 days for other locations</li>
              <li><strong>Tracking:</strong> You will receive a tracking number via email once shipped</li>
              <li><strong>Shipping Charges:</strong> Applicable as per the product listing</li>
              <li><strong>International Shipping:</strong> Not currently available</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              11. Data Security & Privacy
            </h2>
            <p>
              Your digital content and personal information are secure:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Encrypted Delivery:</strong> All content is delivered via secure HTTPS connections</li>
              <li><strong>DRM Protection:</strong> Study materials are protected against unauthorized sharing</li>
              <li><strong>Privacy:</strong> Your personal and payment information is never shared with third parties</li>
              <li><strong>Backup:</strong> Your purchase history and downloaded materials are backed up on our servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              12. Contact Information
            </h2>
            <p className="mb-3">
              For any questions or concerns regarding delivery and access:
            </p>
            <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">SIR CBSE Support Team</p>
              <p>Email: info@sircbse.com</p>
              <p>Phone: +91 1234567890</p>
              <p>Support Hours: 24/7 (Email), 9 AM - 9 PM IST (Phone)</p>
              <p>Address: Educational Complex, Learning Street, India</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
