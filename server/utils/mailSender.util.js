import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
  try {
    console.log("📧 Sending email via Brevo SMTP...");

    // Create transporter for Brevo (SendinBlue)
    const transporter = nodemailer.createTransport({
      host: process.env.MAIN_HOST || "smtp-relay.brevo.com",
      port: Number(process.env.MAIN_PORT) || 587,
      secure: false, // Brevo uses TLS on port 587
      auth: {
        user: process.env.MAIN_USER, // your Brevo account email
        pass: process.env.MAIN_PASS, // your Brevo API key
      },
    });

    // Verify SMTP connection before sending
    await transporter.verify();
    console.log("✅ SMTP connection successful");

    // Send email
    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIN_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default mailSender;
