# Back-Byte-Bandits

This project is a backend API to manage transactions, ads, chats, users, and more. It provides functionalities for creating ads, user management, real-time chat, and buy-sell transactions.

## Content table
- [Installation](#installation)
- [Main Endpoints](#main-endpoints)
- [Database](#database)
- [Internationalization](#internationalization)
- [Authentication and Middleware](#authentication-and-middleware)
- [Email Services](#email-services)
- [Sockets](#sockets)
- [Contributing](#contributing)

## Installation

```bash
#Clone repository
https://github.com/byte-bandis/back-byte-bandits

# Install dependencies 
npm install

# Start the Application
npm start

# Development Mode (using nodemon)
npm run dev

# Initialize the Database
npm run initDB

# Build the Application
npm run build

# Process Management with PM2
npm run pm2:dev

# Mailing Service
npm run mailing

# Create .env file with next variables:

MONGO_URI=mongodb://localhost:27017/byte-bandits
JWT_SECRET=supersecret
JWT_EXPIRE=7d
USER_NAME_PLACEHOLDER=------
USER_LAST_NAME_PLACEHOLDER=------
MOBILE_PHONE_NUMBER_PLACEHOLDER=--- --- ---
CREDIT_CARD_DEFAULT_PLACEHOLDER=----
DEV_HOST_URI=http://localhost:5173
HOST_URI=https://www.icraftyou.es

# serve at http://localhost:4000/

npm start
```

### Prerequisites

- **Node.js**: Node.js v14 or later
- **MongoDB**: MongoDB as its database
- **npm**: Install dependencies using npm.
- **bcryptjs**: For password hashing and encryption
- **dotenv**: Environment variable management
- **Express**: Web framework for Node.js
- **jsonwebtoken**: Used for token-based authentication.
- **mongoose**: For interacting with MongoDB
- **nodemailer**: For sending emails
- **helmet**: security headers
- **socket.io**: real-time communication
- **cors**: cross-origin resource sharing


## Main Endpoints 
### Users
- `POST /api/user/register`: Register an user
- `POST /api/user/login`: Authenticate an un usuario and return a JWT token

### Ads
- `GET /api/ads`: Return all ads
- `POST /api/ads`: Create a new ad
- `POST /api/ads/:id/buy`: Buy an ad

### Likes
- `POST /api/likes`: Add a like to an ad
- `GET /api/likes`: Return user wishlist

### Chat
- `POST /api/chat`: Create a chat
- `GET /api/chat`: Get all chats

### Transacciones
- `GET /api/transactions`: Seller obtain all purchases received 
- `POST /api/transactions/handleTransactions`: Accept o reject a transaction 
- `GET /api/transactions`: Buyer and seller can check all orders realized and completed transactions

### User routes
- `GET /api/user/usersprofiles`: Return all user public profiles
- `PUT /api/user/:username/mydata`: User fill basic information as name, lastname, mobile number...

### Comments
- `GET /api/comments/:id`: Obtain all comments about an ad
- `POST /api/comments/:id`: Create a new comment


## Database
Database is based on MongoDB and file `utils/connectMongoose.js` manage connection to database. 

#### Users

- Stores user information such as username, email, hashed passwords, and any other personal data (e.g., name, mobile number).
- A user can have multiple roles (e.g., buyer, seller).

#### Ads

- Represents an advertisement for a product or service.
- Contains details such as the product name, description, price, image, and condition toBuy o toSell.
- Each ad is associated with a user (the seller).

#### Likes

Represents the "wishlist" or liked ads by a user.
Tracks ads that users have shown interest in.

### Chat

Enables direct communication between users (e.g., buyers and sellers).
Chats are linked to users and ads, allowing discussions about specific ads.

### Transactions

- Handles all purchases and sales within the platform.
- Tracks the status of a transaction (e.g., pending, accepted, rejected) and links it to both the buyer and the seller.

### User Profiles

- Manages public user profiles that display basic information about the user (e.g., name, ads).

### Comment
- Enables users to leave comments or reviews on ads.
- Each comment is linked to an ad and a user (the commenter).


### Database Relationships

#### One-to-Many:
-A user can create multiple ads.
-A user can initiate multiple transactions (buy/sell).
-A user can like multiple ads (wishlist).

#### Many-to-Many:
- Users and ads have a many-to-many relationship through likes (i.e., multiple users can like the same ad).
- Users and chats are also many-to-many, as multiple users can participate in different chats.



## Internationalization
The project uses i18next for internationalization. Translation files are located in:

- lib/i18n.js: Main internationalization configuration.
- lib/locales/: Contains translation files in English (en.json) and Spanish (es.json).

## Authentication and Middleware
- Authentication is handled using JWT. The authenticate.js middleware is used to protect private routes.

- Error control: errorResponde.js and errors.js. Handles errors globally and returns appropriate responses.

## Email Services
- Email service is implemented with Nodemailer and cote for handling email queues.

- mailingService.js: Email configuration and sending.


## Sockets
Websockets are used to enable real-time communication in user chats.

Related files are located in the sockets folder:

- chatSocket.js: Controls real-time chat events.

## Contributing
To contribute to the project, follow these steps:

- Fork the repository
- Create a new branch (git checkout -b feature/new-feature)   
- Commit your changes (git commit -m 'Add new feature')
- Push your changes (git push origin feature/new-feature)
- Create a Pull Request.