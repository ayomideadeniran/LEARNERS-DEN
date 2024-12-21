require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files like CSS or JS

// Serve HTML Form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Serve the HTML file
});

// Handle Subscription
app.post("/subscribe", async (req, res) => {
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

    // Send email to yourself
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Send to your email
      subject: "New Subscriber",
      text: `You have a new subscriber: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    // Respond to the user
    res.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to subscribe. Please try again later." });
  }
});

// Error handling
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
