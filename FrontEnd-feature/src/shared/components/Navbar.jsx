import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';
import './Navbar.css'

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="container container-flex">
        <div>
            <h1>ToDo List</h1>
            <p className="subtitle">Your gate to success.</p>
        </div>
        <nav>
            <ul>
                {!isLoggedIn && 
                  <li><NavLink to='/'>Login</NavLink></li>
                }
                {!isLoggedIn &&
                  <li><NavLink to='/signup'>Signup</NavLink></li>
                }
                {isLoggedIn &&
                  <li><NavLink to='/'>Profile</NavLink></li>
                }
                {isLoggedIn &&  
                    <li><NavLink to='/tasks'>Tasks</NavLink></li>
                }
                {isLoggedIn &&
                  <li><button className='logout' onClick={handleLogout}>Logout</button></li>
                }
            </ul>
        </nav>
      </div>
    </header>
  )
};

export default Navbar;
