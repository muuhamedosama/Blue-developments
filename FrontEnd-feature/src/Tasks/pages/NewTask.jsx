import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';


const NewTask = () => {
  const [ taskForm, setTaskForm ] = useState({
    taskName: '',
    description: '',
    dueDate: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  
  const newTaskSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/tasks',
        JSON.stringify({
          taskName: taskForm.taskName,
          description: taskForm.description,
          dueDate: taskForm.dueDate
        }),
        {
          headers:{
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}` 
          }
        }
      );
      navigate('/tasks');
    } catch (err) {
      setErrorMessage(err.response?.data?.message);
    }
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };

  return (
    <div className="main-content">
      <form className="form-collector" onSubmit={newTaskSubmitHandler}>
          <input 
            onChange={handleChange} 
            name='taskName'
            value={taskForm.taskName}
            type="text" 
            required 
            placeholder="taskName"
          />
          <input 
            onChange={handleChange} 
            name='description'
            value={taskForm.description}
            type="text" 
            placeholder="description (Optional)"
          /> 
          <input 
            onChange={handleChange} 
            name='dueDate'
            value={taskForm.dueDate}
            type="date" 
            required
           />  
          <button className="btn btn-primary" type="submit">Create new task</button>
      </form>
    </div>
  )
};

export default NewTask;