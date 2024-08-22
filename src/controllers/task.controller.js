const Task = require('../models/task.model');
// Adding a new task
const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    // Find the task with the highest index in the same status column
    const highestIndexTask = await Task.findOne({ status: 'To Do' })
      .sort({ arrIdx: -1 })
      .select('arrIdx');
    // Determine the new index
    const newIndex = highestIndexTask ? highestIndexTask.arrIdx + 1 : 0;
    // Convert title to lowercase
    const normalizedTitle = title.toLowerCase();

    // Check if a task with the same title already exists for the user
    const existingTask = await Task.findOne({
      title: normalizedTitle,
      userId: req.user._id,
    });
    // If a task with the same title already exists, return an error
    if (existingTask) {
      return res.status(400).json({
        success: false,
        message: 'Task with the same title already exists',
      });
    }
    // Create a new task
    const task = new Task({
      title: normalizedTitle,
      description,
      userId: req.user._id,
      arrIdx: newIndex,
    });
    await task.save();
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
    });
  }
};

// Get all tasks for the user

const getTasks = async (req, res) => {
  try {
    // Find all tasks for the user and sort them by arrIdx
    const tasks = await Task.find({ userId: req.user._id }).sort({ arrIdx: 1 });
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting tasks',
    });
  }
};
// Get tasks by title
const getTasksByTitle = async (req, res) => {
  try {
    const { title, sort } = req.query;
    // Check if title and sort parameters are provided
    if (!title || !sort) {
      return res.status(400).json({
        success: false,
        message: 'Title and sort parameters are required',
      });
    }

    const userId = req.user._id;

    let tasks;
    // If sort is 'Recent', sort by creation date in descending order
    if (sort === 'Recent') {
      // Sort by creation date in descending order
      tasks = await Task.find({
        title: { $regex: title, $options: 'i' },
        userId,
      }).sort({ createdAt: -1 });
    } else {
      // If sort is not 'Recent', sort by priority and creation date in descending order
      tasks = await Task.aggregate([
        {
          $match: {
            title: { $regex: title, $options: 'i' },
            userId: userId,
          },
        },
        {
          $addFields: {
            priority: {
              $cond: {
                if: { $eq: [{ $trim: { input: '$status' } }, sort] }, // Assign priority 1 to the matching status
                then: 1,
                else: 2, // Assign priority 2 to all other tasks
              },
            },
          },
        },
        {
          $sort: {
            priority: 1, // Sort by priority first
            createdAt: -1, // Then sort by creation date in descending order
          },
        },
      ]);
    }

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tasks found',
      });
    }

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks',
    });
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, arrIdx } = req.body;

    // If title is provided, normalize and check for uniqueness
    if (title) {
      const normalizedTitle = title.toLowerCase();

      // Check if another task with the same title exists for the user
      const existingTask = await Task.findOne({
        title: normalizedTitle,
        userId: req.user._id,
        _id: { $ne: id },
      });

      if (existingTask) {
        return res.status(400).json({
          success: false,
          message: 'Task with the same title already exists',
        });
      }

      // Update task with the new title and other details
      const task = await Task.findByIdAndUpdate(
        id,
        { title: normalizedTitle, description, status, arrIdx },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } else {
      // Handle updating the task without title change
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      // If status or arrIdx is changing, adjust other tasks' arrIdx
      if (status !== task.status || arrIdx !== task.arrIdx) {
        // Decrement arrIdx for tasks in the old column
        await Task.updateMany(
          {
            status: task.status,
            arrIdx: { $gt: task.arrIdx },
            userId: req.user._id,
          },
          { $inc: { arrIdx: -1 } }
        );

        // Increment arrIdx for tasks in the new column
        await Task.updateMany(
          { status, arrIdx: { $gte: arrIdx }, userId: req.user._id },
          { $inc: { arrIdx: 1 } }
        );

        task.status = status;
        task.arrIdx = arrIdx;
      }

      await task.save();

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error updating task',
    });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
    });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getTasksByTitle,
};
