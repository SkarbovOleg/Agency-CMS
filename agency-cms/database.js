const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS team (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            position TEXT NOT NULL,
            bio TEXT,
            avatar_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS theme (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            primary_color TEXT DEFAULT '#3498db',
            secondary_color TEXT DEFAULT '#2c3e50',
            background_color TEXT DEFAULT '#f5f5f5',
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS links (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            type TEXT DEFAULT 'href'
        )
    `);

    db.get(`SELECT * FROM theme WHERE id = 1`, (err, row) => {
        if (!row) {
            db.run(`
                INSERT INTO theme (id, primary_color, secondary_color, background_color)
                VALUES (1, '#3498db', '#2c3e50', '#f5f5f5')
            `);
        }
    });
});

module.exports = db;
