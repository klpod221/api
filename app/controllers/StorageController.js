/**
 * upload file to public/uploads
 * 
 * @param {object} req
 * @param {object} res
 */
exports.upload = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: 'No files uploaded!' });
        }

        // The name of the input field (i.e. "file") is used to retrieve the uploaded file
        const file = req.files.file;

        // generate random string for file name 
        const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // get file extension
        const fileExtension = file.name.split('.').pop();

        // set file name
        file.name = `${randomString}.${fileExtension}`;

        // Use the mv() method to place the file somewhere on your server
        file.mv(`./public/uploads/${file.name}`, function(err) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            return res.status(200).json({
                message: 'File uploaded successfully!',
                url: process.env.APP_URL + '/uploads/' + file.name
            });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};