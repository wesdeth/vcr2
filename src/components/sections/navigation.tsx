import Link from 'next/link'
import { MessageSquare, TwitterIcon, Linkedin } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">V</span>
            </div>
            <span className="text-white font-medium text-sm">VCR</span>
          </Link>

          {/* Right side - Social icons and auth buttons */}
          <div className="flex items-center space-x-4">
            {/* Social Icons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <MessageSquare size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <TwitterIcon size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Link 
                href="#" 
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="#" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}