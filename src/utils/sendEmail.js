import nodeMailer from "nodemailer"
import env from "../config/env.js"
const sendEmail = async ({ email, subject, message }) => {
  const { APP_NAME, SMTP_MAIL, SMTP_PASSWORD, SMTP_SERVICE } = env
  const transporter = nodeMailer.createTransport({
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  })
  const mailOptions = {
    from: `${APP_NAME} <${SMTP_MAIL}>`,
    to: email,
    subject,
    html: message,
  }

  await transporter.sendMail(mailOptions)
}
export default sendEmail
