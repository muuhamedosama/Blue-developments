import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../shared/context/auth-context';
import axios from 'axios';
import Error from '../../shared/components/Error';

const TaskItem = ({ task }) => {
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  const [errorMessage, setErrorMessage] = useState(null);
  const { token } = useContext(AuthContext);

  const handleTaskComeletion = async (event) => {
    setIsCompleted(event.target.checked);
    try {
      await axios.patch(`http://localhost:5001/api/tasks/${task._id}`,
      JSON.stringify({
        isCompleted: event.target.checked
      }),
      {
        headers:{
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}` 
        }
      }
    );
    } catch (err) {
      setErrorMessage(err.response?.data?.message); 
    }
  };
  
  const handleDeleteTask = async () => {
    try {
       await axios.delete(`http://localhost:5001/api/tasks/${task._id}`, {
        headers: {
          authorization: `Bearer ${token}` 
        }
      });
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.response?.data?.message);
    }
  };
  
  const clearError = () => {
    setErrorMessage(null);
  };

  if(errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  }
  return (
    <div className='task-item'>
      <div className='task-wrapper'>
        <div className='flex'> 
          <input 
            type='checkbox' 
            name='isCompleted' 
            checked={isCompleted}
            onChange={handleTaskComeletion}
          />
          <div>
            <h2 className='task-name'>{task.taskName}</h2>
            <div className='task-description'>
              { task.description &&
                <p>description: {task.description},</p>
              }
            </div>
          </div>
        </div>
        <p>deadline: {task.dueDate}</p>
        <div className='button-wrapper'>
          <Link to={`/update-task/${task._id}`} className='update-task'>Update Task</Link>
          <button className='delete-btn' onClick={handleDeleteTask}>Delete Task</button>
        </div>
      </div>
    </div>
  )
};

export default TaskItem;