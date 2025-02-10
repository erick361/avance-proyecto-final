require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde el directorio 'public' del frontend
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Rutas CRUD para vehicles
app.get('/vehicles', (req, res) => {
    const sql = 'SELECT * FROM vehicles';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/vehicles', (req, res) => {
    const { name, year, type } = req.body;
    let image = '';
    if (type === 'SUV') {
        image = '/public/suv.png';
    } else if (type === 'Sedan') {
        image = '/public/sedan.png';
    }
    const sql = 'INSERT INTO vehicles (name, year, type, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, year, type, image], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId });
    });
});

app.put('/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const { name, year, type } = req.body;
    let image = '';
    if (type === 'SUV') {
        image = '/public/suv.png';
    } else if (type === 'Sedan') {
        image = '/public/sedan.png';
    }
    const sql = 'UPDATE vehicles SET name = ?, year = ?, type = ?, image = ? WHERE id = ?';
    db.query(sql, [name, year, type, image, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Vehicle updated' });
    });
});

app.delete('/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM vehicles WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Vehicle deleted' });
    });
});

// Rutas de autenticación para users
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'User registered' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(401).json({ message: 'Authentication failed' });

        const user = results[0];
        if (password !== user.password) return res.status(401).json({ message: 'Authentication failed' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
