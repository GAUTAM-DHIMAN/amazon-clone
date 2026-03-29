import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ ADDED: verify connection (helps debug)
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email config error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

export async function sendOrderEmail(to, order, items) {
  // ✅ DEBUG LOGS (VERY IMPORTANT)
  console.log("Sending email...");
  console.log("TO:", to);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌"
  );

  const itemsHtml = items
    .map(
      (item) =>
        `<li>${item.productId} (x${item.quantity}) - ₹${item.unitPrice}</li>`
    )
    .join("");

  try {
    const info = await transporter.sendMail({
      from: `"Amazon Clone" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed (#${order.id})`,
      html: `
        <h2>Order Confirmed 🎉</h2>
        <p>Your order ID: <b>${order.id}</b></p>
        <ul>${itemsHtml}</ul>
        <p>Total: ₹${order.total}</p>
      `,
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
}