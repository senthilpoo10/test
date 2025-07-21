import nodemailer from 'nodemailer';
import config from '../utils/config';

// const transporter = nodemailer.createTransport({
//   host: config.SMTP_HOST,
//   port: config.SMTP_PORT,
//   secure: config.SMTP_PORT === 465, // true for 465, false for other ports
//   auth: {
//     user: config.SMTP_USER,
//     pass: config.SMTP_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hivers5.asteroids@gmail.com",
    pass: "kyyw xeog rvdl uwco",
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    console.warn('SMTP not configured, email not sent:', options);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"2FA App" <${config.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};