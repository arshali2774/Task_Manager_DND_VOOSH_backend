const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  getTasksByTitle,
} = require('../controllers/task.controller');
const {
  createTaskSchema,
  updateTaskSchema,
} = require('../validations/task.validation');
const router = express.Router();

// create task route
router.post('/', protect, validate(createTaskSchema), addTask);
// get tasks route
router.get('/', protect, getTasks);
// get tasks by title route
router.get('/search', protect, getTasksByTitle);
// update task route
router.put('/:id', protect, validate(updateTaskSchema), updateTask);
// delete task route
router.delete('/:id', protect, deleteTask);

module.exports = router;
