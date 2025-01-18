const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

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

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

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

app.listen(port, () => {
  console.log("Server running on http://localhost:${port}");
});
