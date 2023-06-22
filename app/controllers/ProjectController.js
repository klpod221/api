const Project = require('../models/ProjectModel');

/**
 * View and search projects with pagination
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object} projects
 * @returns {Object} pagination
 */
exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    try {
        // get all projects with pagination and count
        const projects = await Project.find({ title: { $regex: search, $options: 'i' }, publish: true })
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const count = await Project.countDocuments({ title: { $regex: search, $options: 'i' }, publish: true });

        // return the projects and pagination data
        res.json({
            projects,
            pagination: {
                currentPage: page,
                currentCount: projects.length,
                totalCount: count,
                totalPages: Math.ceil(count / limit),
                limit
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * View a single project
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object} project
 */
exports.view = async (req, res, next) => {
    try {
        // get id from params
        const id = req.params.id;

        // get the project by id and publish is true
        const project = await Project.findOne({ _id: id, publish: true });

        // return the project
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}