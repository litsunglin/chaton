import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//import Message from './ChatMessage';

// ... (styled components for chat window, message list, input field)
const ChatWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 700px;
  padding: 20px;
  background-color: #FAFAFA;
`;

const SubmitContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
`;

const MessageList = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const InputField = styled.input`
  width: 400px;
  margin: 10px;
`;

const UserSelect = styled.select`
  width: 180px;
  margin: 10px;
`;

function ChatWindow({ users, messages, thisUser, onSendMessage }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [usersx, setUsersx] = useState([]);

  useEffect(() => {
    // Set usersx to @all + users
    setUsersx([{ userName: '@all', userId: '@all' }, ...users]);
  }, [users]);

  useEffect(() => {
    if (!selectedUserId && usersx.length > 0) {
      setSelectedUserId(usersx[0].userId);
    }
  }, [usersx, selectedUserId]);

  // Check if onSendMessage is a function
  if (typeof onSendMessage !== 'function') {
    throw new Error('onSendMessage must be a function');
  }

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSelectedUser = (event) => {
    console.log('Selected user:', event.target.value);
    setSelectedUserId(event.target.value);
  };

  const handleInputSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSendMessage(message, selectedUserId);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatWindowContainer>
      <strong>Messages</strong>
      <MessageList>
        {messages.map((msg, index) => {
          const user = usersx.find(user => user.userId === msg.from);
          const userName = user ? user.userName : 'Unknown User';
          return (
            <p key={index}>
              [{msg.createdAt}] <strong>&lt;{userName}&gt;</strong><em>{msg.text}</em>
            </p>
          );
        })}
      </MessageList>
      <hr />&gt;&gt;===========================================================&lt;&lt;
      <strong style={{ margin: '2px' }}>Login as &lt;{thisUser.userName}&gt;</strong>
      <SubmitContainer>
        <strong style={{ margin: '10px' }}>c[○┬●]כ </strong>
        <form onSubmit={handleInputSubmit}>
          <InputField
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..., and hit [ENTER] to send."
          />
        </form>
        <strong style={{ margin: '10px' }}>&gt;&gt;&gt;</strong>
        <UserSelect value={selectedUserId.userId} onChange={handleSelectedUser}>
          {usersx.map((user, index) => (
            <option key={index} value={user.userId}>{user.userName}</option>
          ))}
        </UserSelect>
      </SubmitContainer>
    </ChatWindowContainer>
  );
}

export default ChatWindow;