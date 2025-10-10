'use client'

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">SIR</span>
              <span className="text-sky-400">CBSE</span>
            </h3>
            <p className="text-gray-400">Your partner in JEE and NEET success</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-sky-400">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-sky-400">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@sircbse.com</li>
              <li>Phone: +91 1234567890</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <Input placeholder="Your email" className="mb-2 bg-gray-800 border-gray-700" />
            <Button className="w-full bg-sky-600 hover:bg-sky-700">Subscribe</Button>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SIR CBSE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}