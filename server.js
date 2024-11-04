const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 创建 SQLite 数据库
const db = new sqlite3.Database(':memory:'); // 使用内存数据库

// 初始化数据库表
db.serialize(() => {
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            userID TEXT NOT NULL
        )
    `);
});

// 注册用户接口
app.post('/register', (req, res) => {
    const { email, userID } = req.body;

    const stmt = db.prepare(`INSERT INTO users (email, userID) VALUES (?, ?)`);
    stmt.run(email, userID, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: this.lastID, email, userID });
    });
    stmt.finalize();
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
