-- Function to automatically downgrade expired pro subscriptions to free plan
create or replace function public.handle_expired_subscriptions()
returns void as $$
declare
  free_plan_id uuid;
  pro_plan_id uuid;
  expired_count integer;
begin
  -- Get the free plan id
  select id into free_plan_id
  from public.plans
  where name = 'free'
  limit 1;

  -- Get the pro plan id
  select id into pro_plan_id
  from public.plans
  where name = 'pro'
  limit 1;

  if free_plan_id is null or pro_plan_id is null then
    raise exception 'Free or Pro plan not found';
  end if;

  -- Update expired pro subscriptions to free plan
  -- A subscription is expired if:
  -- 1. It has an end_date
  -- 2. end_date is in the past (before current_date)
  -- 3. It's currently active
  -- 4. It's a pro plan
  update public.subscriptions
  set 
    plan_id = free_plan_id,
    status = 'active',
    updated_at = now()
  where 
    plan_id = pro_plan_id
    and status = 'active'
    and end_date is not null
    and end_date < current_date;

  -- Get count of updated subscriptions
  get diagnostics expired_count = row_count;
  
  -- Log the result (optional, can be removed if not needed)
  raise notice 'Downgraded % expired pro subscriptions to free plan', expired_count;
end;
$$ language plpgsql security definer;

-- Create index on end_date for better performance when checking expired subscriptions
create index if not exists subscriptions_end_date_idx on public.subscriptions(end_date) 
where end_date is not null;

