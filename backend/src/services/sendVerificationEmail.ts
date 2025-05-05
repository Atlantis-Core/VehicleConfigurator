import { transporter } from "../utils/mailer";

export async function sendVerificationEmail(to: string, code: string) {
  const verifyUrl = `${process.env.BACKEND_URL}/api/verify?token=${code}`;

  await transporter.sendMail({
    from: `"Vehicle Configurator" <${process.env.STRATO_EMAIL_ALIAS}>`,
    to,
    subject: 'Please verify your email',
    html: `
      <h2>Confirm your email</h2>
      <p>Click the link below to verify your address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `
  });
}