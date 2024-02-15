const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: /http:\/\/localhost:\d+$/,
    methods: ["GET", "POST"],
    allowedHeaders: [""],
    credentials: true
  }
});

async function main() {
  const database = require('./database');
  await database.createDatabase();
  //await database.removeTables();
  await database.initializeTables();

  // Create 2 default users, so new user won't feel alone.
  let users = [
    { userName: 'John Doe', userId: '26d0a59b-3174-4c34-8e94-5fd07afc65a2' },
    { userName: 'Jane Doe', userId: '4a571e82-5c73-41fb-b46b-1363df02072d' }
  ];
  try {
    await Promise.all(users.map(async element => {
      let user = await database.getUser(element.userId)
      if (!user) {
        let user = await database.createUser(element);
        console.log("Created user:", JSON.stringify(user));
      } else {
        //console.log("User already exists:", user);
      }
    }));
  }
  catch (err) {
    console.error('Error creating default users:', err.message);
  }

  app.use(cors()); // Enable CORS

  // Handle incoming connections
  const handleSocketConnection = require('./socketHandlers');
  handleSocketConnection(io);

  // Start the server
  const port = 30081;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
    .on('error', (err) => {
      console.error(`Error starting server: ${err.message}`);
    });
}

main();