const express = require('express');

const tasksControllers = require('../controllers/tasks-controllers'); 
const checkAuth = require('../middlewares/check-auth');
const uri = require('../utils/uri.json');

const router = express.Router();

router.use(checkAuth);

router.post(uri.baseUri, tasksControllers.createTask);

router.get(uri.baseUri, tasksControllers.getAllTasks); 

router.patch(`${uri.baseUri}/:taskId`, tasksControllers.patchTask); 

router.delete(`${uri.baseUri}/:taskId` ,tasksControllers.deleteTask); 

router.put(`${uri.baseUri}/:taskId` ,tasksControllers.updateTask); 

module.exports = router;