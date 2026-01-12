-- Update the pro plan with your Stripe Price ID
UPDATE public.plans 
SET stripe_price_id = 'price_1SmdnA2XngowQwfMPutHndFh' 
WHERE name = 'pro';

-- Verify the update
SELECT id, name, stripe_price_id 
FROM public.plans 
WHERE name = 'pro';

