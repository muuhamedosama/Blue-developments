const HttpError = require('../models/http-Error');
const Task = require('../models/task');
const schemas = require('../utils/taskServiceSchemas');
const messages = require('../utils/messages.json');

exports.getAllTasks = async (req, res, next) => {
  const { userId } = req.userData;
  const { page = 1, limit = 4, filterByDueDate, filterByCompletion } = req.query;

  const filters = filterByDueDate && filterByCompletion ? 
  {
    dueDate: filterByDueDate,
    isCompleted: filterByCompletion,
    createdBy: userId
  } 
  : filterByDueDate ? 
  {
    dueDate: filterByDueDate,
    createdBy: userId
  } 
  : filterByCompletion ? 
  {
    isCompleted: filterByCompletion,
    createdBy: userId,
  } : { createdBy: userId };

  let tasks, count;
  try {
    tasks = await Task.find(filters)     
      .limit(limit)
      .skip((page - 1) * limit)

   count = await Task.countDocuments();
  } catch (err) {
    console.log(err);
    const error = new HttpError(messages.error.server.getTasks, 500);
    return next(error);
  }

  res.json({
    tasks: tasks,  
    totalPages: Math.floor(count / limit),
    currentPage: page
  })
};

exports.createTask = async (req, res, next) => {
  try {
    await schemas.createdTask.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  const { taskName, description, dueDate } = req.body;
  const { userId } = req.userData;

  const createdTask = new Task({
    taskName,
    description,
    dueDate,
    createdBy: userId
  });

  try {
    await createdTask.save();
  } catch (err) {
    const error = new HttpError(messages.error.server.createTask, 500);
    return next(error);
    
  }

  res.status(201).json({
    message: messages.success.createdTask
  });
};

exports.patchTask = async (req, res, next) => {
  try {
    await schemas.patchTask.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  const { isCompleted } = req.body;
  const { taskId } = req.params;

  try {
    await Task.updateOne({ _id: taskId }, { isCompleted });
  } catch (err) {
    const error = new HttpError(messages.error.server.updateTask, 500);
    return next(error);
  }

  res.json({
    message: messages.success.updateTask
  });
};

exports.updateTask = async (req, res, next) => {
  try {
    await schemas.updateTask.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  const { taskName, description, dueDate } = req.body;
  const { taskId } = req.params;

  try {
    await Task.updateOne({ _id: taskId }, { taskName, description, dueDate });
  } catch (err) {
    const error = new HttpError(messages.error.server.updateTask, 500);
    return next(error);
  }

  res.json({
    message: messages.success.updateTask
  });
};

exports.deleteTask = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    await Task.findByIdAndDelete(taskId);
  } catch (err) {
    const error = new HttpError(messages.error.server.deleteTask, 500);
    return next(error);
  }

  res.json({
    message: messages.success.deleteTask  
  });
}; 