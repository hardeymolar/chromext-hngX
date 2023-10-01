/* eslint-disable */
require("dotenv").config();
const nodemailer = require("nodemailer");
const {sendVideoTemplate} = require("./emailHelper");
const { BadRequestError } = require("../../errors");
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const emailSent = (error, info) => {
  if (error) {
    console.log("Error occurred:", error.message);
    throw new BadRequestError("Error sending email, please check the email is correct and try again");
  } else {
    console.log("Email sent:", info.response);
  }
};

// modify and add more to these sections in according to what you need to do here:
async function sendVideoToEmail(email, link) {
  const videoUrl = await sendVideoTemplate(link);
  const options = {
    from: process.env.SENDER,
    to: email,
    subject: "Recorded Video From Chrome Extension",
    html: videoUrl,
  };
  await transporter.sendMail(options, emailSent);
}

module.exports = {sendVideoToEmail};