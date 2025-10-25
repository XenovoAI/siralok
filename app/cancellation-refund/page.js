'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CancellationRefund() {
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
          Cancellation & Refund Policy
        </h1>
        <p className="text-gray-600 mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p>
              At SIR CBSE, we are committed to providing high-quality educational materials and services to help you succeed in your JEE and NEET preparation. This Cancellation & Refund Policy outlines the terms under which you may cancel your subscription or request a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              2. Subscription Cancellation
            </h2>
            <p className="mb-3">
              You may cancel your subscription at any time through your account dashboard or by contacting our support team at info@sircbse.com.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Monthly subscriptions can be cancelled at any time before the next billing cycle</li>
              <li>Annual subscriptions can be cancelled, but refunds are subject to our refund policy below</li>
              <li>Upon cancellation, you will retain access to materials until the end of your current billing period</li>
              <li>No partial refunds will be provided for unused time in monthly subscriptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. Refund Eligibility
            </h2>
            <p className="mb-3">
              Refunds may be requested under the following conditions:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>7-Day Money-Back Guarantee:</strong> If you are not satisfied with our services, you may request a full refund within 7 days of your initial purchase</li>
              <li><strong>Technical Issues:</strong> If you experience persistent technical issues that prevent you from accessing our materials, and our support team is unable to resolve them within 14 days</li>
              <li><strong>Duplicate Charges:</strong> If you have been charged multiple times for the same subscription period</li>
              <li><strong>Unauthorized Charges:</strong> If you notice charges on your account that you did not authorize</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. Non-Refundable Items
            </h2>
            <p className="mb-3">
              The following are non-refundable:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Subscriptions beyond the 7-day refund period, unless eligible under Section 3</li>
              <li>Individual study material downloads after they have been accessed or downloaded</li>
              <li>Test series that have already been attempted or completed</li>
              <li>Promotional or discounted subscriptions (unless otherwise stated)</li>
              <li>Services used in violation of our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Refund Process
            </h2>
            <p className="mb-3">
              To request a refund:
            </p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Contact our support team at info@sircbse.com with your order details and reason for refund</li>
              <li>Provide your registered email address and transaction ID</li>
              <li>Our team will review your request within 3-5 business days</li>
              <li>If approved, refunds will be processed to the original payment method within 7-10 business days</li>
              <li>You will receive a confirmation email once the refund has been initiated</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Refund Timeline
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Processing Time:</strong> 3-5 business days for review and approval</li>
              <li><strong>Refund Initiation:</strong> Within 24 hours of approval</li>
              <li><strong>Bank Processing:</strong> 7-10 business days for the amount to reflect in your account (may vary by bank)</li>
              <li><strong>Credit Card Refunds:</strong> May appear as a credit on your next billing statement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Partial Refunds
            </h2>
            <p>
              In certain situations, partial refunds may be granted at our discretion:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>For annual subscriptions cancelled within 30 days, a prorated refund may be provided after deducting usage charges</li>
              <li>For technical issues affecting only specific features, a partial refund may be offered</li>
              <li>Partial refunds are calculated based on the unused portion of your subscription period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. Free Trial Cancellation
            </h2>
            <p>
              If you are on a free trial:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>You may cancel at any time during the trial period without being charged</li>
              <li>Cancel at least 24 hours before the trial ends to avoid being charged for the subscription</li>
              <li>If you cancel during the trial, you will retain access until the trial period ends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              9. Disputed Charges
            </h2>
            <p>
              If you dispute a charge with your payment provider before contacting us:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Your account may be temporarily suspended pending resolution</li>
              <li>We encourage you to contact us first to resolve any billing issues</li>
              <li>Chargebacks may result in permanent account termination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              10. Modifications to This Policy
            </h2>
            <p>
              We reserve the right to modify this Cancellation & Refund Policy at any time. Changes will be effective immediately upon posting on our website. We will notify users of significant changes via email or through our platform. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              11. Contact Information
            </h2>
            <p className="mb-3">
              If you have any questions about our Cancellation & Refund Policy, please contact us:
            </p>
            <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded">
              <p className="font-semibold text-gray-900 mb-2">SIR CBSE Support Team</p>
              <p>Email: info@sircbse.com</p>
              <p>Phone: +91 1234567890</p>
              <p>Address: Educational Complex, Learning Street, India</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
