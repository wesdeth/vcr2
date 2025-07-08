import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

interface WebhookEvent {
  id: string
  object: 'event'
  api_version: string
  created: number
  data: {
    object: any
    previous_attributes?: any
  }
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string | null
    idempotency_key: string | null
  }
  type: string
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing successful payment:', paymentIntent.id)
  
  try {
    // Extract customer and payment details
    const customerId = paymentIntent.customer as string
    const amount = paymentIntent.amount
    const currency = paymentIntent.currency
    const description = paymentIntent.description
    
    // Example: Update user's subscription or credits
    // await updateUserCredits(customerId, amount)
    
    console.log(`Payment processed: ${amount / 100} ${currency.toUpperCase()} for customer ${customerId}`)
    
    // Example server action call
    // await processPayment({
    //   paymentIntentId: paymentIntent.id,
    //   customerId,
    //   amount,
    //   currency,
    //   description
    // })
    
  } catch (error) {
    console.error('Error processing payment intent:', error)
    throw error
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing failed payment:', paymentIntent.id)
  
  try {
    const customerId = paymentIntent.customer as string
    const lastPaymentError = paymentIntent.last_payment_error
    
    console.error(`Payment failed for customer ${customerId}:`, lastPaymentError?.message)
    
    // Example: Notify user of failed payment
    // await notifyPaymentFailure(customerId, lastPaymentError?.message)
    
  } catch (error) {
    console.error('Error processing failed payment:', error)
    throw error
  }
}

async function handleCustomerSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing new subscription:', subscription.id)
  
  try {
    const customerId = subscription.customer as string
    const subscriptionId = subscription.id
    const status = subscription.status
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
    
    // Example: Create or update user subscription record
    // await createUserSubscription({
    //   customerId,
    //   subscriptionId,
    //   status,
    //   currentPeriodEnd,
    //   planId: subscription.items.data[0].price.id
    // })
    
    console.log(`Subscription created for customer ${customerId}: ${subscriptionId}`)
    
  } catch (error) {
    console.error('Error processing subscription creation:', error)
    throw error
  }
}

async function handleCustomerSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription update:', subscription.id)
  
  try {
    const customerId = subscription.customer as string
    const subscriptionId = subscription.id
    const status = subscription.status
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
    
    // Example: Update user subscription record
    // await updateUserSubscription({
    //   subscriptionId,
    //   status,
    //   currentPeriodEnd
    // })
    
    console.log(`Subscription updated for customer ${customerId}: ${subscriptionId} - Status: ${status}`)
    
  } catch (error) {
    console.error('Error processing subscription update:', error)
    throw error
  }
}

async function handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deletion:', subscription.id)
  
  try {
    const customerId = subscription.customer as string
    const subscriptionId = subscription.id
    
    // Example: Cancel user subscription record
    // await cancelUserSubscription(subscriptionId)
    
    console.log(`Subscription cancelled for customer ${customerId}: ${subscriptionId}`)
    
  } catch (error) {
    console.error('Error processing subscription deletion:', error)
    throw error
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing successful invoice payment:', invoice.id)
  
  try {
    const customerId = invoice.customer as string
    const subscriptionId = invoice.subscription as string
    const amountPaid = invoice.amount_paid
    const currency = invoice.currency
    
    // Example: Update subscription status and billing
    // await updateSubscriptionBilling({
    //   subscriptionId,
    //   lastPaymentDate: new Date(),
    //   amountPaid,
    //   currency
    // })
    
    console.log(`Invoice payment succeeded for customer ${customerId}: ${amountPaid / 100} ${currency.toUpperCase()}`)
    
  } catch (error) {
    console.error('Error processing invoice payment:', error)
    throw error
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing failed invoice payment:', invoice.id)
  
  try {
    const customerId = invoice.customer as string
    const subscriptionId = invoice.subscription as string
    const attemptCount = invoice.attempt_count
    
    // Example: Handle failed payment (retry, suspend account, etc.)
    // await handleInvoiceFailure({
    //   customerId,
    //   subscriptionId,
    //   attemptCount,
    //   invoiceId: invoice.id
    // })
    
    console.error(`Invoice payment failed for customer ${customerId}. Attempt: ${attemptCount}`)
    
  } catch (error) {
    console.error('Error processing failed invoice:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  console.log('Webhook received:', new Date().toISOString())
  
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text()
    const signature = headers().get('stripe-signature')
    
    if (!signature) {
      console.error('Missing Stripe signature header')
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      )
    }

    if (!endpointSecret) {
      console.error('Missing Stripe webhook secret')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify the webhook signature
    let event: WebhookEvent
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret
      ) as WebhookEvent
    } catch (err) {
      const error = err as Error
      console.error('Webhook signature verification failed:', error.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Processing webhook event:', {
      id: event.id,
      type: event.type,
      created: new Date(event.created * 1000).toISOString(),
      livemode: event.livemode
    })

    // Process the event based on its type
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
          break
          
        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
          break
          
        case 'customer.subscription.created':
          await handleCustomerSubscriptionCreated(event.data.object as Stripe.Subscription)
          break
          
        case 'customer.subscription.updated':
          await handleCustomerSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break
          
        case 'customer.subscription.deleted':
          await handleCustomerSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break
          
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
          break
          
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
          break
          
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session
          console.log('Checkout session completed:', session.id)
          
          // Example: Handle successful checkout
          // if (session.mode === 'subscription') {
          //   await handleSubscriptionCheckout(session)
          // } else if (session.mode === 'payment') {
          //   await handleOneTimePayment(session)
          // }
          break
          
        case 'customer.created':
          const customer = event.data.object as Stripe.Customer
          console.log('New customer created:', customer.id, customer.email)
          
          // Example: Sync customer data
          // await syncStripeCustomer(customer)
          break
          
        case 'price.created':
        case 'price.updated':
          const price = event.data.object as Stripe.Price
          console.log(`Price ${event.type}:`, price.id, price.unit_amount, price.currency)
          
          // Example: Sync pricing data
          // await syncPriceData(price)
          break
          
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }
      
      console.log('Webhook event processed successfully:', event.id)
      
      return NextResponse.json(
        { received: true, eventId: event.id },
        { status: 200 }
      )
      
    } catch (processingError) {
      console.error('Error processing webhook event:', {
        eventId: event.id,
        eventType: event.type,
        error: processingError
      })
      
      // Return 500 to let Stripe know to retry the webhook
      return NextResponse.json(
        { 
          error: 'Processing failed',
          eventId: event.id,
          eventType: event.type
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Webhook error:', error)
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}