import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_KEY");

    if (!stripeSecret || !webhookSecret) {
      console.error("Stripe secrets not configured");
      return new Response(
        JSON.stringify({ error: "Stripe webhook not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: "2025-08-27.basil" });

    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    if (!sig) {
      console.error("Missing stripe-signature header");
      return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log("Received Stripe event:", event.type);

    let supabase: ReturnType<typeof createClient> | null = null;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        let fullSession: Stripe.Checkout.Session | null = null;
        try {
          fullSession = await stripe.checkout.sessions.retrieve(session.id as string, { expand: ["payment_intent"] });
        } catch (err) {
          console.error("Failed to retrieve session:", err);
        }

        const paymentIntent = (fullSession?.payment_intent as Stripe.PaymentIntent) || null;
        const orderId = fullSession?.metadata?.orderId || session?.metadata?.orderId || null;

        console.log("Checkout completed for session:", session.id, "orderId:", orderId);

        if (orderId && supabase) {
          try {
            const updates: any = {
              status: "paid",
              payment_provider: "stripe",
              payment_reference: paymentIntent?.id || session.payment_intent || session.id,
            };

            const { error } = await supabase.from("orders").update(updates).eq("id", orderId);
            if (error) {
              console.error("Failed to update order status in Supabase:", error);
            } else {
              console.log("Order marked paid:", orderId);
            }
          } catch (err) {
            console.error("Error updating order:", err);
          }
        }

        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent succeeded:", pi.id);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook handler error", details: errorMessage }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
