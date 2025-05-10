import { transporter } from "../utils/mailer";
import { loadTemplate } from "../utils/loadTemplate";

export async function sendVerificationLinkEmail(to: string, code: string) {
  try {
    // Create verification link using the code
    const verificationLink = `${process.env.BACKEND_URL}/api/verify?token=${code}`;
    
    // Prepare data for template
    const templateData = {
      verificationLink,
      year: new Date().getFullYear()
    };
    
    // Load and compile the email template
    const html = loadTemplate('verificationLink', templateData);
    
    // Send the email
    await transporter.sendMail({
      from: `"Vehicle Configurator" <${process.env.STRATO_EMAIL_ALIAS}>`,
      to,
      subject: 'Verify your email to access your orders',
      html
    });
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}