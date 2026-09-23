import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env variables manually from .env
const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.replace(/"/g, '').trim();
  return acc;
}, {} as Record<string, string>);

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_PUBLISHABLE_KEY']; // To bypass RLS and create tables ideally you'd use a SERVICE_ROLE key, but we will seed using standard insert if policies allow.

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Using Supabase URL:', supabaseUrl);

async function checkAndSeed() {
  console.log("Please run this SQL in your Supabase SQL Editor to create the products table First:");
  console.log(`
    create table if not exists public.products (
      id text primary key,
      name text not null,
      description text,
      price numeric not null,
      "originalPrice" numeric,
      "discountPercentage" numeric,
      category text,
      "imageUrl" text,
      "stockQuantity" numeric default 0,
      "isTopSelling" boolean default false,
      "isPromotional" boolean default false,
      rating numeric,
      "reviewCount" numeric default 0,
      unit text
    );

    -- Allow public read access to products
    create policy "Public can read products" on public.products for select using (true);
  `);
}

checkAndSeed();
