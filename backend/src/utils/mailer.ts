// backend/src/utils/mailer.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: 'smtp.strato.de',
  port: 465,
  secure: true,
  auth: {
    user: process.env.STRATO_EMAIL,
    pass: process.env.STRATO_PASSWORD,
  },
});