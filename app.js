const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html

const dataFile = path.join(__dirname, 'users.json');

// Get all users
app.get('/list', (req, res) => {
    const users = JSON.parse(fs.readFileSync(dataFile));
    res.json(users);
});

// Add a new user
app.post('/add', (req, res) => {
    const users = JSON.parse(fs.readFileSync(dataFile));
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
    res.json({ message: 'User added', user: newUser });
});

// Edit a user
app.put('/edit/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync(dataFile));
    const userId = parseInt(req.params.id);
    users = users.map(user => (user.id === userId ? { ...user, ...req.body } : user));
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
    res.json({ message: 'User updated' });
});

// Delete a user
app.delete('/delete/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync(dataFile));
    const userId = parseInt(req.params.id);
    users = users.filter(user => user.id !== userId);
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
    res.json({ message: 'User deleted' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, () => {
    console.log('REST API server running on port 8080');
});
