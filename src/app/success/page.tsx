'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function SuccessContent() {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id') || undefined
  const amount = searchParams.get('amount') || undefined
  const currency = searchParams.get('currency') || 'usd'
  const subscription_id = searchParams.get('subscription_id') || undefined
  const plan_name = searchParams.get('plan_name') || undefined
  const customer_email = searchParams.get('customer_email') || undefined

  const formatAmount = (amount: string | undefined, currency: string) => {
    if (!amount) return null
    const numAmount = parseInt(amount) / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(numAmount)
  }

  const formattedAmount = formatAmount(amount, currency)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] flex items-center justify-center p-6">
      {/* Sparkle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-bounce delay-100">
          <Sparkles className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-bounce delay-300">
          <Sparkles className="w-4 h-4 text-white/40" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-500">
          <Sparkles className="w-5 h-5 text-white/30" />
        </div>
        <div className="absolute top-2/3 right-1/4 animate-bounce delay-700">
          <Sparkles className="w-6 h-6 text-white/20" />
        </div>
        <div className="absolute bottom-1/4 right-1/2 animate-bounce delay-1000">
          <Sparkles className="w-4 h-4 text-white/30" />
        </div>
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 relative">
            <CheckCircle className="w-12 h-12 text-white" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-white/90 animate-fade-in-up [animation-delay:200ms] opacity-0">
            Thank you for your purchase. Your transaction has been completed successfully.
          </p>
        </div>

        {/* Payment details */}
        <Card className="bg-[#1F1F1F] border-white/10 shadow-2xl mb-8 animate-fade-in-up [animation-delay:400ms] opacity-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session_id && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction ID</span>
                <Badge variant="secondary" className="bg-gray-700 text-white font-mono text-xs">
                  {session_id.slice(-12)}
                </Badge>
              </div>
            )}
            {formattedAmount && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-white font-semibold text-lg">{formattedAmount}</span>
              </div>
            )}
            {plan_name && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan</span>
                <Badge className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/80">{plan_name}</Badge>
              </div>
            )}
            {subscription_id && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subscription ID</span>
                <Badge variant="secondary" className="bg-gray-700 text-white font-mono text-xs">
                  {subscription_id.slice(-12)}
                </Badge>
              </div>
            )}
            {customer_email && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{customer_email}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <span className="text-gray-400">Status</span>
              <Badge className="bg-green-500 hover:bg-green-500/80">Completed</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Next steps */}
        <Card className="bg-[#1F1F1F] border-white/10 shadow-2xl mb-8 animate-fade-in-up [animation-delay:600ms] opacity-0">
          <CardHeader>
            <CardTitle className="text-white">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2" />
                <span>You will receive a confirmation email shortly with your receipt</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2" />
                <span>Your account has been upgraded with the new features</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2" />
                <span>You can start using your new plan immediately</span>
              </li>
              {subscription_id && (
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2" />
                  <span>Your subscription will auto-renew based on your plan</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:800ms] opacity-0">
          <Button asChild className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105">
            <Link href="/dashboard" className="flex items-center gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all duration-200">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in-up [animation-delay:1000ms] opacity-0">
          <p className="text-white/70 text-sm">
            Need help? Contact our support team at support@example.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your success page...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
