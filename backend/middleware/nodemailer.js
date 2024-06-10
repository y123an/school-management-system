const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
  try {
    // Create a transporter using SMTP
    let transporter = nodemailer.createTransport({
      host: "mail.abrahamteshome.com",
      port: 465,
      secure: true,
      auth: {
        user: "parent-teacher-help-desk@abrahamteshome.com", // Replace with your email
        pass: "x^TGeKLp](bd", // Replace with your email password
      },
    });

    // Setup email options
    let mailOptions = {
      from: '"Parent and Teacher Help Desk" <parent-teacher-help-desk@abrahamteshome.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
