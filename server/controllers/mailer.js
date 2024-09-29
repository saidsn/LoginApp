import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import ENV from "../config.js";

const nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: ENV.MAIL,
    pass: ENV.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const sendMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  let mail = {
    body: {
      name: username,
      intro: text || "Welcome",
      outro: "My Channel",
    },
  };

  let emailBody = MailGenerator.generate(mail);

  let message = {
    from: ENV.MAIL,
    to: userEmail,
    subject: subject || "Signup Successfully",
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should recieve an email from us" });
    })
    .catch((error) => res.status(500).send({ error }));
};
