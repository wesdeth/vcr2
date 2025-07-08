import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

interface CreateCheckoutSessionRequest {
  priceId: string
  quantity?: number
  metadata?: Record<string, string>
  customerId?: string
  customerEmail?: string
  mode?: 'payment' | 'subscription' | 'setup'
}

interface CheckoutSessionResponse {
  sessionId: string
  url: string
}

interface ErrorResponse {
  error: string
  message: string
}

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
]

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  
  if (!origin) {
    return true // Allow requests without origin (e.g., same-origin requests)
  }

  return ALLOWED_ORIGINS.includes(origin)
}

function validateRequestBody(body: any): body is CreateCheckoutSessionRequest {
  if (!body || typeof body !== 'object') {
    return false
  }

  if (!body.priceId || typeof body.priceId !== 'string') {
    return false
  }

  if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity < 1)) {
    return false
  }

  if (body.metadata !== undefined && typeof body.metadata !== 'object') {
    return false
  }

  if (body.customerId !== undefined && typeof body.customerId !== 'string') {
    return false
  }

  if (body.customerEmail !== undefined && typeof body.customerEmail !== 'string') {
    return false
  }

  if (body.mode !== undefined && !['payment', 'subscription', 'setup'].includes(body.mode)) {
    return false
  }

  return true
}

function setCorsHeaders(response: NextResponse): NextResponse {
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  
  return response
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  return setCorsHeaders(response)
}

export async function POST(request: NextRequest) {
  try {
    // Validate origin
    if (!validateOrigin(request)) {
      console.error('Invalid origin:', request.headers.get('origin'))
      const errorResponse: ErrorResponse = {
        error: 'FORBIDDEN',
        message: 'Request from unauthorized origin'
      }
      const response = NextResponse.json(errorResponse, { status: 403 })
      return setCorsHeaders(response)
    }

    // Parse and validate request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      console.error('Invalid JSON in request body:', error)
      const errorResponse: ErrorResponse = {
        error: 'INVALID_JSON',
        message: 'Request body must be valid JSON'
      }
      const response = NextResponse.json(errorResponse, { status: 400 })
      return setCorsHeaders(response)
    }

    if (!validateRequestBody(body)) {
      console.error('Invalid request body:', body)
      const errorResponse: ErrorResponse = {
        error: 'INVALID_REQUEST',
        message: 'Request body validation failed. Required: priceId (string). Optional: quantity (number), metadata (object), customerId (string), customerEmail (string), mode (payment|subscription|setup)'
      }
      const response = NextResponse.json(errorResponse, { status: 400 })
      return setCorsHeaders(response)
    }

    const {
      priceId,
      quantity = 1,
      metadata = {},
      customerId,
      customerEmail,
      mode = 'payment'
    }: CreateCheckoutSessionRequest = body

    // Validate environment variables
    const successUrl = process.env.STRIPE_SUCCESS_URL || `${process.env.NEXT_PUBLIC_APP_URL}/success`
    const cancelUrl = process.env.STRIPE_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL}/cancel`

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY environment variable is not set')
      const errorResponse: ErrorResponse = {
        error: 'SERVER_CONFIG_ERROR',
        message: 'Payment system configuration error'
      }
      const response = NextResponse.json(errorResponse, { status: 500 })
      return setCorsHeaders(response)
    }

    // Create checkout session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata,
    }

    // Add customer information if provided
    if (customerId) {
      sessionParams.customer = customerId
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    // Add subscription-specific settings
    if (mode === 'subscription') {
      sessionParams.billing_address_collection = 'auto'
      sessionParams.payment_method_collection = 'if_required'
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.id || !session.url) {
      console.error('Stripe session creation failed - missing id or url:', session)
      const errorResponse: ErrorResponse = {
        error: 'STRIPE_ERROR',
        message: 'Failed to create checkout session'
      }
      const response = NextResponse.json(errorResponse, { status: 500 })
      return setCorsHeaders(response)
    }

    console.log('Checkout session created successfully:', {
      sessionId: session.id,
      priceId,
      quantity,
      mode,
      customerId: customerId || 'none',
      customerEmail: customerEmail || 'none'
    })

    const successResponse: CheckoutSessionResponse = {
      sessionId: session.id,
      url: session.url
    }

    const response = NextResponse.json(successResponse, { status: 200 })
    return setCorsHeaders(response)

  } catch (error: any) {
    console.error('Error creating checkout session:', {
      error: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code
    })

    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      const errorResponse: ErrorResponse = {
        error: 'STRIPE_INVALID_REQUEST',
        message: error.message || 'Invalid request to payment processor'
      }
      const response = NextResponse.json(errorResponse, { status: 400 })
      return setCorsHeaders(response)
    }

    if (error.type === 'StripeAuthenticationError') {
      const errorResponse: ErrorResponse = {
        error: 'STRIPE_AUTH_ERROR',
        message: 'Payment processor authentication failed'
      }
      const response = NextResponse.json(errorResponse, { status: 500 })
      return setCorsHeaders(response)
    }

    if (error.type === 'StripeRateLimitError') {
      const errorResponse: ErrorResponse = {
        error: 'RATE_LIMIT_ERROR',
        message: 'Too many requests. Please try again later.'
      }
      const response = NextResponse.json(errorResponse, { status: 429 })
      return setCorsHeaders(response)
    }

    // Generic error response
    const errorResponse: ErrorResponse = {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred while creating the checkout session'
    }
    const response = NextResponse.json(errorResponse, { status: 500 })
    return setCorsHeaders(response)
  }
}