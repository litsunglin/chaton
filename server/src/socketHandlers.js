const { v4: uuid } = require('uuid');
const database = require('./database');

async function getUsersData() {
  // Get users from the database
  let quser = await database.getUsers();

  // Check if quser.rows is defined and is an array
  if (!Array.isArray(quser)) {
    console.error('Error getting users: quser.rows is not an array');
    return [];
  }

  // Extract data from each user and insert it into the users array
  let users = [];
  for (let i = 0; i < quser.length; i++) {
    users.push(quser[i].data);
  }

  return users;
}

module.exports = function (io) {
  io.on('connection', (socket) => {
    const user = socket.handshake.query.user;
    console.log(`A client connected, client: ${socket.id}`);

    // Emit a welcome message to the user
    //socket.emit('welcome', `Welcome <${user.userName}> to the chat!`);

    socket.on('getUsers', async (msg) => {
      // Get users from database
      try {
        let users = await getUsersData();

        // make a json obj with error code and users
        msg = { error: 200, users: users };
        socket.emit('getUsers', msg);
        console.log('Sent users to the client:', users);
      } catch (err) {
        console.error('Error getting users:', err.message);
        msg = { error: 500, users: '{}' };
        socket.emit('getUsers', msg);
      } finally {
      }
    });

    // Handle login events
    socket.on('login', async (user) => {
      try {
        console.log('User logged in:', user);
    
        let duser = await database.getUserByName(user.userName);
    
        // Add user to users if not already in the list
        if (!duser) {
          await database.createUser(user);
          console.log('Created new user:', user);
        } else {
          console.log('User already exists:', user);
        }
    
        let users = await getUsersData();
        msg = { error: 200, users: users };
        io.emit('getUsers', msg);
    
        // Sent previous messages to the user
        let dmessages = await database.getMessagesByReceivedUser(user.userId);
        let messages = [];
        for (let i = 0; i < dmessages.length; i++) {
          messages.push(dmessages[i].data);
          socket.emit('chat', dmessages[i].data);
        }
        console.log('Sent previous messages to the user:', messages);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });

    // Handle chat message events
    socket.on('chat', (msg) => {
      console.log('Receieved message:', msg);

      // Broadcast the message to all connected clients
      io.emit('chat', msg);

      // Save the message to the database
      database.insertMessage(msg);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};