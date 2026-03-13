import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      phone,
      email,
      organization,
      marketingPermission,
      orderPermission,
      timestamp
    } = req.body;

    // Build the message text
    const message = `
New Order Approval
-------------------
Name: ${name}
Phone: ${phone}
Email: ${email}
Organization: ${organization}
Approved Order: ${orderPermission}
Marketing Permission: ${marketingPermission}
Time: ${timestamp}
    `.trim();

    // Create SMTP transporter using Porkbun settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send the email (which becomes a text via vtext)
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO, // 8129292115@vtext.com
      subject: "New Order Approval",
      text: message
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Approval error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}