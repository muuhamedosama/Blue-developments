import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Navbar from './shared/components/Navbar';
import Login from './user/pages/Login';
import Signup from './user/pages/Signup';
import Profile from './user/pages/Profile';
import Tasks from './Tasks/pages/Tasks';
import NewTask from './Tasks/pages/NewTask';
import UpdateTask from './Tasks/pages/UpdateTask';

const App = () => {
  const { token, userId, username, login, logout } = useAuth(); 
  
  const routes = !token ? 
    (
      <Routes>
        <Route path='/signup' element={ <Signup /> } />
        <Route path='/' element={ <Login /> } />
      </Routes>
    )
    : 
    (
      <Routes>
        <Route path='/' element={ <Profile /> } />
        <Route path='/tasks' element={ <Tasks /> } />
        <Route path='/new-task' element={ <NewTask />} />
        <Route path='/update-task/:taskId' element={ <UpdateTask />} />
      </Routes>
    );
              
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        username,
        login,
        logout
      }}
    >
        <Navbar />
        <main>{routes}</main>
    </AuthContext.Provider>  
  )
}

export default App;