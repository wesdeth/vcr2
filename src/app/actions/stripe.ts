'use server';

import Stripe from 'stripe';
import { z } from 'zod';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
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

// Customer Functions
export async function createCustomer(
  input: z.infer<typeof CustomerSchema>
): Promise<CustomerResult> {
  try {
    const validated = CustomerSchema.parse(input);

    const customer = await stripe.customers.create({
      email: validated.email,
      name: validated.name,
      phone: validated.phone,
      metadata: validated.metadata,
    });

    return {
      success: true,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateCustomer(
  customerId: string,
  updates: Partial<z.infer<typeof CustomerSchema>>
): Promise<CustomerResult> {
  try {
    const customer = await stripe.customers.update(customerId, {
      ...updates,
    });

    return {
      success: true,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Error updating customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function retrieveCustomer(
  customerId: string
): Promise<PaymentResult> {
  try {
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      return {
        success: false,
        error: 'Customer has been deleted',
      };
    }

    return {
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        metadata: customer.metadata,
        created: customer.created,
      },
    };
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Subscription Functions
export async function createSubscription(
  input: z.infer<typeof SubscriptionSchema>
): Promise<SubscriptionResult> {
  try {
    const validated = SubscriptionSchema.parse(input);

    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: validated.customerId,
      items: [
        {
          price: validated.priceId,
        },
      ],
      metadata: validated.metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    };

    if (validated.trialDays) {
      subscriptionParams.trial_period_days = validated.trialDays;
    }

    const subscription = await stripe.subscriptions.create(subscriptionParams);

    return {
      success: true,
      subscriptionId: subscription.id,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<SubscriptionResult> {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId, {
      prorate: !immediately,
      invoice_now: immediately,
    });

    return {
      success: true,
      subscriptionId: subscription.id,
    };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateSubscription(
  subscriptionId: string,
  updates: {
    priceId?: string;
    metadata?: Record<string, string>;
  }
): Promise<SubscriptionResult> {
  try {
    const updateParams: Stripe.SubscriptionUpdateParams = {
      metadata: updates.metadata,
    };

    if (updates.priceId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      updateParams.items = [
        {
          id: subscription.items.data[0].id,
          price: updates.priceId,
        },
      ];
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      updateParams
    );

    return {
      success: true,
      subscriptionId: subscription.id,
    };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function retrieveSubscription(
  subscriptionId: string
): Promise<PaymentResult> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return {
      success: true,
      data: {
        id: subscription.id,
        status: subscription.status,
        customer: subscription.customer,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        trial_end: subscription.trial_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        metadata: subscription.metadata,
      },
    };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Webhook Functions
export async function constructWebhookEvent(
  payload: string,
  signature: string
): Promise<{ success: boolean; event?: Stripe.Event; error?: string }> {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return {
      success: true,
      event,
    };
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function handleWebhookEvent(
  event: Stripe.Event
): Promise<PaymentResult> {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        console.log(`Payment ${paymentIntent.id} succeeded`);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        // Handle failed payment
        console.log(`Payment ${failedPayment.id} failed`);
        break;

      case 'customer.subscription.created':
        const newSubscription = event.data.object as Stripe.Subscription;
        // Handle new subscription
        console.log(`Subscription ${newSubscription.id} created`);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        // Handle subscription update
        console.log(`Subscription ${updatedSubscription.id} updated`);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        // Handle subscription cancellation
        console.log(`Subscription ${deletedSubscription.id} deleted`);
        break;

      case 'invoice.payment_succeeded':
        const successfulInvoice = event.data.object as Stripe.Invoice;
        // Handle successful invoice payment
        console.log(`Invoice ${successfulInvoice.id} payment succeeded`);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        // Handle failed invoice payment
        console.log(`Invoice ${failedInvoice.id} payment failed`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return {
      success: true,
      data: {
        eventType: event.type,
        eventId: event.id,
        processed: true,
      },
    };
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Price and Product Functions
export async function retrievePrice(priceId: string): Promise<PaymentResult> {
  try {
    const price = await stripe.prices.retrieve(priceId);

    return {
      success: true,
      data: {
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring,
        product: price.product,
        metadata: price.metadata,
      },
    };
  } catch (error) {
    console.error('Error retrieving price:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function listPrices(
  productId?: string,
  active: boolean = true
): Promise<PaymentResult> {
  try {
    const params: Stripe.PriceListParams = {
      active,
      limit: 100,
    };

    if (productId) {
      params.product = productId;
    }

    const prices = await stripe.prices.list(params);

    return {
      success: true,
      data: {
        prices: prices.data.map((price) => ({
          id: price.id,
          unit_amount: price.unit_amount,
          currency: price.currency,
          recurring: price.recurring,
          product: price.product,
          metadata: price.metadata,
        })),
        has_more: prices.has_more,
      },
    };
  } catch (error) {
    console.error('Error listing prices:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}