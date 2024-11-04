// pages/api/register.js
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabaseUrl = 'https://qajorxdihtgtnzwhkrzy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFham9yeGRpaHRndG56d2hrcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzI0MTEsImV4cCI6MjA0NjMwODQxMX0.dSGkFH8LKzld6_j2nvs7UGVTY4ILSKJ6b4_9TdE1ZcY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, userID } = req.body;

    if (!email || !userID) {
        return res.status(400).json({ error: '邮箱和 userID 是必需的' });
    }

    // 尝试将数据插入数据库
    const { data, error } = await supabase
        .from('users')
        .insert([{ email, userID }]);

    // 错误处理
    if (error) {
        console.error("数据库错误:", error.message); // 增加详细错误信息
        return res.status(500).json({ error: '数据库错误', details: error.message });
    }

    // 确保 data 不为空
    if (!data || data.length === 0) {
        return res.status(500).json({ error: '插入失败，没有返回数据' });
    }

    res.status(201).json({ id: data[0].id, email, userID });
};
