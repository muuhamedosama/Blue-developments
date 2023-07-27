import React, { useState , useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';

const UpdateTask = () => {
  const [ updatedForm, setUpdatedForm ] = useState({
    taskName: '',
    description: '',
    dueDate: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const { taskId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const updateTaskSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/tasks/${taskId}`,
        JSON.stringify({
          taskName: updatedForm.taskName,
          description: updatedForm.describtion,
          dueDate: updatedForm.dueDate,
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
      <form className="form-collector" onSubmit={updateTaskSubmitHandler}>
          <input 
            onChange={handleChange} 
            name='taskName'
            value={updatedForm.taskName}
            type="text" 
            required 
            placeholder="taskName"
          />
          <input 
            onChange={handleChange} 
            name='describtion'
            value={updatedForm.description}
            type="text" 
            placeholder="describtion(Optional)"
          /> 
          <input 
            onChange={handleChange} 
            name='dueDate'
            value={updatedForm.dueDate}
            type="date" 
            required 
           />  
          <button className="btn btn-primary" type="submit">Update task</button>
      </form>
    </div>
  )
};

export default UpdateTask;