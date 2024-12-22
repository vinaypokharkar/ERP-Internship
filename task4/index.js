const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection
const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'mydatabase',
    password: '1234',
    port: 5432,
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.send(`User added with ID: ${result.rows[0].id}`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error saving data to the database.');
    }
});

// app.get(`./:${result.rows[0].id}`, (req,res) => {
//     res.send("This is user one");
// });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
