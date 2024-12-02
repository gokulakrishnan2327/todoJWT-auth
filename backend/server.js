require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());  // Enable CORS for all routes

// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// API Routes
app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();  
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  });
  
  app.post('/api/tasks', async (req, res) => {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({ title, description, dueDate, status: 'pending' });
  
    try {
      await newTask.save();
      io.emit('taskUpdated');  
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ message: 'Error creating task' });
    }
  });
  

app.put('/api/tasks/:id', async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, status },
      { new: true }
    );
    io.emit('taskUpdated'); 
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    io.emit('taskUpdated'); 
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});


  

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
