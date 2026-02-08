// email sending using nodemailer
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  try {

    console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
    console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    // create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // verification URL
    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;

    // email content
    const mailOptions = {
      from: `"Authentication App" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Please verify your email address",
      text: `
        Thank you for registering! Please verify your email address to complete your registration.
        ${verificationUrl}
        This verification link will expire in 10 mins.
        If you did not create an account, please ignore this email.
      `,
    };

    // send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: %s ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
