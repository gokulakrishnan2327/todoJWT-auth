const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Fetching tasks failed', error });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedTo } = req.body;
    const newTask = new Task({ title, description, dueDate, status, assignedTo });
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Creating task failed', error });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Updating task failed', error });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deleting task failed', error });
  }
};
