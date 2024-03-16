import nodemailer from 'nodemailer';

export const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
      service : 'gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    // 2) Define the email options
    const mailOptions = {
      from: `SkillMingle <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      attachments : options.attachments
    };

    // console.log(mailOptions);

    // 3) Actually send the email
    await transporter.sendMail(mailOptions)
    .then(() => console.log("Email Sent!!"))
    .catch(err => console.log(err));
};
  