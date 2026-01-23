import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface ResendResponse {
  data?: { id: string } | null;
  error?: { message: string } | null;
}

const sendEmail = async (to: string, subject: string, html: string): Promise<ResendResponse> => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "BookPard <notifications@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: { message: data.message || "Failed to send email" } };
  }
  return { data: { id: data.id } };
};



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "order_update" | "price_drop" | "back_in_stock" | "low_stock";
  recipientEmail: string;
  recipientName?: string;
  data: Record<string, any>;
}

const getEmailContent = (type: string, data: Record<string, any>) => {
  switch (type) {
    case "order_update":
      return {
        subject: `Order Update - ${data.orderId?.slice(0, 8)}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Order Status Update</h1>
            <p>Your order <strong>#${data.orderId?.slice(0, 8)}</strong> has been updated.</p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0;"><strong>New Status:</strong> ${data.status}</p>
              ${data.trackingNumber ? `<p style="margin: 8px 0 0;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ""}
              ${data.carrier ? `<p style="margin: 8px 0 0;"><strong>Carrier:</strong> ${data.carrier}</p>` : ""}
              ${data.estimatedDelivery ? `<p style="margin: 8px 0 0;"><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ""}
            </div>
            <p style="color: #666;">Thank you for shopping with BookPard!</p>
          </div>
        `,
      };

    case "price_drop":
      return {
        subject: `Price Drop Alert - ${data.bookTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">🎉 Price Drop Alert!</h1>
            <p>Good news! A book you're watching has dropped in price.</p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h2 style="margin: 0 0 8px; color: #333;">${data.bookTitle}</h2>
              <p style="margin: 0; color: #666;">by ${data.author}</p>
              <div style="margin-top: 12px;">
                <span style="text-decoration: line-through; color: #999;">₹${data.oldPrice}</span>
                <span style="font-size: 24px; font-weight: bold; color: #e11d48; margin-left: 8px;">₹${data.newPrice}</span>
              </div>
            </div>
            <a href="${data.link}" style="display: inline-block; background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View Book</a>
          </div>
        `,
      };

    case "back_in_stock":
      return {
        subject: `Back in Stock - ${data.bookTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">📚 Back in Stock!</h1>
            <p>A book you were interested in is now available.</p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h2 style="margin: 0 0 8px; color: #333;">${data.bookTitle}</h2>
              <p style="margin: 0; color: #666;">by ${data.author}</p>
              <p style="margin-top: 12px; font-size: 20px; font-weight: bold; color: #333;">₹${data.price}</p>
            </div>
            <a href="${data.link}" style="display: inline-block; background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Buy Now</a>
          </div>
        `,
      };

    case "low_stock":
      return {
        subject: `Low Stock Alert - ${data.bookTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">⚠️ Low Stock Alert</h1>
            <p>One of your listings is running low on stock.</p>
            <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #ffc107;">
              <h2 style="margin: 0 0 8px; color: #333;">${data.bookTitle}</h2>
              <p style="margin: 0; color: #856404;"><strong>Current Stock:</strong> ${data.stockQuantity} items</p>
              <p style="margin: 8px 0 0; color: #856404;"><strong>Threshold:</strong> ${data.threshold} items</p>
            </div>
            <p style="color: #666;">Consider restocking to avoid missing sales!</p>
          </div>
        `,
      };

    default:
      return {
        subject: "BookPard Notification",
        html: "<p>You have a new notification from BookPard.</p>",
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { type, recipientEmail, recipientName, data }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to ${recipientEmail}`);

    const emailContent = getEmailContent(type, data);

    const emailResponse = await sendEmail(recipientEmail, emailContent.subject, emailContent.html);

    console.log("Email sent successfully:", emailResponse);

    // Log the email
    await supabaseClient.from("email_logs").insert({
      user_id: data.userId || null,
      email_type: type,
      recipient_email: recipientEmail,
      subject: emailContent.subject,
      status: "sent",
      metadata: { resendId: emailResponse.data?.id },
    });

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
