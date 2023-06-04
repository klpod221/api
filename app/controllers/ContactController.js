const { mailerConfig } = require('../config');
const nodemailer = require('nodemailer');

/**
 * sends an email using the SMTP transport
 * 
 * @param {*} req
 * @param {*} res
 */
exports.contact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport(mailerConfig);

    const mailSubject = `Contact Form: ${subject}`;
    const mailMessage = `
        <h1>You have a new contact request</h1>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
        </ul>
        <h3>Message</h3>
        <p>${message}</p>
    `;

    try {
        await transporter.sendMail({
            from: email,
            to: process.env.MAILER_TO,
            subject: mailSubject,
            html: mailMessage
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};