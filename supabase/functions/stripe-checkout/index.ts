import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, orderId, customerEmail, deliveryFee } = await req.json();
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase admin client to fetch trusted prices
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch product details for security based on incoming IDs
    const productIds = items.map((i: any) => i.productId);
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', productIds);

    if (productError || !products || products.length === 0) {
      throw new Error("Failed to fetch products or products not found");
    }

    const lineItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
         throw new Error(`Product with ID ${item.productId} not found`);
      }
      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: product.name,
          },
          // Ensure calculation on the server side using the database price
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "pkr",
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout?payment=stripe_success`,
      cancel_url: `${origin}/checkout?payment=cancelled`,
      customer_email: customerEmail || undefined,
      client_reference_id: orderId, // BEST PRACTICE: Links Stripe session to order DB ID
      metadata: {
        orderId, 
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating stripe session:", error);
    // Explicit return casting so error isn't ambiguous
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
