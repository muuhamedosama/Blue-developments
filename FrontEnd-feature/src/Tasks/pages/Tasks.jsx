import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Tasks.css';

import { AuthContext } from '../../shared/context/auth-context';
import TasksList from '../components/TasksList';
import Pagination from '../components/Pagination';
import Error from '../../shared/components/Error';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filterByDueDate, setFilterByDueDate] = useState('');
  const [filterByCompletion, setFilterByCompletion] = useState(false); 
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/tasks',
          {
            params: { page: currentPage, filterByCompletion, filterByDueDate },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setTasks(data.tasks);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (err) {
        setErrorMessage(err.response?.data?.message);
      }
    };
    fetchTasks();
  },[currentPage, filterByCompletion, filterByDueDate]);

  const handleCurrentPage = currPage => {
    setCurrentPage(currPage);
  }

  const handleClearFilters = () => {
    setFilterByDueDate('');
    setFilterByCompletion(false);
  };


  const clearError = () => {
    setErrorMessage(null);
  };

  if(errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  }

  return (
    <>
      <div className='filter-options container'>
        <input 
          type='date'
          className='dueDate-filter' 
          onChange={event => setFilterByDueDate(event.target.value)} 
          placeholder='filter by due date'
          value={filterByDueDate}
        />
        <button 
          type='button'
          className='filter-on-completion'
          onClick={() => setFilterByCompletion(true)}  
        >
          My Completed Tasks
        </button>
        <button 
          type='button' 
          className='remove-filter'
          onClick={handleClearFilters}
        > 
          Remove Filter
        </button>
      </div>  
      <div className='container tasks-page'>
        <Link to={'/new-task'} className='create-task'>Create Task</Link>
        <TasksList tasks={tasks} />
        <Pagination 
          totalPages={totalPages} 
          currentPage={currentPage}
          handleClick={handleCurrentPage} 
        />
      </div>
    </>
  )
};

export default Tasks;