
## Design

### Overview
This is a simple chat application that allows users to send messages to each other. The application is built using the following technologies:
- Node.js
- Express
- Socket.io for websocket communication
- PostgreSQL for data storage of users and messages
- Docker/Docker Compose
- React

#### Communication Diagram
![https://www.planttext.com/?text=RPB1JiCm38RlUGfhzxq0Gj5Wd91s0V40NckwI5qIsSuGRu-RTbM7ScgR__FlFtOFeiXQhgFBzWnTo1WLTbz23E_f4dU00iM-NXh02Pb_L-BraJXUKE6J-4PS4QclZymRAfvHQClrP-S6JYL3Y45TxGrxlzG_mNENOgHEVKCQIATWujry17jJAxOHuOCafoZaNSDYJ4E87kuHlY7IJxLOBRr5d68meTBaw1TiGnp7G56bsHLAxgsoci8OH44JT7E1ezYtidSsJ0-PwHPI4RYI20uquwqHLLnC1Rp3KvUwi4tCkhQLNy3_5mqMclKqYpQpWzdQ3_C7](https://www.planttext.com/api/plantuml/png/RPB1JiCm38RlUGfhzxq0Gj5Wd91s0V40NckwI5qIsSuGRu-RTbM7ScgR__FlFtOFeiXQhgFBzWnTo1WLTbz23E_f4dU00iM-NXh02Pb_L-BraJXUKE6J-4PS4QclZymRAfvHQClrP-S6JYL3Y45TxGrxlzG_mNENOgHEVKCQIATWujry17jJAxOHuOCafoZaNSDYJ4E87kuHlY7IJxLOBRr5d68meTBaw1TiGnp7G56bsHLAxgsoci8OH44JT7E1ezYtidSsJ0-PwHPI4RYI20uquwqHLLnC1Rp3KvUwi4tCkhQLNy3_5mqMclKqYpQpWzdQ3_C7)

### Data Model

#### User
Define a user in the system.
- `userId`: a unique identifier for each user in a system. `@all` is a special user id that represents all users.
- `userName`: Displaying name of the user.
```json
{
  "userId": "string",
  "userName": "string"
}
```

#### Message
Define a message sent from a user to others.
- `to`: the user id of the receiver.
- `from`: the user id of the sender.
- `text`: the content of the message.
- `createdAt`: the time when the message was created.
```json
{
  "to": "string",
  "from": "string",
  "text": "string",,
  "createdAt": "string"
}
```

### Database Schema
#### tbl_user
- `uuid`: a unique identifier for each user in a system, aka `userId`.
- `data`: a JSONB column that stores `user` in JSON format.
```sql
tbl_user (
  uuid VARCHAR(37) NOT NULL UNIQUE,
  data JSONB NOT NULL
);
```

#### tbl_message
- `id`: auto-incremented primary key, to indicate messages' order.
- `data`: a JSONB column that stores `message` in JSON format.
```sql
tbl_message (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL
);
```

### WebSocket API
#### `connection`
- socket connection is established.

#### `disconnect`
- socket connection is closed.

#### `login`
- User logs in with `user`.
- Request:
  ```json
  {
    userId: '26d0a59b-3174-4c34-8e94-5fd07afc65a2',
    userName: 'John Doe'
  }
  ```

#### `chat`
- User sends a `message` to other users.
- Request:
  ```json
  {
    to: '@all',
    from: '26d0a59b-3174-4c34-8e94-5fd07afc65a2',
    text: 'to all',
    createdAt: '2/13/2024, 14:40:13'
  }
  ```

#### `getUsers`
- Get all users in the system.
- Request: N/A
- Response:
  - error: 200 OK, or 500 Internal Server Error.
  - users: an array of `user`.
  ```json
  {
    error: 200,
    users: [
      {
        userId: '4a571e82-5c73-41fb-b46b-1363df02072d',
        userName: 'Jane Doe'
      },
      {
        userId: '26d0a59b-3174-4c34-8e94-5fd07afc65a2',
        userName: 'John Doe'
      }
    ]
  }
  ```
