-- Function to check limit and auto-increment palettes count in user_creations when a palette is created
create or replace function public.handle_palette_created()
returns trigger as $$
declare
  project_user_id uuid;
  user_plan_name text;
  user_plan_end_date date;
  current_palettes_count integer;
  free_plan_id uuid;
begin
  -- Get the user_id from the project
  select user_id into project_user_id
  from public.projects
  where id = new.project_id;

  if project_user_id is null then
    raise exception 'Project not found';
  end if;

  -- Get user's current palettes count
  select palettes into current_palettes_count
  from public.user_creations
  where user_id = project_user_id;

  if current_palettes_count is null then
    raise exception 'User creations record not found';
  end if;

  -- Get free plan id
  select id into free_plan_id
  from public.plans
  where name = 'free'
  limit 1;

  -- Check if user has free plan
  -- Also check if subscription has expired (end_date < current_date)
  select p.name, s.end_date into user_plan_name, user_plan_end_date
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.user_id = project_user_id
    and s.status = 'active'
  order by s.created_at desc
  limit 1;

  -- If subscription has expired (end_date is in the past), downgrade to free
  if user_plan_name = 'pro' and user_plan_end_date is not null and user_plan_end_date < current_date then
    -- Get free plan id (reuse the variable already declared)
    select id into free_plan_id
    from public.plans
    where name = 'free'
    limit 1;
    
    -- Update subscription to free plan
    if free_plan_id is not null then
      update public.subscriptions
      set plan_id = free_plan_id, updated_at = now()
      where user_id = project_user_id
        and status = 'active'
        and plan_id = (select id from public.plans where name = 'pro' limit 1);
      
      -- Set plan to free for this check
      user_plan_name := 'free';
    end if;
  end if;

  -- Only restrict free plan users. Pro plan users have unlimited access.
  -- If user has free plan (or no subscription, default to free) and already has 5 or more palettes, prevent creation
  if (user_plan_name = 'free' or user_plan_name is null) and current_palettes_count >= 5 then
    raise exception 'Free plan limit reached. Maximum 5 palettes allowed. Please upgrade to Pro plan for unlimited palettes.';
  end if;
  
  -- Pro plan users can create unlimited palettes, no restriction needed

  -- If limit check passes, increment palettes count
  update public.user_creations
  set palettes = palettes + 1
  where user_id = project_user_id;

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on palettes table to check limit and increment count when palette is created
create trigger on_palette_created_increment
  before insert on public.palettes
  for each row
  execute function public.handle_palette_created();

