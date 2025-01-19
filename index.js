// const express = require("express");
// const bodyParser = require("body-parser");
// const { Pool } = require("pg");
// const path = require("path");
// const jwt = require('jsonwebtoken');
// const multer = require('multer');

// const app = express();

// app.use(express.json()); // Parses incoming JSON requests
// app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// const port = 3000;

// // PostgreSQL connection pool
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "grading_platform",
//   password: "HareKrishnaHareKrishna123!",
//   port: 5432,
// });

// // Admin registers new user
// app.post('/register', async (req, res) => {
//   const { username, passwrd, usertype } = req.body;
  
//   try {
//     await pool.query(
//       'INSERT INTO users (username, passwrd, usertype) VALUES ($1, $2, $3)', 
//       [username, passwrd, usertype]
//     );
//     res.status(201).send("User registered successfully.");
//   } catch (err) {
//     res.status(500).send("Error registering user.");
//   }
// });

// // File upload setup
// const upload = multer({ dest: 'uploads/' }); // uploads directory is where students uploaded assignments will be stored

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../frontend")));

// // Token Authentication middleware
// function authenticateToken  (req, res, next)  {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; //Extract the token
//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   } 
//     jwt.verify(token,'HareKrishnaHareKrishna123!',(err,user) => {
//       if (err) {
//         return res.status(403).json({message: "Invalid or expired token"});
//       }
//       req.user = user;
//       next();
//     });
  
//   }

// // Get user info (authenticated request)
// app.get('/auth', authenticateToken, (req, res) => {
//   res.json({
//     id: req.user.id,
//     username: req.user.username,
//     usertype: req.user.usertype,
//   });
// });

// // Login Route
// app.post('/login', async (req, res) => {
//   const { username, passwrd } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     const user = result.rows[0];

//     if (!user || user.passwrd !== passwrd) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Generate a token for the user
//     const token = jwt.sign(
//       { id: user.id, username: user.username, usertype: user.usertype },
//       'HareKrishnaHareKrishna123!',
//       { expiresIn: '1h' }  // Token expiration time (1 hour)
//     );

//     res.status(200).json({ message: 'Login successful', token }); // Send token in the response
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Dashboard Route
// app.get('/dashboard', authenticateToken, (req, res) => {
//   res.sendFile(path.join(__dirname, 'dashboard.html'));
// });
// app.get('/assignGrades', authenticateToken, (req, res) => {
//   res.sendFile(path.join(__dirname, 'grade.html'));
// });
// app.get('/viewGrades', authenticateToken, (req, res) => {
//   res.sendFile(path.join(__dirname, 'grades.html'));
// });
// app.get('/verifyGrades', authenticateToken, (req, res) => {
//   res.sendFile(path.join(__dirname, 'grade.html'));
// });
// app.get('/admin', authenticateToken, (req, res) => {
//   res.sendFile(path.join(__dirname, 'admin.html'));
// });


// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");
const session = require('express-session');
const multer = require('multer');
const cors = require('cors');


const app = express();

app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cors());

const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "grading_platform",
  password: "HareKrishnaHareKrishna123!",
  port: 5432,
});

// Use express-session for session management
app.use(session({
  secret: 'HareKrishnaHareKrishna123!', // Session secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  cookie: {maxAge: 1000*60*60},  // Set to true if using HTTPS
}));

// Admin registers new user
app.post('/register', async (req, res) => {
  const { username, passwrd, usertype } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO users (username, passwrd, usertype) VALUES ($1, $2, $3)', 
      [username, passwrd, usertype]
    );
    res.status(201).send("User registered successfully.");
  } catch (err) {
    res.status(500).send("Error registering user.");
  }
});

// File upload setup
const upload = multer({ dest: 'uploads/' }); // uploads directory is where students uploaded assignments will be stored

// Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function verifyRole (requiredRole) {
  return async (req, res, next) => {
    const user = req.session.user;
    if (!user) {
      res.redirect('/login');
    }
    try {
      const result = await pool.querry('SELECT * FROM users WHERE id = $1 AND usertype = $2',[user.username,requiredRole]);
      if (result.rows.length === 0) {
        return res.status(403).send('Access denied');
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send('Database error');
    }
  };
}

// Authentication middleware (session-based)
function authenticateSession(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Please log in first" });
  }
  next();
}
app.get('/', (req,res) => {

  if (req.session.user)
  {
    res.redirect('/dashboard');
  }
  else 
  {
    res.sendFile('index.html');
  }
});
// Login Route

app.post('/login', async (req, res) => {
  const { username, passwrd } = req.body;
  console.log(username,' ',passwrd);
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || user.passwrd !== passwrd) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Store user info in session
    req.session.user = { id: user.id, username: user.username, usertype: user.usertype };

    res.status(200).json({ message: 'Login successful' }); // Send success message without a token
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Get user info (authenticated request)
app.get('/auth', (req, res) => {
  // res.json({
  //   id: req.session.user.id,
  //   username: req.session.user.username,
  //   usertype: req.session.user.usertype,
  // });
  if (req.session.user) {
    res.status(200).json({message: "Authenticated", usertype: req.session.user.role });
  }
  else {
    res.status(401).send('Unauthorized');
  }
});



// Dashboard Route
app.get('/dashboard',  (req, res) => {
  // res.sendFile(path.join(__dirname, 'dashboard.html'));
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (res.session && req.session.user) {
    res.json({ role: req.session.user.usertype});
  }
  // res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// Grade Assignment Route
app.get('/grade', verifyRole(['ta','teacher','administrator']), (req, res) => {
  res.sendFile(path.join(__dirname, 'grade.html'));
});

// View Grades Route
app.get('/grades', verifyRole(['student','ta','teacher','administrator']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/grades.html'));
});

// Verify Grades Route
app.get('/upload', verifyRole(['student','administrator']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/upload.html'));
});

// Admin Route
app.get('/admin', verifyRole(['administrator']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Logout Route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
    // res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

