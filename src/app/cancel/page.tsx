import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, RotateCcw, Home, Mail } from 'lucide-react'

interface CancelPageProps {
  searchParams?: {
    session_id?: string
  }
}

export default function CancelPage({ searchParams }: CancelPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-violet-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/90 border-slate-700 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-gray-300 leading-relaxed">
                No worries! Your payment was cancelled and no charges were made to your account.
              </p>
              <p className="text-gray-400 text-sm">
                You can try again anytime or explore our free features while you decide.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                <Link href="/pricing" className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <Link href="/" className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Return Home
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">
                  Need help?
                </p>
                <Button asChild variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/20">
                  <Link href="mailto:support@example.com" className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>

            {searchParams?.session_id && (
              <div className="text-xs text-gray-500 text-center mt-4 p-2 bg-gray-800/50 rounded">
                Session ID: {searchParams.session_id.slice(0, 16)}...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}