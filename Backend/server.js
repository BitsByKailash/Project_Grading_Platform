const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "grading_platform",
  password: "HareKrishnaHareKrishna123!", // Replace with your password
  port: 5432,
});

// Admin registers new user
app.post('/register',async (req,res) => {
  const {username, passwrd, usertype } = req.body;
  const hashedPassword = await bcrypt.hash(passwrd, 10);
  try {
    await client.querry(
      'INSERT INTO users (username, passwrd, usertype) VALUES ($1, $2, $3)', [username,hashedPassword,usertype]
    );
    res.status(201).send("User registered successfully.")
  } catch (err) {
    res.status(500).send("Error registering user.")
  }
});

//File upload seetup
const upload = multer({ dest:'uploads/'}); //uploads directory is where students uploaded assignments will be stored

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.status(401).send("Access denied.");

  jwt.verify(token, 'your_secret_key',(err, user) => {
    if (err) return res.send("Invalid token.");
    req.user = user;
    next();
  });
};

// Routes
app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/students", async (req, res) => {
  const { name, grade } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (name, grade) VALUES ($1, $2) RETURNING *",
      [name, grade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/login', async (req,res) => {
  const { username, passwrd } = req.body;
  try {
    const result = await client.querry('SELECT * FROM users WHERE username = $1',[username]);
    const user = result.rows[0];
    if (!user) return res.status(401).send("Invalid credentials.");

    const match = await bcrypt.compare(passwrd,user.passwrd);
    if (!match) return res.status(401).send("Invalid credentials.");

    const token = jwt.sign({id: user.id, usertype: user.usertype }, 'your_secret_key');
    res.json({token });
  } catch (err) {

    res.status(500).send("Error logging in.");
  }

});

app.post('/upload', authenticateToken,upload.single('assignment'), async (req,res) => {
  if (req.user.role !== 'student') return res.status(403).send("Only students can upload assignments.");
  
  const filePath = path.join(__dirname,'uploads',req.file.filename);
  try {
    await client.querry(
      'INSERT INTO assignmments (student_id, file_path) VALUES ($1, $2)',[req.user.id, filePath]
    );
    res.status(201).send("Assignment uploaded successfully.");
  } catch (err) {
    res.status(500).send("Error uploading assignment.");
  }
});


app.get('/grades', authenticateToken, async (req,res) => {
  if (req.user.role !== 'student') return res.status(403).send("Wrong endpoint. Try using your own access previlage.");

  try {
    const result = await client.querry(
      'SELECT g.grade, g.feedback, a.file_path FROM grades g JOIN assignments a ON g.assignment_id = a.id WHERE a.student_id = $1',[req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching grades.");
  }
});

app.post('/grade',authenticateToken, async (req,res) => {
  if (req.user.role !== 'ta') return res.status(403).send("Access denied.");
  const { assignmentId, grade, feedback } = req.body;
  try {
    await client.querry(
      'INSERT INTO grades (assignment_id, grade, feedback) VALUES ($1, $2, $3)',[assignmentId, grade, feedback]
    );
    res.status(201).send("Grade submitted successfully.");
  } catch (err) {
    res.status(500).send("Error submitting grades.");
  }
});

app.put('/verify-grade/:id',authenticateToken, async (req,res) => {
  if (req.user.role !== 'teacher') return res.status(403).send("Access denied.");

  const { id } = req.params;
  const {grade, feedback } = req.body;
  try {
    await client.querry(
      'UPDATE grades SET grade = $1, feedback = $2 WHERE id = $3', [grade, feedback, id]
    );
    res.send("Grade updated successfully.");
  } catch (err) {
    res.status(500).send("Error updating grade.");
  }
});

app.post('/admin/create-user',authenticateToken, async (req,res) => {
  if (req.user.role !== 'admin') return res.status(403).send("Access denied.");

  const { username, passwrd, usertype } = req.body;
  const hashPassword = await bcrypt.hash(passwrd, 10);
  try {
    await client.query(
      'INSERT INTO users (username, passwrd, usertype) VALUES ($1, $2, $3)', [username, hashPassword, usertype]
    );
    res.status(201).send("User created successfully.");
  } catch (err) {
    res.status(500).send("Error creating user.");
  }
});

app.listen(port, () => {
  console.log("Server running on http://localhost:${port}");
});
