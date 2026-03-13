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

    const message = `
New Order Approval
-------------------
Name: ${name}
Phone: ${phone}
Email: ${email}
Order: ${order}
Approved: ${approved}
Marketing: ${marketing_permission}
Time: ${timestamp}
    `.trim();

    // Send the user to a mailto link with the data
    const mailto = `mailto:fred.roth@gmail.com?subject=New Order Approval&body=${encodeURIComponent(message)}`;

    return res.status(200).json({ success: true, redirect: mailto });

  } catch (err) {
    console.error("Approval error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}