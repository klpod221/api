const Project = require('../../models/ProjectModel');

/**
 * View and search projects with pagination
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} projects
 * @returns {Object} pagination
 */
exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    try {
        // get all projects with pagination and count
        const projects = await Project.find({ title: { $regex: search, $options: 'i' } })
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const count = await Project.countDocuments({ title: { $regex: search, $options: 'i' } });

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
}

/**
 * View a single project
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} project
 */
exports.view = async (req, res) => {
    try {
        // get the project by id
        const project = await Project.findById(req.params.id);

        // return the project
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Create a new project
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} response
 */
exports.create = async (req, res) => {
    try {
        const project = new Project(req.body);

        // save the project
        await project.save();

        // return a response
        res.status(200).json({ message: 'Project created successfully', project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Update a project
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} response
 */
exports.update = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // update the project
        await project.set(req.body);
        await project.save();

        // return a response
        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Delete a project
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} response
 */
exports.delete = async (req, res) => {
    try {
        // delete the project
        await Project.deleteOne({ _id: req.params.id });

        // return a response
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Update a project's status
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} response
 */
exports.updateStatus = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // update the project's status
        await project.set({ status: req.body.status });
        await project.save();

        // return a response
        res.status(200).json({ message: 'Project status updated successfully', project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Update a project's publish status
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} response
 */
exports.updatePublish = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // update the project's publish status
        await project.set({ publish: req.body.publish });
        await project.save();

        // return a response
        res.status(200).json({ message: 'Project publish status updated successfully', project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
