-- Add Stripe Price ID to plans table
ALTER TABLE public.plans 
ADD COLUMN stripe_price_id TEXT;

-- Add Stripe fields to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT;

-- Create indexes for Stripe lookups
CREATE INDEX plans_stripe_price_id_idx ON public.plans(stripe_price_id) 
WHERE stripe_price_id IS NOT NULL;

CREATE INDEX subscriptions_stripe_customer_id_idx ON public.subscriptions(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX subscriptions_stripe_subscription_id_idx ON public.subscriptions(stripe_subscription_id) 
WHERE stripe_subscription_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.plans.stripe_price_id IS 'Stripe Price ID for this plan (used in checkout sessions)';
COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS 'Stripe Customer ID for this subscription';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'Stripe Subscription ID';







