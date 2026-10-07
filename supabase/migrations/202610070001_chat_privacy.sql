-- Restrict support chats to their customer and store admins.
-- The Clerk JWT `sub` is used as the customer_user_id.

drop policy if exists "dev_all_conversations" on public.conversations;
drop policy if exists "dev_all_conversation_messages" on public.conversation_messages;

create policy "customers_read_own_or_admin_conversations"
  on public.conversations for select
  using (
    customer_user_id = (select auth.jwt() ->> 'sub')
    or public.has_role((select auth.jwt() ->> 'sub'), 'admin')
  );

create policy "customers_create_own_conversations"
  on public.conversations for insert
  with check (customer_user_id = (select auth.jwt() ->> 'sub'));

create policy "customers_update_own_or_admin_conversations"
  on public.conversations for update
  using (
    customer_user_id = (select auth.jwt() ->> 'sub')
    or public.has_role((select auth.jwt() ->> 'sub'), 'admin')
  )
  with check (
    customer_user_id = (select auth.jwt() ->> 'sub')
    or public.has_role((select auth.jwt() ->> 'sub'), 'admin')
  );

create policy "customers_read_own_or_admin_messages"
  on public.conversation_messages for select
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and (
          c.customer_user_id = (select auth.jwt() ->> 'sub')
          or public.has_role((select auth.jwt() ->> 'sub'), 'admin')
        )
    )
  );

create policy "customers_create_own_or_admin_messages"
  on public.conversation_messages for insert
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and (
          c.customer_user_id = (select auth.jwt() ->> 'sub')
          or public.has_role((select auth.jwt() ->> 'sub'), 'admin')
        )
    )
  );
