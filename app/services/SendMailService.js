const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

const mailerConfig = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
};

const transporter = nodemailer.createTransport(mailerConfig);

/**
 * sends an email using the SMTP transport
 * 
 * @param {*} from
 * @param {*} to
 * @param {*} subject
 * @param {*} html
 */
const sendMail = async (from, to, subject, html) => {
    try {
        const mailOptions = {
            from,
            to,
            subject,
            html
        };

        console.log(`Sending email to ${to}...`);
        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(`Email not sent to ${to}: ${err}`);
            } else {
                console.log(`Email sent to ${to}: ${info.response}`);
            }
        });

        return true;
    } catch (err) {
        return false;
    }
};

module.exports = sendMail;