## Features
- The user can enter a username and connect to the server.
- The user can send a chat message to another user.
- The user can send a chat message to all the other users.
- The user can view chat messages received from other users.
- Each message should display its sender, timestamp and contents.
- When a user connects to the server, show all the messages that were previously sent by other users.
- A log file on the server with a journal of all the messages processed by the server.
- ~Server RESTful API to send new messages and retrieve previously received messages.~

## How to Run

### Server
In the `server` directory, run the following commands.

#### Setup
```
docker-compose up -d
npm install
```

#### Run
```
npm start
```

### Chat-Client
In the `chat-client` directory, run the following commands.

#### Setup
```
npm install
```

#### Run
```
npm start
```

## Design
See [Design](./doc/README.md) for more details.
