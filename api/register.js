import { createClient } from '@supabase/supabase-js';

// 用你的 Supabase URL 和密钥替换下面的值
const supabaseUrl = 'https://qajorxdihtgtnzwhkrzy.supabase.co'; // 替换为你的 Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFham9yeGRpaHRndG56d2hrcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzI0MTEsImV4cCI6MjA0NjMwODQxMX0.dSGkFH8LKzld6_j2nvs7UGVTY4ILSKJ6b4_9TdE1ZcY'; // 替换为你的 Supabase 密钥
const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, userID } = req.body;

    // 检查 email 和 userID 是否存在
    if (!email || !userID) {
        return res.status(400).json({ error: '邮箱和 userID 是必需的' });
    }

    try {
        // 尝试插入数据
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, userID }]);

        // 错误处理
        if (error) {
            console.error("插入错误:", error);
            return res.status(500).json({ error: '插入失败，没有返回数据', details: error.message });
        }

        // 确保 data 不为空且有返回
        if (!data || data.length === 0) {
            return res.status(500).json({ error: '插入失败，没有返回数据' });
        }

        // 返回成功响应
        res.status(201).json({ id: data[0].id, email, userID });
    } catch (err) {
        console.error("发生未知错误:", err);
        res.status(500).json({ error: '服务器内部错误', details: err.message });
    }
};
