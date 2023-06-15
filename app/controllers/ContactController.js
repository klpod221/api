const kue = require('kue');
const queue = kue.createQueue();

/**
 * sends an email using the SMTP transport
 * 
 * @param {*} req
 * @param {*} res
 */
exports.contact = async (req, res) => {
    const { name, email, subject, message } = req.body;

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
        const mailOptions = {
            from: email,
            to: process.env.MAILER_TO,
            subject: mailSubject,
            html: mailMessage
        }

        const job = queue.create('email', mailOptions).save((err) => {
            if (err) {
                return res.status(500).json({ message: err.message, err });
            }
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
        return res.status(500).json({ message: err.message, err });
    }
};