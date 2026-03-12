const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 8080;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (mongoURI && !mongoURI.includes("<username>")) {
    mongoose.connect(mongoURI)
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.error("Could not connect to MongoDB:", err));
} else {
    console.warn("MONGODB_URI is not set or contains placeholders. MongoDB storage is disabled.");
}

// Message Schema
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

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
        // Save to MongoDB if connected
        if (mongoose.connection.readyState === 1) {
            const newMessage = new Message({ name, email, subject, message });
            await newMessage.save();
            console.log("Message saved to MongoDB");
        }

        const nodemailer = require("nodemailer");

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
        res.status(200).json({ success: "Message sent successfully and saved to database!" });
    } catch (error) {
        console.error("Error in contact API:", error);
        res.status(500).json({ error: "Failed to process message. Please try again later." });
    }
});

// Route to view messages (protected by a simple check for now)
app.get("/api/messages", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: "Database not connected" });
        }
        const messages = await Message.find().sort({ submittedAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});