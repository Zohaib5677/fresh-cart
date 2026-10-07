-- Keep the display name separate from the Clerk ID used for ownership.
alter table public.conversations
  add column if not exists customer_name text;

-- Recover names for conversations that can be matched to an existing order.
-- Conversations without a matching order remain "Customer" until that user
-- sends another message after this migration is applied.
update public.conversations c
set customer_name = o.customer_name
from public.orders o
where c.customer_name is null
  and c.customer_user_id is not null
  and o.customer_name is not null
  and (
    o.user_id = c.customer_user_id
    or o.notes like '%[clerk:' || c.customer_user_id || ']%'
  );
