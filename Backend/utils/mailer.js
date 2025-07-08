const nodemailer = require("nodemailer");
require("dotenv").config(); // At the top if not already included

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ⚠️ use App Password from Gmail
  },
});

exports.sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"SeedSwap 🌱" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};
