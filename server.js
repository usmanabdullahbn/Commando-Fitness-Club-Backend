// Importing required libraries
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const nodemailer = require("nodemailer");

// Load environment variables
const port = process.env.PORT || 5050;
const app = express();

// Implementing Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// API default route
app.get("/", (req, res) => {
  return res.status(200).send({
    success: true,
    message: "Welcome to the server!",
  });
});

// API for sending email
app.post("/send/email", async (req, res) => {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !phone || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: process.env.RECEIVER_EMAIL,
      subject: `Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to send email.",
        });
      }

      console.log("Email sent successfully!", info.response);
      return res.status(200).json({
        success: true,
        message: "Email sent successfully!",
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
