import React from 'react';
import styled from 'styled-components';

// ... (styled components for message)
const MessageContainer = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 2px;
  border-radius: 8px;
  max-width: 70%;
  background-color: #f0f0f0;
`;

const Username = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const Timestamp = styled.span`
  font-size: 0.8em;
  color: #777;
`;

function ChatMessage({ username, content, timestamp }) {
  return (
    <MessageContainer>
      <Timestamp>[{timestamp}]</Timestamp>
      <Username><a>{username}</a></Username>
      <p>{content}</p>
    </MessageContainer>
  );
}

export default ChatMessage;
