import { createTransport } from "nodemailer";

export const mailTransporter = createTransport({
  host: process.env.NEXT_MAILSERVICE_HOST,
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.NEXT_MAILSERVICE_USER,
    pass: process.env.NEXT_MAILSERVICE_PASS,
  },
});