// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const mailTransport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'mails.e.square.io@gmail.com', // replace with your email
//         pass: 'your-email-password' // replace with your email password
//     }
// });

// app.post('/sendMail', (req, res) => {
//     const mailOptions = {
//         from: 'Your Website <mails.e.square.io@gmail.com>', // replace with your email
//         to: 'eliran@e-square.io', // replace with recipient email
//         subject: 'NEW LEAD!!!',
//         html: `
//             New lead just landed from your website
//             <br />
//             First Name: ${req.body.firstName}
//             <br />
//             Last Name: ${req.body.lastName}
//             <br />
//             Email: ${req.body.email}
//             <br />
//             Company Name: ${req.body.companyName || 'Not specified'}
//             <br />
//             Job Title: ${req.body.jobTitle || 'Not specified'}
//             <br />
//             Message: ${req.body.msg || 'Not specified'}
//         `
//     };

//     return mailTransport.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//             return res.status(500).send({ success: false, error: error.toString() });
//         }
//         res.status(200).send({ success: true });
//     });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

// Replace the path with the path to your service account key file
const serviceAccount = require("./e-square-idan-firebase-adminsdk-x79ra-3da62b140a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fetch email credentials from environment variables
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

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const mailOptions = {
      from: `e-square.io Website <${gmailEmail}>`,
      to: "idan8722@gmail.com", // Replace with your email
      subject: "NEW LEAD!!!",
      html: `
                New lead just landed from e-square.io
                <br />
                First Name: ${req.body.data.firstName}
                <br />
                Last Name: ${req.body.data.lastName}
                <br />
                Email: ${req.body.data.email}
                <br />
                Company Name: ${req.body.data.companyName || "Not specified"}
                <br />
                Job Title: ${req.body.data.jobTitle || "Not specified"}
                <br />
                Subject: ${req.body.data.subject}
                <br />
                Message: ${req.body.data.msg || "Not specified"}
            `, // email content in HTML
    };

    return mailTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .send({ data: { success: false, error: error.toString() } });
      }
      return res.status(200).send({ data: { success: true } });
    });
  });
});
