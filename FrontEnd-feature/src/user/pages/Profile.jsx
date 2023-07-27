import React, { useContext } from 'react';

import { AuthContext } from '../../shared/context/auth-context';

import './Profile.css'

const Profile = () => {
  const { username } = useContext(AuthContext);

  return (
    <div className='profile'>
      <h1>Username: {username}</h1>
    </div>
  )
}

export default Profile;