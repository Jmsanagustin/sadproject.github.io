const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.execute(query, [username, hashedPassword, role], (err, results) => {
            if (err) {
                return res.status(500).send('Database error: ' + err.message);
            }
            res.send('Signup successful! You can now log in.');
        });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});