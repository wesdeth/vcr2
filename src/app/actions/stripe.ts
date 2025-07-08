'use server';

import Stripe from 'stripe';
import { z } from 'zod';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil', // ✅ Fixed version
});

// Type definitions
export type PaymentResult = {
  success: boolean;
  error?: string;
  data?: any;
};

export type CheckoutSessionResult = {
  success: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
};

export type CustomerResult = {
  success: boolean;
  customerId?: string;
  error?: string;
};

export type SubscriptionResult = {
  success: boolean;
  subscriptionId?: string;
  error?: string;
};

// Validation schemas
const PaymentIntentSchema = z.object({
  amount: z.number().min(50),
  currency: z.string().default('usd'),
  customerId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

const CheckoutSessionSchema = z.object({
  priceId: z.string(),
  customerId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  mode: z.enum(['payment', 'subscription', 'setup']).default('payment'),
  metadata: z.record(z.string()).optional(),
});

const CustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

const SubscriptionSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
  metadata: z.record(z.string()).optional(),
  trialDays: z.number().optional(),
});

// Payment Intent Functions
export async function createPaymentIntent(
  input: z.infer<typeof PaymentIntentSchema>
): Promise<PaymentResult> {
  try {
    const validated = PaymentIntentSchema.parse(input);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validated.amount),
      currency: validated.currency,
      customer: validated.customerId,
      metadata: validated.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      data: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentResult> {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    return {
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount_received: paymentIntent.amount_received,
      },
    };
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<PaymentResult> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      },
    };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Checkout Session Functions
export async function createCheckoutSession(
  input: z.infer<typeof CheckoutSessionSchema>
): Promise<CheckoutSessionResult> {
  try {
    const validated = CheckoutSessionSchema.parse(input);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: validated.mode,
      success_url: validated.successUrl,
      cancel_url: validated.cancelUrl,
      line_items: [
        {
          price: validated.priceId,
          quantity: 1,
        },
      ],
      metadata: validated.metadata,
    };

    if (validated.customerId) {
      sessionParams.customer = validated.customerId;
    } else if (validated.customerEmail) {
      sessionParams.customer_email = validated.customerEmail;
    }

    if (validated.mode === 'subscription') {
      sessionParams.billing_address_collection = 'required';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      success: true,
      url: session.url || undefined,
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function retrieveCheckoutSession(
  sessionId: string
): Promise<PaymentResult> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription', 'payment_intent'],
    });

    return {
      success: true,
      data: {
        id: session.id,
        status: session.status,
        customer: session.customer,
        subscription: session.subscription,
        payment_intent: session.payment_intent,
        metadata: session.metadata,
      },
    };
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// ⬇️ The rest of your customer/subscription/webhook logic remains unchanged — keep it as-is.
