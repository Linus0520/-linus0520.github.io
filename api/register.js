import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qajorxdihtgtnzwhkrzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFham9yeGRpaHRndG56d2hrcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzI0MTEsImV4cCI6MjA0NjMwODQxMX0.dSGkFH8LKzld6_j2nvs7UGVTY4ILSKJ6b4_9TdE1ZcY'; // 确保这里是你的实际密钥
const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, userID } = req.body;

    // 确保请求体中包含必需的字段
    if (!email || !userID) {
        return res.status(400).json({ error: '邮箱和 userID 是必需的' });
    }

    try {
        // 尝试插入数据
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, userID }]);

        // 检查插入操作是否有错误
        if (error) {
            console.error("插入错误:", error);
            return res.status(500).json({ error: '插入失败', details: error.message });
        }

        // 打印插入后的数据
        console.log("插入的数据:", data);

        // 检查 data 是否为空
        if (!data || data.length === 0) {
            return res.status(500).json({ error: '插入失败，没有返回数据' });
        }

        // 假设 data[0] 是插入的记录，返回必要的信息
        const insertedRecord = data[0];
        res.status(201).json({ userID: insertedRecord.userID, email: insertedRecord.email, id: insertedRecord.id });
    } catch (err) {
        console.error("发生未知错误:", err);
        res.status(500).json({ error: '服务器内部错误', details: err.message });
    }
};
