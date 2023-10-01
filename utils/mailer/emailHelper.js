/* eslint-disable */
require("dotenv").config();

const handlebars = require("handlebars");
const fs = require("fs");

// Read the Handlebars template
const source = fs.readFileSync(`${__dirname}/email-template.hbs`, "utf8");
const template = handlebars.compile(source);

// Compile the template with Data to be inserted into the template

async function sendVideoTemplate(link) {
  const data = template({
    subject: "Recorded Video From Chrome Extension",
    message:`kindly click the link below to view your recorded video ${link}`
  });
  return data;
}

module.exports = {
  sendVideoTemplate
};
