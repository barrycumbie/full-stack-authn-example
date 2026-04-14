# 🔐 JWT Authentication Learning Demo

A comprehensive, educational Express.js application that demonstrates JWT (JSON Web Token) authentication concepts with MongoDB integration.

- How user registration and login work
- Password hashing with bcrypt for security
- JWT token creation, structure, and verification
- Protecting API routes with authentication middleware
- Frontend token storage and usage patterns
- Best practices for secure authentication

### Environment Setup
Include in yoru `.env` file in the root directory:
```env
# MongoDB connection string from MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# JWT Secret Key - GENERATE A NEW ONE FOR PRODUCTION!
# You can generate a secure secret with this command:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Optional: Set port (defaults to 3000)
PORT=3000
```

### 🛡️ Security Concepts Covered
- **Authentication vs Authorization**
- **JWT token structure and claims**
- **Password security with bcrypt**
- **Protected route middleware**
- **Token storage and management**
- **Security headers and CORS**

## 🗂️ Project Structure

```
├── app.mjs                 # Main server with detailed JWT education
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variable template
└── public/               # Frontend files
    ├── index.html        # Landing page
    ├── auth.html         # Authentication interface
    ├── protected-demo.html # Protected route demonstration
    ├── student-crud.html # Authenticated CRUD operations
    ├── styles/           # Organized CSS files
    │   ├── auth.css
    │   ├── index.css
    │   ├── protected-demo.css
    │   └── student-crud.css
    └── scripts/          # Organized JavaScript files
        ├── auth.js
        ├── index.js
        ├── protected-demo.js
        └── student-crud.js
```

## 🔑 Authentication Flow Explained

### 1. User Registration
```javascript
// What happens when a user registers:
POST /api/auth/register
{
  "username": "student123",
  "password": "mypassword"
}

// Server process:
1. Validates input (username exists, password length)
2. Checks if username is already taken
3. Hashes password with bcrypt (NEVER store plain passwords!)
4. Saves user to MongoDB
5. Returns success message
```

### 2. User Login & Token Creation
```javascript
// What happens when a user logs in:
POST /api/auth/login
{
  "username": "student123", 
  "password": "mypassword"
}

// Server process:
1. Finds user in database
2. Compares provided password with stored hash using bcrypt
3. If valid, creates JWT token with user info
4. Returns token to client

// JWT Token Structure (3 parts):
// header.payload.signature
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M...
```

### 3. Accessing Protected Routes
```javascript
// Client sends token in Authorization header:
GET /api/auth/me
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Server middleware process:
1. Extracts token from "Bearer TOKEN" format
2. Verifies token signature using JWT_SECRET
3. Checks if token is expired
4. If valid, adds user info to req.user
5. Calls next() to continue to route handler
```

## 🛡️ Security Best Practices Demonstrated

### Password Security
- ✅ **Password hashing**: Uses bcrypt with salt rounds
- ✅ **No plain text storage**: Passwords are always hashed
- ✅ **Minimum length**: Enforces 6+ character passwords

### JWT Security  
- ✅ **Secret key protection**: Uses environment variables
- ✅ **Token expiration**: Tokens expire after 24 hours
- ✅ **Secure headers**: Uses proper Authorization header format

### Input Validation
- ✅ **Server-side validation**: Never trust client input
- ✅ **Error handling**: Graceful error messages
- ✅ **SQL injection prevention**: MongoDB queries are parameterized


## 🔧 How to Generate JWT Secrets

### Method 1: Node.js Command Line
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 2: Online Generator
Visit: https://jwt.io/ and use their secret generator

### Method 3: OpenSSL Command
```bash
openssl rand -hex 64
```

**Important**: 
- Use a different secret for each environment (dev, staging, prod)
- Never commit secrets to version control
- Rotate secrets periodically for security

## 🎓 Advanced Concepts to Explore

### Token Refresh Patterns
- Implement refresh tokens for enhanced security
- Short-lived access tokens + longer-lived refresh tokens

### Role-Based Authorization (authZ)
- Add user roles (admin, user, moderator)
- Protect routes based on user permissions

### Password Reset Flow
- Implement "forgot password" functionality  
- Email-based reset tokens with expiration

### Environment-Specific Security
- HTTPS in production
- Secure cookie settings
- CORS configuration

## 🐛 Common Issues & Solutions

### "Failed to connect to MongoDB"
- Check your MONGO_URI in .env file
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify username/password in connection string

### "Invalid token" errors
- Check that JWT_SECRET matches between token creation and verification
- Verify token isn't expired (check browser localStorage)
- Ensure Authorization header format: "Bearer TOKEN"

### CORS issues (if building separate frontend)
```javascript
// Add CORS middleware if needed:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
```

## 📖 Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [bcrypt documentation](https://www.npmjs.com/package/bcryptjs)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

