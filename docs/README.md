# 🔐 JWT Authentication Learning Demo

A comprehensive, educational Express.js application that demonstrates JWT (JSON Web Token) authentication concepts with MongoDB integration.

## 🎯 Learning Objectives

After working through this demo, you will understand:

- How user registration and login work
- Password hashing with bcrypt for security
- JWT token creation, structure, and verification
- Protecting API routes with authentication middleware
- Frontend token storage and usage patterns
- Best practices for secure authentication

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier works!)
- Code editor (VS Code recommended)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd stunning-octo-fortnight-hello-express
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
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

### 3. Run the Application  
```bash
npm start
# or for development with auto-restart:
npm run dev
```

Visit `http://localhost:3000` to start learning!

## 📋 Demo Pages

### 🏠 [Home Page](http://localhost:3000)
- Overview of all authentication concepts
- Navigation to different demo sections
- Educational content and learning objectives

### 🔐 [Authentication Demo](http://localhost:3000/auth.html) 
- User registration and login forms
- Live JWT token display and explanation
- Password hashing demonstration
- **Start here first!**

### 🎯 [Protected Route Demo](http://localhost:3000/protected-demo.html)
- Experience how protected routes work
- Automatic redirect behavior
- Authentication state management
- Real-world access control patterns

### 📝 [Protected CRUD Demo](http://localhost:3000/student-crud.html)
- Full CRUD operations with authentication
- Real database interactions
- Protected API endpoint examples
- Token-based authorization

## 🔧 Technical Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB with educational seed data
- **Authentication:** JWT tokens with comprehensive validation
- **Frontend:** Bootstrap 5 + Vanilla JavaScript
- **Security:** bcrypt password hashing, protected middleware
- **Educational:** Extensive inline comments and explanations

## 📚 Educational Features

### 🎓 Comprehensive Comments
Every authentication concept is explained with detailed comments throughout the codebase:
- JWT middleware implementation
- Password hashing with salt rounds
- Token generation and verification
- Protected route patterns
- Frontend token storage strategies

### 🔍 Real-World Examples
- Industry-standard authentication patterns
- Security best practices
- Error handling and validation
- Professional code organization
- Production-ready deployment setup

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

## 🚀 Deployment Ready

This project is configured for easy deployment to:
- **Heroku:** Ready with proper `start` script
- **Vercel:** Configured with modern ES modules
- **Railway:** Environment variable integration
- **Any Node.js hosting:** Standard Express.js setup

## 🧑‍🏫 Teaching Notes

This project is designed specifically for education:

1. **Start with authentication basics** at `/auth.html`
2. **Explore protected routes** at `/protected-demo.html`  
3. **See real-world application** at `/student-crud.html`
4. **Examine the code** - every concept is thoroughly commented
5. **Experiment safely** - includes data seeding and cleanup tools

## 📖 Next Steps

After mastering JWT authentication, consider exploring:
- **Authorization (authZ)** - Role-based access control
- **OAuth integration** - Social login providers  
- **Session management** - Advanced token strategies
- **Security headers** - Additional protection layers
- **API rate limiting** - Production security measures

## 🤝 Contributing

This is an educational project! Feel free to:
- Add more authentication examples
- Improve educational comments
- Enhance security demonstrations
- Create additional learning materials

---

**Built for learning JWT authentication concepts** 🎓  
*Educational demo project with production-ready patterns*# 🔐 JWT Authentication Learning Demo

A comprehensive, educational Express.js application that demonstrates JWT (JSON Web Token) authentication concepts with MongoDB integration.

## 🎯 Learning Objectives

After working through this demo, you will understand:

- How user registration and login work
- Password hashing with bcrypt for security
- JWT token creation, structure, and verification
- Protecting API routes with authentication middleware
- Frontend token storage and usage patterns
- Best practices for secure authentication

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier works!)
- Code editor (VS Code recommended)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd stunning-octo-fortnight-hello-express
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
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

### 3. Run the Application  
```bash
npm start
# or for development with auto-restart:
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:3000`

## 📚 What's Included

### Files Structure
```
├── app.mjs                 # Main server with authentication logic
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this!)
├── public/
│   ├── index.html         # Home page (demonstrates res.sendFile vs res.send)
│   ├── auth.html          # Authentication demo interface
│   ├── protected-demo.html # Protected route demonstration
│   └── student-crud.html  # Protected CRUD operations demo
└── README.md             # This guide!
```

### 💡 Teaching Concepts Demonstrated

#### **Proper HTML File Serving**
The home route shows the difference between:
```javascript
// ❌ Inline HTML (hard to maintain)
app.get('/', (req, res) => {
  res.send(`<h1>Hello World</h1>`);
});

// ✅ Serving actual files (professional approach)
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});
```

#### **Why serve files instead of inline HTML?**
- Better code organization and maintainability
- Proper HTML syntax highlighting in editors
- Easier team collaboration (frontend/backend separation)
- Can use build tools and preprocessors
- Follows industry standard practices

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

## 🧪 Testing the Demo

### 1. Test Registration
1. Go to `http://localhost:3000`
2. Click "Authentication Demo"
3. Fill out the registration form
4. Check console logs for success

### 2. Test Login
1. Use the username/password you just created
2. Login and observe the JWT token displayed
3. Notice the UI changes to show you're authenticated

### 3. Test Protected Routes
1. Click "Test Protected Route" to see /api/auth/me in action  
2. Go to "Protected CRUD Demo" to see authentication in action
3. Try accessing routes without being logged in (should be blocked)

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

## 🤝 Contributing

This is an educational project! Feel free to:
- Add more authentication examples
- Improve error handling
- Add more security features
- Create additional frontend examples

---
*Built for learning JWT authentication concepts* 🎓 
