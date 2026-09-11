-- PawSearch protected messaging.
-- Run before testing the new /messages routes.
-- Legacy found_reports tables are intentionally left untouched.

create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  dog_id uuid references public.dogs(id) on delete cascade not null,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  requester_name text not null,
  dog_name text not null,
  initial_message text not null,
  status text not null default 'pending',
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  accepted_at timestamp with time zone,
  declined_at timestamp with time zone,
  constraint conversations_status_check
    check (status in ('pending', 'accepted', 'declined')),
  constraint conversations_people_check
    check (requester_id <> owner_id),
  constraint conversations_initial_message_check
    check (char_length(btrim(initial_message)) between 2 and 2000),
  constraint one_request_per_user_per_dog
    unique (dog_id, requester_id)
);

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint messages_body_check
    check (char_length(btrim(body)) between 2 and 2000)
);

create index if not exists conversations_owner_id_idx
  on public.conversations(owner_id);
create index if not exists conversations_requester_id_idx
  on public.conversations(requester_id);
create index if not exists conversations_dog_id_idx
  on public.conversations(dog_id);
create index if not exists messages_conversation_id_created_at_idx
  on public.messages(conversation_id, created_at);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Participants can view conversations" on public.conversations;
create policy "Participants can view conversations"
on public.conversations for select to authenticated
using (auth.uid() = requester_id or auth.uid() = owner_id);

drop policy if exists "Users can create one message request" on public.conversations;
create policy "Users can create one message request"
on public.conversations for insert to authenticated
with check (
  auth.uid() = requester_id
  and requester_id <> owner_id
  and status = 'pending'
  and owner_id = (
    select dogs.owner_id
    from public.dogs
    where dogs.id = conversations.dog_id
      and dogs.status in ('missing', 'spotted')
  )
);

drop policy if exists "Owners can respond to requests" on public.conversations;
create policy "Owners can respond to requests"
on public.conversations for update to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Participants can view accepted messages" on public.messages;
create policy "Participants can view accepted messages"
on public.messages for select to authenticated
using (
  exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.status = 'accepted'
      and (
        conversations.requester_id = auth.uid()
        or conversations.owner_id = auth.uid()
      )
  )
);

drop policy if exists "Participants can send accepted messages" on public.messages;
create policy "Participants can send accepted messages"
on public.messages for insert to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.status = 'accepted'
      and (
        conversations.requester_id = auth.uid()
        or conversations.owner_id = auth.uid()
      )
  )
);

create or replace function public.prevent_conversation_identity_changes()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.dog_id <> old.dog_id
     or new.requester_id <> old.requester_id
     or new.owner_id <> old.owner_id
     or new.initial_message <> old.initial_message
     or new.requester_name <> old.requester_name
     or new.dog_name <> old.dog_name
  then
    raise exception 'Conversation identity fields cannot be changed.';
  end if;

  if old.status in ('accepted', 'declined') and new.status <> old.status then
    raise exception 'A resolved message request cannot be reopened.';
  end if;

  if old.status = 'pending' and new.status <> old.status and auth.uid() <> old.owner_id then
    raise exception 'Only the pet owner can accept or decline this request.';
  end if;

  return new;
end;
$$;

drop trigger if exists conversations_identity_guard on public.conversations;
create trigger conversations_identity_guard
before update on public.conversations
for each row
execute function public.prevent_conversation_identity_changes();
