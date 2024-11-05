import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qajorxdihtgtnzwhkrzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFham9yeGRpaHRndG56d2hrcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzI0MTEsImV4cCI6MjA0NjMwODQxMX0.dSGkFH8LKzld6_j2nvs7UGVTY4ILSKJ6b4_9TdE1ZcY'; // 请确保替换为实际密钥
const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, userID } = req.body;

    if (!email || !userID) {
        return res.status(400).json({ error: '邮箱和 userID 是必需的' });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, userID }])
            .select();

        if (error) {
            console.error("插入错误:", error);
            return res.status(500).json({ error: '插入失败', details: error.message });
        }

        if (data && data.length > 0) {
            const insertedRecord = data[0];
            res.status(201).json({ userID: insertedRecord.userID, email: insertedRecord.email, id: insertedRecord.id });
        } else {
            return res.status(500).json({ error: '插入失败，没有返回数据' });
        }
    } catch (err) {
        console.error("发生未知错误:", err);
        res.status(500).json({ error: '服务器内部错误', details: err.message });
    }
};
