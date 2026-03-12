const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Route for home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Contact Form API Endpoint
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const nodemailer = require("nodemailer");
        require("dotenv").config();

        // Configure Nodemailer with Gmail (or other service)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: "rsnithyashreeodc029@gmail.com",
            subject: `Portfolio Contact: ${subject}`,
            text: `You have received a new message from your portfolio website.\n\nFrom: ${name} (${email})\nSubject: ${subject}\nMessage:\n${message}\n\n---\nTo reply, please compose a new email to ${email}.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});