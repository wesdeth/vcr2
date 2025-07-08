import Stripe from 'stripe';

// Environment variable validation
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// TypeScript types for common Stripe objects
export interface StripePrice {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme: 'per_unit' | 'tiered';
  currency: string;
  metadata: Record<string, string>;
  nickname?: string;
  product: string | Stripe.Product;
  recurring?: {
    aggregate_usage?: 'last_during_period' | 'last_ever' | 'max' | 'sum';
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    trial_period_days?: number;
    usage_type: 'licensed' | 'metered';
  };
  type: 'one_time' | 'recurring';
  unit_amount: number;
  unit_amount_decimal?: string;
}

export interface StripeProduct {
  id: string;
  object: 'product';
  active: boolean;
  created: number;
  description?: string;
  images: string[];
  metadata: Record<string, string>;
  name: string;
  updated: number;
}

export interface StripeSubscription {
  id: string;
  object: 'subscription';
  application?: string;
  billing_cycle_anchor: number;
  cancel_at?: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  created: number;
  current_period_end: number;
  current_period_start: number;
  customer: string | Stripe.Customer;
  description?: string;
  ended_at?: number;
  items: Stripe.ApiList<Stripe.SubscriptionItem>;
  metadata: Record<string, string>;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'paused' | 'trialing' | 'unpaid';
}

export interface StripeCustomer {
  id: string;
  object: 'customer';
  address?: Stripe.Address;
  balance: number;
  created: number;
  currency?: string;
  email?: string;
  metadata: Record<string, string>;
  name?: string;
  phone?: string;
}

export interface StripePaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  customer?: string | Stripe.Customer;
  description?: string;
  metadata: Record<string, string>;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
}

// Pricing tier configuration
export interface PricingTier {
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  stripeProductId: string;
  popular?: boolean;
  maxUsers?: number;
  maxProjects?: number;
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  basic: {
    name: 'Basic',
    description: 'Perfect for getting started',
    price: 999, // $9.99 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      '10GB storage',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || 'price_basic',
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRODUCT_ID || 'prod_basic',
    maxUsers: 1,
    maxProjects: 5,
  },
  pro: {
    name: 'Pro',
    description: 'For growing teams and businesses',
    price: 2999, // $29.99 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '100GB storage',
      'Team collaboration',
      'Custom integrations',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID || 'prod_pro',
    popular: true,
    maxUsers: 10,
    maxProjects: -1, // Unlimited
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 9999, // $99.99 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom contracts',
      'Unlimited storage',
      'Advanced security',
      'On-premise deployment',
      'SLA guarantee',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRODUCT_ID || 'prod_enterprise',
    maxUsers: -1, // Unlimited
    maxProjects: -1, // Unlimited
  },
};

// Utility functions for formatting prices and currency
export const formatPrice = (
  amount: number,
  currency: string = 'usd',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`;
  }
};

export const formatCurrency = (
  amount: number,
  currency: string = 'usd',
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      ...options,
    }).format(amount / 100);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`;
  }
};

export const formatPriceWithInterval = (
  amount: number,
  interval: string,
  currency: string = 'usd',
  locale: string = 'en-US'
): string => {
  const price = formatPrice(amount, currency, locale);
  return `${price}/${interval}`;
};

export const parsePriceFromString = (priceString: string): number => {
  const numericValue = parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
  return Math.round(numericValue * 100);
};

// Utility function to get pricing tier by ID
export const getPricingTier = (tierId: string): PricingTier | null => {
  return PRICING_TIERS[tierId.toLowerCase()] || null;
};

// Utility function to get all pricing tiers as array
export const getAllPricingTiers = (): PricingTier[] => {
  return Object.values(PRICING_TIERS);
};

// Utility function to find tier by Stripe price ID
export const getTierByPriceId = (priceId: string): PricingTier | null => {
  return Object.values(PRICING_TIERS).find(tier => tier.stripePriceId === priceId) || null;
};

// Error handling utilities
export class StripeConfigError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StripeConfigError';
  }
}

export const handleStripeError = (error: unknown): StripeConfigError => {
  if (error instanceof Stripe.errors.StripeError) {
    return new StripeConfigError(
      `Stripe error: ${error.message}`,
      error.code || 'unknown_stripe_error'
    );
  }
  
  if (error instanceof Error) {
    return new StripeConfigError(error.message, 'generic_error');
  }
  
  return new StripeConfigError('Unknown stripe configuration error', 'unknown_error');
};

// Validation utilities
export const validateEnvironmentVariables = (): void => {
  const required = ['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new StripeConfigError(
      `Missing required environment variables: ${missing.join(', ')}`,
      'missing_env_vars'
    );
  }
};

// Initialize validation on module load
try {
  validateEnvironmentVariables();
} catch (error) {
  console.error('Stripe configuration error:', error);
  throw error;
}

// Export configuration object
export const stripeConfig = {
  stripe,
  PRICING_TIERS,
  formatPrice,
  formatCurrency,
  formatPriceWithInterval,
  parsePriceFromString,
  getPricingTier,
  getAllPricingTiers,
  getTierByPriceId,
  handleStripeError,
  validateEnvironmentVariables,
} as const;

export default stripeConfig;