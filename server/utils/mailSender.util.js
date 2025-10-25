import * as emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
  try {
    console.log("Sending email via EmailJS (Node.js)...");

    const templateParams = {
      to_email: email,
      subject: title,
      message: body,
    };

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // optional but better for server
      }
    );

    console.log("✅ Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default mailSender;
