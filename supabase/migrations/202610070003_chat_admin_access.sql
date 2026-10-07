-- The frontend recognizes the configured store owner by email, but the
-- database policies also need to recognize that same Clerk identity.
-- Keep the user_roles check for additional admins.

create or replace function public.is_chat_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    (auth.jwt() ->> 'email') = 'm.zohaib5677@gmail.com'
    or public.has_role((auth.jwt() ->> 'sub'), 'admin');
$$;

drop policy if exists "customers_read_own_or_admin_conversations" on public.conversations;
create policy "customers_read_own_or_admin_conversations"
  on public.conversations for select
  using (
    customer_user_id = (select auth.jwt() ->> 'sub')
    or public.is_chat_admin()
  );

drop policy if exists "customers_update_own_or_admin_conversations" on public.conversations;
create policy "customers_update_own_or_admin_conversations"
  on public.conversations for update
  using (
    customer_user_id = (select auth.jwt() ->> 'sub')
    or public.is_chat_admin()
  )
  with check (
    customer_user_id = (select auth.jwt() ->> 'sub')
    or public.is_chat_admin()
  );

drop policy if exists "customers_read_own_or_admin_messages" on public.conversation_messages;
create policy "customers_read_own_or_admin_messages"
  on public.conversation_messages for select
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and (
          c.customer_user_id = (select auth.jwt() ->> 'sub')
          or public.is_chat_admin()
        )
    )
  );

drop policy if exists "customers_create_own_or_admin_messages" on public.conversation_messages;
create policy "customers_create_own_or_admin_messages"
  on public.conversation_messages for insert
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and (
          c.customer_user_id = (select auth.jwt() ->> 'sub')
          or public.is_chat_admin()
        )
    )
  );
