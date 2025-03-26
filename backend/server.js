const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',     // Change to your database host
    user: 'root',          // Your database user
    password: 'Dhanush@200407',          // Your database password
    database: 'booksky'    // Name of your database
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

// API Endpoint to get tasks for the logged-in user
app.get('/tasks', (req, res) => {
    const { userId } = req.query; // Pass userId as a query parameter
    db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// API Endpoint to add a new task for the logged-in user
app.post('/add-task', (req, res) => {
    const { heading, work, description, userId } = req.body;
    db.query(
        'INSERT INTO tasks (heading, work, description, user_id) VALUES (?, ?, ?, ?)',
        [heading, work, description, userId],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ message: 'Task added successfully!' });
        }
    );
});

// API Endpoint to delete a task
app.delete('/delete-task/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Task deleted successfully!' });
    });
});

// Endpoint for User Signup
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Insert the new user into the database
        db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password],
            (err, results) => {
                if (err) return res.status(500).json({ message: "Signup failed" });

                res.status(200).json({ message: "User signed up successfully!" });
            }
        );
    });
});

// Endpoint for User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verify the user's email and password
    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (results.length > 0) {
                res.status(200).json({ message: "Login successful!", user: results[0] });
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        }
    );
});

// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    });
  });
  
  // Delete a user
  app.delete('/delete-user/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json({ message: 'User deleted successfully!' });
    });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
