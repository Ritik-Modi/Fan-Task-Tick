import emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
  try {
    console.log("Sending email via EmailJS...");

    const templateParams = {
      to_email: email,
      to_name: email.split("@")[0], // name before @
      subject: title,
      message: body,
      otp: body, // optional if sending OTP
    };

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // optional if you have one
      }
    );

    console.log("✅ Email sent successfully:", result.status, result.text);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default mailSender;
