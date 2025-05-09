import { transporter } from "../utils/mailer";
import { loadTemplate } from "../utils/loadTemplate";

export async function sendVerificationCodeEmail(to: string, code: string, expiryMinutes: number) {
  // Load and render the email template
  const htmlContent = loadTemplate('verificationCode', {
    code,
    expiryMinutes,
    year: new Date().getFullYear()
  });

  // Send the email
  await transporter.sendMail({
    from: `"Vehicle Configurator" <${process.env.STRATO_EMAIL_ALIAS}>`,
    to,
    subject: "Your verification code",
    html: htmlContent
  });
}