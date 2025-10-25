import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
  try {
    console.log("📨 Sending email via Brevo API...");

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: { name: "StudyNotion", email: process.env.BREVO_SENDER },
      to: [{ email }],
      subject: title,
      htmlContent: body,
    };

    const response = await tranEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully via Brevo API:", response.messageId);
    return response;
  } catch (error) {
    console.error("❌ Error sending email via Brevo API:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default mailSender;
