import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql';

dotenv.config(); // Konfigurasi dotenv

const app = express();
app.use(express.json());

// Koneksi database
export const db = mysql.createConnection({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "*Nautika2024",
  database: process.env.DATABASE || "notes_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

// Endpoint membuat notes baru
app.post('/notes', (req, res) => {
  const { title, datetime, note } = req.body;
  const query = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
  db.query(query, [title, datetime, note], (err, result) => {
    if (err) throw err;
    res.status(201).send({ id: result.insertId });
  });
});

// Endpoint menampilkan semua notes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});

// Endpoint menampilkan satu notes
app.get('/notes/:id', (req, res) => {
  const query = 'SELECT * FROM notes WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(404).send('Note not found');
    res.status(200).json(result[0]);
  });
});

// Endpoint mengubah notes
app.put('/notes/:id', (req, res) => {
  const { title, datetime, note } = req.body;
  const query = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
  db.query(query, [title, datetime, note, req.params.id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) return res.status(404).send('Note not found');
    res.status(200).send('Note updated successfully');
  });
});

// Endpoint menghapus notes
app.delete('/notes/:id', (req, res) => {
  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) return res.status(404).send('Note not found');
    res.status(200).send('Note deleted successfully');
  });
});

// Jalankan server
app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
