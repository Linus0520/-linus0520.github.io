const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, userID } = req.body;

    if (!email || !userID) {
        return res.status(400).json({ error: '邮箱和 userID 是必需的' });
    }

    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                userID TEXT NOT NULL
            )
        `);

        const stmt = db.prepare("INSERT INTO users (email, userID) VALUES (?, ?)");
        stmt.run(email, userID, function (err) {
            if (err) {
                console.error("数据库错误:", err);
                return res.status(500).json({ error: '数据库错误' });
            }
            res.status(201).json({ id: this.lastID, email, userID });
        });
        stmt.finalize();
    });
};
