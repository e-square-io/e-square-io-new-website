const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

// TODO: REPLACE THE COMMENTS BELOW WITH THE "CONSTS" ON LINE 13,14 AFTER CREATING FIREBASE CONFIGURATION
// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;

const gmailEmail = "mails.e.square.io@gmail.com";
const gmailPassword = "qqeopxgtbdwxfdni";

const mailTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

exports.sendEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log("Request received:", req.body);
        const { firstName, lastName, email, msg } = req.body;

        const mailOptions = {
            from: gmailEmail,
            to: "eliran@e-square.io",
            subject: `Message from ${firstName} ${lastName}`,
            text: msg,
            html: `<p>${msg}</p>`,
        };

        mailTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(
                    "There was an error while sending the email:",
                    error
                );
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent:", info.response);
                res.status(200).send("Email sent successfully");
            }
        });
    });
});
