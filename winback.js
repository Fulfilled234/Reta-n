require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ─── Meta Cloud API: Send Template Message ───────────────────────────────────
async function sendWhatsAppTemplate(to, templateName, components = []) {
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: "en_US" },
    },
  };

  // Only add components if provided (winback_message needs them, hello_world doesn't)
  if (components.length > 0) {
    body.template.components = components;
  }

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Meta API error");
  }

  return result;
}

// ─── Main Win-Back Job ────────────────────────────────────────────────────────
async function runWinBack() {
  console.log("🤖 Win-back job started...");

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("is_active", true);

  if (error || !businesses?.length) {
    console.log("No active businesses found.");
    return;
  }

  for (const business of businesses) {
    const thresholdDate = new Date();
    thresholdDate.setDate(
      thresholdDate.getDate() - business.inactivity_threshold_days
    );

    const { data: lostCustomers } = await supabase
      .from("customers")
      .select("*")
      .eq("business_id", business.id)
      .eq("status", "active")
      .lt("last_purchase_at", thresholdDate.toISOString());

    if (!lostCustomers?.length) {
      console.log(`✅ No lost customers for ${business.name}`);
      continue;
    }

    console.log(`📋 ${lostCustomers.length} lost customers for ${business.name}`);

    for (const customer of lostCustomers) {
      try {
        // Skip if already messaged in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: recentMessage } = await supabase
          .from("messages")
          .select("id")
          .eq("customer_id", customer.id)
          .gte("sent_at", sevenDaysAgo.toISOString())
          .single();

        if (recentMessage) {
          console.log(`⏭️ Already messaged ${customer.name} recently`);
          continue;
        }

        if (!customer.phone_number || customer.phone_number === "unknown") {
          console.log(`⚠️ No phone for ${customer.name} — skipping`);
          continue;
        }

        // Meta requires phone numbers without + prefix
        const formattedPhone = customer.phone_number.replace(/^\+/, "");

        // ── TEMPLATE SWITCH ──────────────────────────────────────────────────
        // Currently using hello_world (no variables needed).
        // Once winback_message template is APPROVED, switch to that:
        //
        // OPTION A — hello_world (active now):
        const templateName = "hello_world";
        const components = [];
        const messageContent = `[hello_world template] sent to ${customer.name}`;

        // OPTION B — winback_message (uncomment when template is Active):
        // const templateName = "winback_message";
        // const components = [{
        //   type: "body",
        //   parameters: [
        //     { type: "text", parameter_name: "customer_name", text: customer.name },
        //     { type: "text", parameter_name: "business_name", text: business.name },
        //   ],
        // }];
        // const messageContent = `Hi ${customer.name}, we miss you at ${business.name}!`;
        // ─────────────────────────────────────────────────────────────────────

        await sendWhatsAppTemplate(formattedPhone, templateName, components);
        console.log(`✅ Win-back sent to ${customer.name}`);

        // Log to messages table
        await supabase.from("messages").insert({
          customer_id: customer.id,
          business_id: business.id,
          content: messageContent,
          sent_at: new Date().toISOString(),
          customer_returned: false,
        });

        // Mark customer as lost
        await supabase
          .from("customers")
          .update({ status: "lost" })
          .eq("id", customer.id);

      } catch (err) {
        console.error(`❌ Error processing ${customer.name}:`, err.message);
      }
    }
  }

  console.log("✅ Win-back job complete.");
}

// Export for Vercel cron
module.exports = async (req, res) => {
  await runWinBack();
  res.status(200).json({ success: true });
};
