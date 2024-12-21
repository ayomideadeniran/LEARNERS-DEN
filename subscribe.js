const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address" });
  }


  try {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


    // Email to yourself
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Send to yourself
      subject: "New Subscriber",
      text: `You have a new subscriber: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to subscribe" });
  }
});

module.exports = router;



