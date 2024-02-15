import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
//import { v4 as uuid } from 'uuid';

import LoginWindow from './LoginWindow';
import ChatWindow from './ChatWindow';
import UserWindow from './UserWindow';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
`;

function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [thisUser, setThisUser] = useState({ userName: '', userId: '???' });
  //const [clientId, setClientId] = useState(`uuid()`);

  const thisUserRef = useRef();
  thisUserRef.current = thisUser;

  const messagesRef = useRef();
  messagesRef.current = messages;

  // Setup socket.io
  useEffect(() => {

    console.log('Connecting to server');
    const newSocket = io('http://localhost:30081');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');

      // Get the list of users from the server
      newSocket.emit('getUsers');
    });

    newSocket.on('welcome', (msg) => {
      console.log('Welcome message:', msg);
    });

    newSocket.on('getUsers', (msg) => {
      console.log('getUsers:', msg);
      
      if(msg.error !== 200) {
        console.error('Error getting users:', msg.error);
        return;
      } else {
        setUsers(msg.users);
      }
    });

    newSocket.on('chat', (message) => {
      console.log('Received message:', message);

      if(message.to === thisUserRef.current.userId 
        || (message.to === '@all' && message.from !== thisUserRef.current.userId))
      {
        console.log('Adding message to list');
        setMessages((messages) => [...messages, message]);
      } else {
        console.log('Message not for me', message.to, thisUserRef.current);
      }
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    console.log('this user:', thisUser);
  }, [thisUser]);

  const handleLogin = (user) => {
    console.log('Logged in as:', user);
    setThisUser(user);

    socket.emit('login', user);
  };

  const handleSendMessage = (message, to) => {
    console.log('Sending message:', message);
    if (socket && thisUser.userId) {
      //FIXME: assume all users are in the same timezone.
      const timestamp = new Date().toLocaleString('en-US', { hour12: false });

      socket.emit('chat', { from: thisUser.userId, text: message, createdAt: timestamp, to: to});
    } else {
      console.error('Socket or username not available');
    }
  };

  return (
    <Container>
      {thisUser.userName ? (
        <>
          <ChatWindow users={users} messages={messages} thisUser={thisUser} onSendMessage={handleSendMessage} />
          <UserWindow users={users} />
        </>
      ) : (
        <LoginWindow onLogin={handleLogin} users={users} />
      )}
    </Container>
  );
}

export default ChatApp;