import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function contactEmailDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: "contact-email-dev",
    configureServer(server) {
      server.middlewares.use("/api/send-contact-email", (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== "POST") {
          next();
          return;
        }

        const chunks: Uint8Array[] = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const raw = Buffer.concat(chunks).toString("utf8");
            const { name, email, phone, subject, message } = JSON.parse(raw || "{}");
            const resendApiKey = env.RESEND_API_KEY;
            const senderEmail = env.RESEND_SENDER_EMAIL || "onboarding@resend.dev";
            const storeOwnerEmail = env.ADMIN_EMAIL || env.VITE_ADMIN_EMAIL;

            if (!resendApiKey || !storeOwnerEmail) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: "Email is not configured" }));
              return;
            }

            const response = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: `Contact Form <${senderEmail}>`,
                to: [storeOwnerEmail],
                reply_to: email,
                subject: `Contact Form: ${subject}`,
                html: `<h2>New Contact Form Message</h2>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p>${message}</p>`,
              }),
            });

            const result = await response.json();
            res.statusCode = response.ok ? 200 : 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response.ok ? { success: true } : { success: false, error: result }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: String(error) }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), contactEmailDevPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
