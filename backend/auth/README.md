# Express Authentication System

A complete, production-ready authentication system built with Express.js, MongoDB, JWT, and bcrypt.

## Features

✅ **User Registration** - Secure user registration with password hashing  
✅ **User Login** - JWT-based authentication with cookies and header support  
✅ **User Profile** - Protected route to get user profile  
✅ **User Logout** - Secure logout with cookie clearing  
✅ **Password Hashing** - Automatic password hashing with bcrypt  
✅ **JWT Authentication** - Token-based authentication with configurable expiry  
✅ **Cookie Support** - HTTP-only cookies for enhanced security  
✅ **CORS Enabled** - Cross-origin resource sharing configured  
✅ **Email Verification** - Email sending utility (optional)  
✅ **Error Handling** - Comprehensive error handling  

## Project Structure

```
auth-package/
├── config/
│   └── mongoose-connection.js    # MongoDB connection setup
├── controllers/
│   └── user.controller.js        # User authentication logic
├── middlewares/
│   └── isLoggedIn.middleware.js  # JWT verification middleware
├── models/
│   └── user.models.js            # User schema and methods
├── routes/
│   └── user.routes.js            # Authentication routes
├── utils/
│   └── sendingMail.utils.js      # Email sending utility
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies
├── server.js                     # Main server file
└── README.md                     # This file
```

## Installation

1. **Extract the zip file** to your project directory

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in .env:**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRY=24h
   PORT=3000
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### 1. Register User
**POST** `/api/v1/users/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login User
**POST** `/api/v1/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": true,
  "message": "User logged in successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Get User Profile (Protected)
**GET** `/api/v1/users/get-profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```
or cookie will be automatically sent

**Response:**
```json
{
  "status": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 4. Logout (Protected)
**POST** `/api/v1/users/logout`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": true,
  "message": "User logged out successfully"
}
```

## Integration with Frontend

### Using Fetch API

```javascript
// Register
const register = async (name, email, password) => {
  const response = await fetch('http://localhost:3000/api/v1/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return await response.json();
};

// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/api/v1/users/login', {
    method: 'POST',
    credentials: 'include', // Important for cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// Get Profile (with token in header)
const getProfile = async (token) => {
  const response = await fetch('http://localhost:3000/api/v1/users/get-profile', {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    credentials: 'include'
  });
  return await response.json();
};
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true
});

// Set token in header after login
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Register
await api.post('/users/register', { name, email, password });

// Login
const { data } = await api.post('/users/login', { email, password });
localStorage.setItem('token', data.token);

// Get Profile
await api.get('/users/get-profile');
```

## Security Features

- **Password Hashing**: Uses bcrypt with 10 salt rounds
- **JWT Tokens**: Secure token generation with configurable expiry
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS Protection**: Configured for specific origins
- **Input Validation**: All inputs are validated
- **Error Handling**: Consistent error responses

## Customization

### Adding More User Fields

Edit `models/user.models.js` to add more fields:
```javascript
const userSchema = new mongoose.Schema({
  // ... existing fields
  phoneNumber: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    default: null
  }
});
```

### Adding Email Verification

Uncomment the email verification code in:
- `controllers/user.controller.js`
- `utils/sendingMail.utils.js`

Configure email settings in `.env` file.

### Adding Password Reset

You can extend this by adding password reset functionality using the existing `resetPasswordToken` and `resetPasswordTokenExpiry` fields in the User model.

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cookie-parser**: Cookie parsing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **nodemailer**: Email sending (optional)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT signing | ✅ Yes |
| `JWT_EXPIRY` | Token expiration time (e.g., 24h, 7d) | ✅ Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment (development/production) | No |
| `EMAIL_HOST` | SMTP host for emails | No |
| `EMAIL_PORT` | SMTP port | No |
| `EMAIL_USER` | SMTP username | No |
| `EMAIL_PASS` | SMTP password | No |

## Testing with Postman/Thunder Client

1. Import the endpoints into your testing tool
2. Register a new user
3. Login to get the JWT token
4. Use the token in Authorization header for protected routes
5. Test logout functionality

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI is correct
- Check if MongoDB is running
- Ensure network access is allowed in MongoDB Atlas

### JWT Issues
- Make sure JWT_SECRET is set in .env
- Check token expiry time
- Verify token is sent in Authorization header or cookies

### CORS Issues
- Configure CORS origin in server.js
- Enable credentials in frontend requests

## License

ISC

## Support

For issues or questions, please create an issue in your project repository.

---

**Happy Coding! 🚀**
