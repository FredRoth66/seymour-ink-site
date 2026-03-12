// /api/contact.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const smsAddress = process.env.VERIZON_SMS_ADDRESS; // e.g. 8129292115@vtext.com

    const textBody = `New message from Seymour.Ink:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: smsAddress,
      subject: 'New Seymour.Ink message',
      text: textBody
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}