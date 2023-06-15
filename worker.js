const queue = require('./app/plugins/queue');
const sendMail = require('./app/services/SendMailService');

/**
 * process email job
 */
queue.process('email', (job, done) => {
    sendMail(job.data.from, job.data.to, job.data.subject, job.data.html)
        .then(() => done())
        .catch((err) => done(err));
});