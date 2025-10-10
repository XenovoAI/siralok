'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy <span className="text-sky-600">Policy</span>
          </h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to SIR CBSE. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect, use, store, and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Identity Data:</strong> Name, username, date of birth, gender</li>
                <li><strong>Contact Data:</strong> Email address, telephone number, address</li>
                <li><strong>Account Data:</strong> Username, password, and other authentication information</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
                <li><strong>Usage Data:</strong> Information about how you use our website, products, and services</li>
                <li><strong>Academic Data:</strong> Test scores, performance metrics, study progress, course enrollment</li>
                <li><strong>Payment Data:</strong> Payment card details, transaction history</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Collect Your Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use different methods to collect data from and about you:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Direct Interactions:</strong> When you register, subscribe, request information, or give us feedback</li>
                <li><strong>Automated Technologies:</strong> As you interact with our website, we may automatically collect technical data using cookies and similar technologies</li>
                <li><strong>Test Performance:</strong> When you take tests or complete assessments on our platform</li>
                <li><strong>Third Parties:</strong> From analytics providers, payment processors, and other service providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>To register you as a new user and manage your account</li>
                <li>To provide and deliver our educational services and products</li>
                <li>To process your payments and manage billing</li>
                <li>To track your learning progress and provide personalized recommendations</li>
                <li>To send you administrative information, updates, and security alerts</li>
                <li>To improve our website, services, and user experience</li>
                <li>To analyze test performance and generate analytics</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To detect and prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your personal data with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Companies that provide services on our behalf (payment processing, email delivery, hosting services)</li>
                <li><strong>Educational Partners:</strong> Institutes and educators associated with our platform</li>
                <li><strong>Analytics Providers:</strong> To help us improve our services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. All our staff and service providers are required to keep your information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. When you delete your account, we will delete or anonymize your personal data, unless we are required to retain it for legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Legal Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request access to your personal data</li>
                <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Restrict Processing:</strong> Request restriction of processing your personal data</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another party</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website uses cookies to distinguish you from other users. This helps us provide you with a good experience and allows us to improve our site. A cookie is a small file of letters and numbers that we store on your browser or device.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are intended for students preparing for JEE and NEET exams. If you are under 18, you may only use our services with the involvement of a parent or guardian. We do not knowingly collect personal information from children under 13 without parental consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. You are advised to review this privacy policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. We will take all steps reasonably necessary to ensure that your data is treated securely.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@sircbse.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 1234567890</p>
                <p className="text-gray-700"><strong>Address:</strong> SIR CBSE Education Services, India</p>
              </div>
            </section>

            <section className="mt-8 p-6 bg-sky-50 rounded-lg border-l-4 border-sky-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
              <p className="text-gray-700">
                We are committed to protecting your privacy and ensuring the security of your personal information. If you have any concerns or questions about how we handle your data, please don't hesitate to contact us.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
