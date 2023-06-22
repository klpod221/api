const express = require('express');
const router = express.Router();

const ProjectsController = require('../../../controllers/admin/ProjectController');

router.get('/', ProjectsController.index);
router.get('/:id', ProjectsController.view);
router.post('/', ProjectsController.create);
router.put('/:id', ProjectsController.update);
router.delete('/:id', ProjectsController.delete);
router.patch('/:id/status', ProjectsController.updateStatus);
router.patch('/:id/publish', ProjectsController.updatePublish);

module.exports = router;
