-- Add 'tool-response' role to messages table
alter table public.messages 
  drop constraint messages_role_check;

alter table public.messages 
  add constraint messages_role_check 
  check (role in ('user', 'assistant', 'tool', 'tool-response'));
