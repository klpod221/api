/**
 * Validate Contact Form
 * 
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.ContactValidate = (req, res, next) => {
    // validate rules
    req.check('name', 'Name is required!').notEmpty();
    req.check('email', 'Email is required!').notEmpty();
    req.check('email', 'Invalid Email!').isEmail();
    req.check('subject', 'Subject is required!').notEmpty();
    req.check('message', 'Message is required!').notEmpty();

    // Check for errors
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};