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
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        const { firstName, lastName, email, companyName, jobTitle, msg } =
            req.body;

        if (!firstName || !lastName || !email || !msg) {
            return res.status(400).send("All fields are required");
        }

        const mailOptions = {
            from: gmailEmail,
            to: "idan8122@gmail.com",
            subject: `Message from ${firstName} ${lastName}`,
            text: msg,
            html: `
            <ul>
                <li>First Name: ${firstName}</li>
                <li>Last Name: ${lastName}</li>
                <li>Email: ${email}</li>
                <li>Company Name: ${companyName}</li>
                <li>Job Title: ${jobTitle}</li>
            </ul>
            <p>${msg}</p>
            `,
        };

        mailTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(
                    "There was an error while sending the email:",
                    error
                );
                return res.status(500).send("Error sending email");
            } else {
                console.log("Email sent:", info.response);
                return res.status(200).send("Email sent successfully");
            }
        });
    });
});
