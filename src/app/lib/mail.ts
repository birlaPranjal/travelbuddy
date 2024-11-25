import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'koitobanda@gmail.com',
    pass: 'pzqv cgpc izkh xccz',
  },
});

export async function sendVerificationEmail(to: string, verificationLink: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify Your Email',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Verify Your Email Address</h1>
        <p>Thank you for signing up! Please click the button below to verify your email address:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p>If the button doesn't work, you can also click this link:</p>
        <p>${verificationLink}</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
} 