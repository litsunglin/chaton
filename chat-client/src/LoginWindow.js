import React, { useState, useEffect } from 'react';
//import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

function LoginWindow({ onLogin, users }) {
    const [selectedUser, setSelectedUser] = useState({ userName: '[NEW]', userId: 'new' });
    const [newUser, setNewUser] = useState({ userName: '', userId: '' });

    users = [{ userName: '[NEW]', userId: 'new' }, ...users];

    const handleLogin = (event) => {
      event.preventDefault();
      onLogin( selectedUser.userId==='new' ? newUser : selectedUser);
    };

    const handleSelectedChange = (event) => {
        const selectedUserName = event.target.value;
        const selectedUser = users.find(user => user.userName === selectedUserName);
        setSelectedUser(selectedUser);
    };

    const handleInputChange = (event) => {
        //console.log('handleInputChange', event.target.value);
        setNewUser({ userName: event.target.value, userId: uuid() });
    };
  
    return (
        <div>
            <h3>Login</h3>
            <strong>Select a existing user or [NEW] to make a new user.</strong>
            <form onSubmit={handleLogin}>
                <select value={selectedUser.userName} onChange={handleSelectedChange} style={{ width: '300px' }} >
                    {users.map((user, index) => (
                        <option key={index} value={user.userName}>{user.userName}</option>
                    ))}
                </select>
                {selectedUser.userId === 'new' && (
                    <input
                        type="text"
                        value={newUser.userName}
                        onChange={handleInputChange}
                        placeholder="Enter new username"
                        style={{ width: '300px', margin: '10px' }} 
                    />
                )}
                <button style={{ margin: '10px' }} type="submit">Login</button>
            </form>
        </div>
    );
  }

  export default LoginWindow;