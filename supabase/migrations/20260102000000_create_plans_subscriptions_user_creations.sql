-- Create plans table
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert static values: free and pro
insert into public.plans (name) values ('free');
insert into public.plans (name) values ('pro');

-- Create subscription table
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null default current_date,
  end_date date,
  status text not null check (status in ('active', 'pending', 'cancelled', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for subscriptions
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_plan_id_idx on public.subscriptions(plan_id);
create index subscriptions_status_idx on public.subscriptions(status);

-- Create updated_at trigger for subscriptions
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.handle_updated_at();

-- Create user_creations table
create table public.user_creations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  palettes integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for user_creations
create index user_creations_user_id_idx on public.user_creations(user_id);

-- Create updated_at trigger for user_creations
create trigger set_user_creations_updated_at
  before update on public.user_creations
  for each row
  execute function public.handle_updated_at();

-- Function to automatically create subscription with free plan on user signup
create or replace function public.handle_new_user_subscription()
returns trigger as $$
declare
  free_plan_id uuid;
begin
  -- Get the free plan id
  select id into free_plan_id
  from public.plans
  where name = 'free'
  limit 1;

  -- If free plan exists, create subscription
  if free_plan_id is not null then
    insert into public.subscriptions (
      plan_id,
      user_id,
      start_date,
      end_date,
      status
    ) values (
      free_plan_id,
      new.id,
      current_date,
      null,
      'active'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users to create subscription when user signs up
create trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row
  execute function public.handle_new_user_subscription();

