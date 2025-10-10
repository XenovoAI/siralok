'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of <span className="text-sky-600">Service</span>
          </h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using SIR CBSE's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily access the materials (information or software) on SIR CBSE's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on SIR CBSE's website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Course Content and Materials</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All study materials, test papers, video lectures, and other educational content provided on SIR CBSE are for your personal educational use only. You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Reproduce, distribute, or share course materials without authorization</li>
                <li>Record or screenshot video lectures for redistribution</li>
                <li>Share your login credentials with others</li>
                <li>Use automated tools to scrape or download content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment and Refunds</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you choose to purchase any paid courses or services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>All fees are stated in Indian Rupees (INR) unless otherwise specified</li>
                <li>Payment must be made in advance using accepted payment methods</li>
                <li>Refund requests must be submitted within 7 days of purchase</li>
                <li>Refunds will be processed within 14 business days of approval</li>
                <li>Digital content that has been accessed may not be eligible for refunds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Test Series and Assessments</h2>
              <p className="text-gray-700 leading-relaxed">
                SIR CBSE provides online test series and assessments for JEE and NEET preparation. You agree to attempt tests honestly without unauthorized assistance. Any attempt to cheat, use unfair means, or manipulate test results will result in immediate account suspension and may lead to legal action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of SIR CBSE and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                The materials on SIR CBSE's website are provided on an 'as is' basis. SIR CBSE makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitations</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall SIR CBSE or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SIR CBSE's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Accuracy of Materials</h2>
              <p className="text-gray-700 leading-relaxed">
                While we strive to provide accurate and up-to-date study materials, SIR CBSE does not warrant that the materials on its website are accurate, complete, or current. We reserve the right to make changes to the materials without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Links to Third-Party Sites</h2>
              <p className="text-gray-700 leading-relaxed">
                SIR CBSE has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SIR CBSE. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications</h2>
              <p className="text-gray-700 leading-relaxed">
                SIR CBSE may revise these terms of service at any time without notice. By using this website, you agree to be bound by the current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@sircbse.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 1234567890</p>
                <p className="text-gray-700"><strong>Address:</strong> SIR CBSE Education Services, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
