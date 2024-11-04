const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // 使用环境变量中的端口

// 中间件
app.use(cors({
    origin: 'https://linus0520.github.io' // 允许来自你的前端的请求
}));
app.use(bodyParser.json());

// 创建 SQLite 数据库
const db = new sqlite3.Database(':memory:'); // 使用内存数据库，如果需要持久化，可以改为 `new sqlite3.Database('database.db')`

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
    console.log('请求体:', req.body); // 打印请求体
    const { email, userID } = req.body;

    if (!email || !userID) {
        return res.status(400).json({ error: '邮箱和 userID 是必需的' });
    }

    const stmt = db.prepare(`INSERT INTO users (email, userID) VALUES (?, ?)`);
    stmt.run(email, userID, function(err) {
        if (err) {
            console.error('数据库错误:', err); // 打印数据库错误
            return res.status(500).json({ error: '数据库错误' });
        }
        res.status(201).json({ id: this.lastID, email, userID });
    });
    stmt.finalize();
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
