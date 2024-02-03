# API Documentation

## Authentication

### `POST /api/login`

- Description: Authenticates a user.
- Request body: 
  - `username` (string): User's username.
  - `password` (string): User's password.

## User

### `GET /api/user/:username`

- Description: Retrieve user-related information.

#### Sub-Endpoint: Get User Data

- Endpoint: `/api/user/:username`
- Method: `GET`
- Description: Retrieve data for the specified user.
- Parameters:
  - `username` (string): Target user's username.

#### Sub-Endpoint: Send Message

- Endpoint: `/api/user/:username/message`
- Method: `POST`
- Description: Send a message to the specified user.
- Parameters:
  - `username` (string): Target user's username.
- Request body:
  - `message` (string): The message content.
