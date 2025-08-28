import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your TravelBuddy Verification Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #3B82F6; text-align: center;">TravelBuddy</h1>
        <div style="background-color: #f8f8f8; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; border-left: 4px solid #3B82F6;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
          <div style="font-size: 32px; font-weight: bold; color: #3B82F6; letter-spacing: 8px; margin: 20px 0; background-color: #EFF6FF; padding: 10px; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #666; margin-top: 20px;">
            This code will expire in 5 minutes.
          </p>
        </div>
        <p style="color: #666; text-align: center; margin-top: 20px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
          &copy; ${new Date().getFullYear()} TravelBuddy. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetOTPEmail(to: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset Your TravelBuddy Password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #3B82F6; text-align: center;">TravelBuddy</h1>
        <div style="background-color: #f8f8f8; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; border-left: 4px solid #3B82F6;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Code</h2>
          <p style="color: #666; margin-bottom: 20px;">
            We received a request to reset your password. Use the code below to complete the process:
          </p>
          <div style="font-size: 32px; font-weight: bold; color: #3B82F6; letter-spacing: 8px; margin: 20px 0; background-color: #EFF6FF; padding: 10px; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #666; margin-top: 20px;">
            This code will expire in 5 minutes.
          </p>
        </div>
        <p style="color: #666; text-align: center; margin-top: 20px;">
          If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
          &copy; ${new Date().getFullYear()} TravelBuddy. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
} 