import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const signature = req.headers.get("svix-signature");
    if (!signature) {
      throw new Error("No webhook signature found");
    }
    
    // In a real scenario, you'd use the Svix library to verify the payload here
    // using the Clerk Webhook Secret.
    const payload = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (payload.type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = payload.data;
      const email = email_addresses?.[0]?.email_address;
      
      const { error } = await supabase
        .from('users') // Assuming a public.users sync table
        .insert({
          id, // Storing Clerk's text ID 
          email,
          full_name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error("Failed to sync user to Supabase:", error);
        throw error;
      }
      
      console.log(`Successfully synced user ${id} to Supabase`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
