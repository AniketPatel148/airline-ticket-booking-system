# Airline-ticket-booking-system

This system allows users to register, login, reserve seats, and reset seat reservations. The system ensures secure operations using JWT authentication and includes admin-specific functionalities.

## Features

- User Registration
- User Login
- Seat Reservation
- Seat Reset (Admin Only)

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
    - [Register](#register)
    - [Login](#login)
  - [Seat Reservation](#seat-reservation)
    - [Reserve Seat](#reserve-seat)
    - [Reset Seats](#reset-seats)
- [Models](#models)
  - [User](#user)
  - [Seat](#seat)
- [Middleware](#middleware)
  - [Auth](#auth)
- [Testing](#testing)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/seat-reservation-api.git
    cd seat-reservation-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:
```bash
JWT_SECRET=your_jwt_secret
```

## Running the App

Start the server:
```bash
npm start
```
The server will run on http://localhost:3000.
## API Documentation

### Authentication

#### Register

**Endpoint:** `POST /auth/register`

Registers a new user.

**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```
**Response:**
- `201 Created` on success with token.
```json
{
    "token": "string"
}
```
- `400 Bad Request` if the email is already in use.
```json
{
    "error": "Email already in use!"
}
```
- `500 Internal Server` Error on server error.
```json
{
    "error": "Server error"
}
```
#### Login

**Endpoint:** `POST /auth/login`

Authenticates an existing user.

**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```
**Response:**
- `200 Ok` on success with token.
```json
{
    "token": "string"
}
```
- `401 Unauthorized` if credentials are invalid.
```json
{
    "error": "Email already in use!"
}
```
- `500 Internal Server` Error on server error.
```json
{
    "error": "Server error"
}
```

### Seat reservation

#### Reserve seat

**Endpoint:** `POST /seat/reserve`

Reserves a seat for a passenger. Requires authentication.

**Request Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```
**Request Body:**
```json
{
    "seatNumber": "number"
}
```
**Response:**
- `200 Ok` on success.
```json
{
    "success": "Seat reserved successfully"
}
```
- `400 Bad Request`  if the seat number is invalid or the seat is already reserved.
```json
{
    "error":"Invalid seat number"
}
```
```json
{
    "error": "Seat already reserved"
}
```
- `500 Internal Server` Error on server error.
```json
{
    "error": "Server error"
}
```
#### Reset Seats

**Endpoint:** `POST /seat/reset`

Resets all seat reservations. Requires authentication and admin privileges.

**Request Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```
**Response:**
- `200 Ok` on success.
```json
{
    "success": "All seats reset successfully"
}
```
- `403 Forbidden` if the user is not an admin.
```json
{
    "error": "Only admin can reset seats"
}
```
- `500 Internal Server` Error on server error.
```json
{
    "error": "Server error"
}
```
## Models

### User

- `email` (string): User's email, unique.
- `password` (string): User's password, hashed.
- `isAdmin` (boolean): Indicates if the user is an admin. Defaults to `false`.

### Seat

- `seatNumber` (number): Seat number, unique.
- `passengerPhone` (string, nullable): Passenger's phone number.
- `passengerName` (string, nullable): Passenger's name.
- `passengerAge` (number, nullable): Passenger's age.
- `isReserved` (boolean): Indicates if the seat is reserved. Defaults to `false`.

## Middleware

### Auth

Middleware to authenticate users using JWT. Adds `user` object to `req` if token is valid.

**Usage:**
```javascript
const auth = require("../middleware/auth");

router.post("/reserve", auth, seatController.reserveSeat);
router.post("/reset", auth, seatController.resetSeats);
```
## Testing

To run tests and get test coverage, use:
```bash
npm test
```
![test-coverage report](https://github.com/user-attachments/assets/dbab5bd4-7e29-4ab8-b480-dce14b1b655a)
