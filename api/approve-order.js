import { put } from "@vercel/blob";
import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      phone,
      email,
      order,
      approved,
      marketing_permission
    } = req.body;

    const timestamp = new Date().toISOString();

    const record = {
      name,
      phone,
      email,
      order,
      approved,
      marketing_permission,
      timestamp,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      user_agent: req.headers["user-agent"]
    };

    // ---------- SAVE JSON TO VERCEL BLOB ----------
    const filename = `approval-${timestamp.replace(/[:.]/g, "-")}.json`;

    await put(`new-orders/${filename}`, JSON.stringify(record, null, 2), {
      access: "public",
      contentType: "application/json"
    });

    // ---------- SEND TWILIO SMS ----------
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const smsBody = `
New Order Approval
Name: ${name}
Order: ${order}
Approved: ${approved}
Marketing: ${marketing_permission}
Phone: ${phone || "none"}
Email: ${email || "none"}
    `.trim();

    await client.messages.create({
      body: smsBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TWILIO_TO_NUMBER
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Approval error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}