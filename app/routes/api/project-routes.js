const express = require('express');
const router = express.Router();

const ProjectsController = require('../../controllers/ProjectController');

router.get('/', ProjectsController.index);
router.get('/:id', ProjectsController.view);

module.exports = router;
