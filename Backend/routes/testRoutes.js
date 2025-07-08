const express = require("express");
const router = express.Router();
const { sendMail } = require("../utils/mailer");


router.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ msg: "Missing fields" });
  }

  try {
    await sendMail(to, subject, message);
    res.status(200).json({ msg: "✅ Email sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "❌ Failed to send email", error: err.message });
  }
});

module.exports = router;
