import React from 'react';

import TaskItem from './TaskItem';

const TasksList = ({ tasks }) => {
  return (
    <div className='task-list'>
      { tasks.map(task => 
          <TaskItem 
            key={task._id}
            task={task}
          />  
      )}
    </div>
  )
};

export default TasksList;