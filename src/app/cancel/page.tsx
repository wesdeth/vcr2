'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const amount = searchParams.get('amount')
  const currency = searchParams.get('currency')
  const plan = searchParams.get('plan_name')
  const email = searchParams.get('customer_email')

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/90 border-slate-700 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Payment Successful
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-gray-300 leading-relaxed">
                Thank you! Your payment was successful{email ? ` and a receipt has been sent to ${email}` : ''}.
              </p>
              {plan && (
                <p className="text-sm text-gray-400">Plan: {plan}</p>
              )}
              {amount && currency && (
                <p className="text-sm text-gray-400">
                  Amount: {currency.toUpperCase()} {amount}
                </p>
              )}
            </div>

            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </Button>

            {sessionId && (
              <div className="text-xs text-gray-500 text-center mt-4 p-2 bg-gray-800/50 rounded">
                Session ID: {sessionId.slice(0, 16)}...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
