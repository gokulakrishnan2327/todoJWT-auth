const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  const { title, description, dueDate } = req.body;
  const newTask = new Task({ title, description, dueDate, status: 'pending' });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
