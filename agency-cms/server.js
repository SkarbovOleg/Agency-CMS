const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, '../public')));

// ============ API КОМАНДА ============

app.get('/api/team', (req, res) => {
    db.all(`SELECT * FROM team ORDER BY created_at DESC`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.post('/api/team', upload.single('avatar'), (req, res) => {
    const id = uuidv4();
    const { full_name, position, bio } = req.body;
    const avatar_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!full_name || !position) {
        return res.status(400).json({ error: 'full_name и position обязательны' });
    }

    db.run(
        `INSERT INTO team (id, full_name, position, bio, avatar_url) VALUES (?, ?, ?, ?, ?)`,
        [id, full_name, position, bio || '', avatar_url],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, full_name, position, bio: bio || '', avatar_url });
        }
    );
});

app.delete('/api/team/:id', (req, res) => {
    db.run(`DELETE FROM team WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, deleted: this.changes });
    });
});

// ============ API ТЕМА ============

app.get('/api/theme', (req, res) => {
    db.get(`SELECT primary_color, secondary_color, background_color FROM theme WHERE id = 1`, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || { primary_color: '#3498db', secondary_color: '#2c3e50', background_color: '#f5f5f5' });
    });
});

app.put('/api/theme', (req, res) => {
    const { primary_color, secondary_color, background_color } = req.body;
    db.run(
        `UPDATE theme SET primary_color = COALESCE(?, primary_color), secondary_color = COALESCE(?, secondary_color), background_color = COALESCE(?, background_color), updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
        [primary_color, secondary_color, background_color],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

// ============ API ССЫЛКИ ============

app.get('/api/links', (req, res) => {
    db.all(`SELECT * FROM links`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.post('/api/links', (req, res) => {
    const id = uuidv4();
    const { name, url, type } = req.body;
    
    if (!name || !url) {
        return res.status(400).json({ error: 'name и url обязательны' });
    }

    db.run(
        `INSERT INTO links (id, name, url, type) VALUES (?, ?, ?, ?)`,
        [id, name, url, type || 'href'],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, name, url, type: type || 'href' });
        }
    );
});

app.delete('/api/links/:id', (req, res) => {
    db.run(`DELETE FROM links WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, deleted: this.changes });
    });
});

// ============ ФРОНТЕНД ============
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/demo.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/demo.html'));
});

app.get('/embed.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/embed.js'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер: http://localhost:${PORT}`);
    console.log(`📋 Админка: http://localhost:${PORT}/admin.html`);
    console.log(`🎨 Демо: http://localhost:${PORT}/demo.html`);
});
