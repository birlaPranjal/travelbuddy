import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'koitobanda@gmail.com',
    pass: 'pzqv cgpc izkh xccz',
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Verification Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
        <div style="background-color: #f8f8f8; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
          <div style="font-size: 32px; font-weight: bold; color: #0070f3; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; margin-top: 20px;">
            This code will expire in 5 minutes.
          </p>
        </div>
        <p style="color: #666; text-align: center; margin-top: 20px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
} 