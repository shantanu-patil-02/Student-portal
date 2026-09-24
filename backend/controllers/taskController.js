import mongoose from 'mongoose';
import Task from '../models/Task.js';

// @desc    Get all tasks for logged-in user (with optional filter by status and priority)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority, sort } = req.query;

    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    let tasksQuery = Task.find(query);

    // Default sort by dueDate ascending (earliest deadlines first)
    if (sort === 'createdAt') {
      tasksQuery = tasksQuery.sort({ createdAt: -1 });
    } else {
      tasksQuery = tasksQuery.sort({ dueDate: 1 });
    }

    const tasks = await tasksQuery.exec();
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('[GetTasks Error]', error.message);
    return res.status(500).json({ message: 'Server error retrieving tasks' });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this task' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('[GetTaskById Error]', error.message);
    return res.status(500).json({ message: 'Server error retrieving task details' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, subject, priority, status, dueDate } = req.body;

    // Validate required fields
    if (!title || !subject || !dueDate) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, subject, and dueDate',
      });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      subject: subject.trim(),
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: new Date(dueDate),
      user: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('[CreateTask Error]', error.message);
    return res.status(500).json({ message: error.message || 'Server error creating task' });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, subject, priority, status, dueDate } = req.body;

    const validPriorities = ['Low', 'Medium', 'High'];
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (subject !== undefined) task.subject = subject.trim();
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);

    const updatedTask = await task.save();

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('[UpdateTask Error]', error.message);
    return res.status(500).json({ message: error.message || 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    return res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error) {
    console.error('[DeleteTask Error]', error.message);
    return res.status(500).json({ message: 'Server error deleting task' });
  }
};
