import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qajorxdihtgtnzwhkrzy.supabase.co'; // 替换为你的 Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFham9yeGRpaHRndG56d2hrcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzI0MTEsImV4cCI6MjA0NjMwODQxMX0.dSGkFH8LKzld6_j2nvs7UGVTY4ILSKJ6b4_9TdE1ZcY'; // 替换为你的 Supabase 密钥
const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, userID } = req.body;

    // 检查邮箱和 userID 是否存在
    if (!email || !userID) {
        return res.status(400).json({ error: '邮箱和 userID 是必需的' });
    }

    try {
        // 检查是否已存在相同的 userID 或 email
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${email},userID.eq.${userID}`);

        if (fetchError) {
            console.error("获取用户错误:", fetchError);
            return res.status(500).json({ error: '获取用户失败', details: fetchError.message });
        }

        if (existingUser.length > 0) {
            return res.status(400).json({ error: '用户已存在' });
        }

        // 插入新用户
        const { data, error: insertError } = await supabase
            .from('users')
            .insert([{ email, userID }]); // 确保此处的 userID 对应于数据库中的列名

        if (insertError) {
            console.error("插入错误:", insertError);
            return res.status(500).json({ error: '插入失败', details: insertError.message });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({ error: '插入失败，没有返回数据' });
        }

        res.status(201).json({ id: data[0].id, email, userID });
    } catch (err) {
        console.error("发生未知错误:", err);
        res.status(500).json({ error: '服务器内部错误', details: err.message });
    }
};
