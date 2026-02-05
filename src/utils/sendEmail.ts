import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (to: string, html: string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production', // true for 465, false for other ports
    auth: {
      user: 'moshiurrahman4195@gmail.com',
      pass: 'nciz lgkf uqag dfmv',
    },
  });

  await transporter.sendMail({
    from: 'moshiurrahman4195@gmail.com',
    to,
    subject: 'Reset your password within 10 mins!',
    text: 'Test email', // plain‑text body
    html // HTML body
  });
};

export default sendEmail;
