// =============================================================================
// IMPORTS AND BASIC EXPRESS SETUP
// =============================================================================
import 'dotenv/config'  // Load environment variables from .env file
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';     // For creating and verifying JWT tokens
import bcrypt from 'bcryptjs';     // For hashing passwords securely

const app = express()
const PORT = process.env.PORT || 3000;

// Setup for ES modules (needed for __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// =============================================================================
// DATABASE SETUP & CONNECTION
// =============================================================================
// MongoDB connection using the connection string from environment variables
// In production, never hardcode database credentials!
const uri = process.env.MONGO_URI;

// Create a MongoClient with API version settings
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Keep the connection open for our CRUD operations
let db;
async function connectDB() {
  try {
    await client.connect();
    db = client.db("school"); // Database name
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
connectDB();

// =============================================================================
// JWT SECRET KEY CONFIGURATION
// =============================================================================
// This is the secret key used to sign and verify JWT tokens
// In production, this MUST be a strong, randomly generated secret stored securely in .env
// Never commit real secrets to version control!
// To generate a secure secret, you can use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-demo-only';

// =============================================================================
// JWT AUTHENTICATION MIDDLEWARE 
// =============================================================================
// This middleware function runs on protected routes to verify the user is authenticated
// It's like a security guard checking IDs at the door
function authenticateToken(req, res, next) {
  // Step 1: Extract the Authorization header from the request
  // Format expected: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers['authorization'];
  
  // Step 2: Extract just the token part (everything after "Bearer ")
  // authHeader?.split(' ')[1] safely gets the second part or undefined
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // Step 3: If no token provided, deny access
  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'You must be logged in to access this resource'
    });
  }

  // Step 4: Verify the token using our secret key
  // jwt.verify() checks if the token is valid and not expired
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Token is invalid or expired
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        message: 'Please log in again'
      });
    }

    // Step 5: Token is valid! Add user info to the request object
    // This allows the route handler to access req.user
    req.user = user; // Contains: { userId, username, iat, exp }
    
    // Step 6: Continue to the actual route handler
    next();
  });
}




// =============================================================================
// HOME ROUTE - Serving HTML Files vs Inline Strings
// =============================================================================
// TEACHING POINT: Notice we're using res.sendFile() instead of res.send()
// This demonstrates proper separation of content and server logic
//
// res.send() = sends strings/data directly from code (not ideal for HTML)
// res.sendFile() = serves actual files from the filesystem (professional approach)
//
// Benefits of serving files:
// - Better organization and maintainability
// - Proper HTML syntax highlighting in editors  
// - Easier for teams to collaborate on frontend/backend separately
// - Can use build tools and preprocessors
// - Follows standard web development patterns
app.get('/', (req, res) => {
  // Send the actual HTML file instead of inline string
  res.sendFile(join(__dirname, 'public', 'index.html'));
})

// AUTHENTICATION ENDPOINTS FOR TEACHING
// Collection: users (documents with username, password fields)

// =============================================================================
// USER REGISTRATION ENDPOINT
// =============================================================================
// This endpoint allows new users to create an account
// POST /api/auth/register
// Body: { username: "string", password: "string" }
app.post('/api/auth/register', async (req, res) => {
  try {
    // Step 1: Extract username and password from request body
    // Destructuring assignment: pulls out these properties into variables
    const { username, password } = req.body;

    // Step 2: Validate input data
    // Always validate user input on the server side!
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Step 3: Check if username is already taken
    // We need unique usernames for authentication
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Step 4: Hash the password for security
    // NEVER store plain text passwords in the database!
    // bcrypt uses a "salt" to make the hash unique even for identical passwords
    const saltRounds = 10; // Higher numbers = more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // What happens: "password123" → "$2b$10$N9qo8uLOickgx2ZMRZoMye..."

    // Step 5: Create the user document 
    const user = { 
      username, 
      password: hashedPassword,  // Store the hashed version, never the original!
      createdAt: new Date() 
    };
    const result = await db.collection('users').insertOne(user);

    console.log(`✅ New user registered: ${username}`);

    // Step 6: Send success response (don't include the password!)
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId,
      username: username
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ error: 'Failed to register user: ' + error.message });
  }
});

// =============================================================================
// USER LOGIN ENDPOINT
// =============================================================================
// This endpoint authenticates users and issues JWT tokens
// POST /api/auth/login  
// Body: { username: "string", password: "string" }
app.post('/api/auth/login', async (req, res) => {
  try {
    // Step 1: Extract credentials from request body
    const { username, password } = req.body;

    /* 
    DESTRUCTURING EXPLANATION:
    The syntax { username, password } = req.body means:
    "Pull out the properties named 'username' and 'password' directly into variables with the same names."
    
    This is equivalent to:
       const username = req.body.username;
       const password = req.body.password;
    
    But more concise!
    */

    // Step 2: Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Step 3: Find the user in the database
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      // Security note: Don't reveal whether the username exists or not
      // This prevents attackers from enumerating valid usernames
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Step 4: Verify the password
    // bcrypt.compare() hashes the provided password and compares it to the stored hash
    // This is secure because we never have to decrypt the stored password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Step 5: Create JWT token (this is the magic! ✨)
    // The token contains user information and proves they are authenticated
    const tokenPayload = {
      userId: user._id,      // Unique identifier
      username: user.username // Username for convenience
      // Note: Never include sensitive info like passwords in the token!
    };
    
    // jwt.sign() creates the token with:
    // - payload: our user data
    // - secret: our secret key (proves the token is from our server)
    // - options: expiration time (security measure)
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    /*
    JWT TOKEN STRUCTURE (3 parts separated by dots):
    header.payload.signature
    
    Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M...
    
    The client will send this token in future requests to prove who they are
    */

    console.log(`✅ User logged in: ${username}`);

    // Step 6: Send the token to the client
    res.json({
      message: 'Login successful',
      token: token,  // This is what the client needs to store!
      user: { id: user._id, username: user.username } // Safe user info
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ error: 'Failed to login: ' + error.message });
  }
});

// =============================================================================
// PROTECTED ROUTE EXAMPLE: Get Current User
// =============================================================================
// This endpoint demonstrates how to protect routes and access authenticated user data
// GET /api/auth/me
// Headers: Authorization: Bearer <jwt-token>
//
// Notice the 'authenticateToken' middleware - it runs BEFORE this function!
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    // At this point, we know the user is authenticated because:
    // 1. They provided a valid JWT token
    // 2. The authenticateToken middleware verified it
    // 3. The middleware added req.user with the token's payload data
    
    console.log('User from token:', req.user); // { userId: "...", username: "...", iat: 1234, exp: 5678 }

    // Look up the full user record from the database
    // We use the userId from the token payload
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } } // Exclude password from results for security
    );

    if (!user) {
      // This shouldn't happen if the token is valid, but handle it just in case
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's information (without the password!)
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user info: ' + error.message });
  }
});

// =============================================================================
// PROTECTED CRUD ENDPOINTS - AUTHENTICATION EXAMPLES
// =============================================================================
// These endpoints demonstrate how to protect resources with authentication
// All of these routes require a valid JWT token to access
// Collection: students (documents with name, age, grade fields)

// CREATE - Add a new student (PROTECTED ROUTE EXAMPLE)
// Notice how 'authenticateToken' middleware protects this endpoint
app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const { name, age, grade } = req.body;

    // Simple validation
    if (!name || !age || !grade) {
      return res.status(400).json({ error: 'Name, age, and grade are required' });
    }

    const student = {
      name,
      age: parseInt(age),
      grade,
      createdBy: req.user.username, // Track who created this student (from JWT token!)
      createdAt: new Date()
    };
    const result = await db.collection('students').insertOne(student);

    console.log(`✅ Student created by ${req.user.username}: ${name}`);

    res.status(201).json({
      message: 'Student created successfully',
      studentId: result.insertedId,
      student: { ...student, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student: ' + error.message });
  }
});

// READ - Get all students (PROTECTED)
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const students = await db.collection('students').find({}).toArray();
    console.log(`📋 ${req.user.username} viewed ${students.length} students`);
    res.json(students); // Return just the array for frontend simplicity
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students: ' + error.message });
  }
});

// UPDATE - Update a student by ID (PROTECTED)
app.put('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, grade } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const updateData = { updatedBy: req.user.username, updatedAt: new Date() };
    if (name) updateData.name = name;
    if (age) updateData.age = parseInt(age);
    if (grade) updateData.grade = grade;

    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(`✏️ Student updated by ${req.user.username}: ${id}`);

    res.json({
      message: 'Student updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student: ' + error.message });
  }
});

// DELETE - Delete a student by ID (PROTECTED)
app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(`🗑️ Student deleted by ${req.user.username}: ${id}`);

    res.json({
      message: 'Student deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student: ' + error.message });
  }
});

// SEED - Add sample data for teaching (PROTECTED)
app.post('/api/seed', authenticateToken, async (req, res) => {
  try {
    // First, clear existing data
    await db.collection('students').deleteMany({});

    // Sample students for teaching
    const sampleStudents = [
      { name: "Alice Johnson", age: 20, grade: "A", createdBy: req.user.username, createdAt: new Date() },
      { name: "Bob Smith", age: 19, grade: "B+", createdBy: req.user.username, createdAt: new Date() },
      { name: "Charlie Brown", age: 21, grade: "A-", createdBy: req.user.username, createdAt: new Date() },
      { name: "Diana Prince", age: 18, grade: "A+", createdBy: req.user.username, createdAt: new Date() },
      { name: "Edward Norton", age: 22, grade: "B", createdBy: req.user.username, createdAt: new Date() },
      { name: "Fiona Apple", age: 19, grade: "A", createdBy: req.user.username, createdAt: new Date() },
      { name: "George Wilson", age: 20, grade: "C+", createdBy: req.user.username, createdAt: new Date() },
      { name: "Hannah Montana", age: 18, grade: "B-", createdBy: req.user.username, createdAt: new Date() }
    ];

    const result = await db.collection('students').insertMany(sampleStudents);

    console.log(`🌱 Database seeded by ${req.user.username}: ${result.insertedCount} students`);

    res.json({
      message: `Database seeded successfully! Added ${result.insertedCount} sample students.`,
      insertedCount: result.insertedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database: ' + error.message });
  }
});

// CLEANUP - Remove all student data (PROTECTED)
app.delete('/api/cleanup', authenticateToken, async (req, res) => {
  try {
    const result = await db.collection('students').deleteMany({});

    console.log(`🧹 Database cleaned by ${req.user.username}: ${result.deletedCount} students removed`);

    res.json({
      message: `Database cleaned successfully! Removed ${result.deletedCount} students.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cleanup database: ' + error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})