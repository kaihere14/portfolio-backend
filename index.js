import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const port = 8080;

dotenv.config();

app.use(express.json({ limit: "16kb" }));

app.use(
  cors({
    origin: "portfolio-2-liard-gamma.vercel.app",
  })
);

app.post("/contact", async (req, res) => {
  const { fname, lname, email, msg } = req.body;

  if (!fname || !lname || !email || !msg) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      to: process.env.TO_EMAIL,
      subject: "Portfolio Contact Form",
      text: msg,
      html: `<p><b>Name:</b> ${fname} ${lname}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Message:</b></p><p>${msg}</p>`,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ error: "Email failed to send" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
