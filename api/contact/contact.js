import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure body is parsed even if coming from a static HTML page
  if (!req.body || typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      console.error('Body parse error:', e);
    }
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

    const toAddress = process.env.EMAIL_TO;

    const textBody = `New message from Seymour.Ink:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toAddress,
      subject: 'New Seymour.Ink message',
      text: textBody
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}