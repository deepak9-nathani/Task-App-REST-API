const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(21313141);

const sendWelcomeEmail = async (email, name) => {
  sgMail
    .send({
      to: email,
      from: "nathanideepak7@gmail.com",
      subject: "Thanks for joining in!",
      text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    })
    .then(() => {
      console.log("email sent");
    })
    .catch((e) => {
      console.log(e);
    });
};

const sendCancelationEmail = async (email, name) => {
  sgMail
    .send({
      to: email,
      from: "nathanideepak7@gmail.com",
      subject: "Sorry to see you go!",
      text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
    })
    .then(() => {
      console.log("email sent");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
