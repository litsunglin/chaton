import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// ... (styled components for chat window, message list, input field)
const UserWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 100px;
  padding: 20px;
  background-color: #f0f0f0;
`;

const UserList = styled.div`
  overflow-y: auto;
  height: 99%;
  list-style-type: none;
`;

function UserWindow({ users }) {
    return (
        <UserWindowContainer>
          <strong>Users</strong>
          <UserList>
            {users.map((user, index) => (
              <li key={index}>{user.userName}</li>
            ))}
          </UserList>
        </UserWindowContainer>
      );
}

export default UserWindow