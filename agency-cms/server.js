const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Папки
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, 'public')));

// БД
const dbPath = path.join(__dirname, 'db.json');
let db = { team: [], theme: {}, links: [] };

if (fs.existsSync(dbPath) && fs.statSync(dbPath).isFile()) {
    try {
        db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch(e) {
        console.log('Ошибка чтения db.json, создаём новый');
    }
}

if (!db.theme || !db.theme.primary_color) {
    db.theme = {
        primary_color: '#3498db',
        secondary_color: '#2c3e50',
        background_color: '#f5f5f5'
    };
}

if (!db.team) db.team = [];
if (!db.links) db.links = [];

const saveDB = () => fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
saveDB();

// API - Команда
app.get('/api/team', (req, res) => res.json(db.team));

app.post('/api/team', upload.single('avatar'), (req, res) => {
    const member = {
        id: uuidv4(),
        full_name: req.body.full_name,
        position: req.body.position,
        bio: req.body.bio,
        avatar_url: req.file ? `/uploads/${req.file.filename}` : null
    };
    db.team.push(member);
    saveDB();
    res.json(member);
});

app.delete('/api/team/:id', (req, res) => {
    db.team = db.team.filter(m => m.id !== req.params.id);
    saveDB();
    res.json({ success: true });
});

// API - Тема
app.get('/api/theme', (req, res) => res.json(db.theme));

app.put('/api/theme', (req, res) => {
    db.theme = { ...db.theme, ...req.body };
    saveDB();
    res.json(db.theme);
});

// API - Ссылки
app.get('/api/links', (req, res) => res.json(db.links));

app.post('/api/links', (req, res) => {
    const link = {
        id: uuidv4(),
        name: req.body.name,
        url: req.body.url,
        type: req.body.type || 'href'
    };
    db.links.push(link);
    saveDB();
    res.json(link);
});

app.delete('/api/links/:id', (req, res) => {
    db.links = db.links.filter(l => l.id !== req.params.id);
    saveDB();
    res.json({ success: true });
});

// Все остальные маршруты - отдаём index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📋 Admin: http://localhost:${PORT}/admin.html`);
    console.log(`🎨 Demo: http://localhost:${PORT}/demo.html`);
});