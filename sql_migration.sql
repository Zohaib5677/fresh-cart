-- Add delivery_fee to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC;

-- Optional: ensure orders can save the screenshot and notes
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
