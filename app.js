const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./user.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
  if (err) return console.error(err.message);
});

app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} request to ${req.path}`);
  next();
});

// POST request to add a new user
app.post('/user', (req, res) => {
  try {
    const { name, email, role, team, status, avatar } = req.body;
    const sql = `INSERT INTO user(name, email, role, team, status, avatar) VALUES(?, ?, ?, ?, ?, ?)`;
    db.run(sql, [name, email, role, team, status, avatar], (err) => {
      if (err) {
        return res.json({
          status: 400,
          success: false,
          error: err.message,
        });
      }
      res.json({
        status: 200,
        success: true,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
      error: error.message,
    });
  }
});

// GET request to retrieve all users
app.get('/user', (req, res) => {
  const sql = `SELECT * FROM user`;
  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.json({
          status: 400,
          success: false,
          error: err.message,
        });
      }
      if (rows.length < 1) {
        return res.json({
          status: 404,
          success: false,
          message: 'No users found',
        });
      }
      res.json({
        data: rows,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
      error: error.message,
    });
  }
});

// GET request to retrieve a single user by id
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM user WHERE id = ?`;
  try {
    db.get(sql, [id], (err, row) => {
      if (err) {
        return res.json({
          status: 400,
          success: false,
          error: err.message,
        });
      }
      if (!row) {
        return res.json({
          status: 404,
          success: false,
          message: 'User not found',
        });
      }
      res.json({
        data: row,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
      error: error.message,
    });
  }
});

// DELETE request to delete a user
app.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM user WHERE id = ?`;
  try {
    db.run(sql, [id], (err) => {
      if (err) {
        return res.json({
          status: 400,
          success: false,
          error: err.message,
        });
      }
      res.json({
        status: 200,
        success: true,
        message: 'User deleted successfully',
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
      error: error.message,
    });
  }
});

// PUT request to update a user's details
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role, team, status, avatar } = req.body;
  const sql = `UPDATE user SET name = ?, email = ?, role = ?, team = ?, status = ?, avatar = ? WHERE id = ?`;
  try {
    db.run(sql, [name, email, role, team, status, avatar, id], (err) => {
      if (err) {
        return res.json({
          status: 400,
          success: false,
          error: err.message,
        });
      }
      res.json({
        status: 200,
        success: true,
        message: 'User updated successfully',
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
