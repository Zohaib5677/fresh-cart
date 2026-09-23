BEGIN;

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

CREATE POLICY "Admins can manage orders" ON public.orders
FOR ALL USING (has_role(((auth.jwt() ->> 'sub')::text), 'admin'::app_role));

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (has_role(((auth.jwt() ->> 'sub')::text), 'admin'::app_role));

CREATE POLICY "Admins can manage order items" ON public.order_items
FOR ALL USING (has_role(((auth.jwt() ->> 'sub')::text), 'admin'::app_role));

CREATE POLICY "Admins can view all order items" ON public.order_items
FOR SELECT USING (has_role(((auth.jwt() ->> 'sub')::text), 'admin'::app_role));

COMMIT;
