// api/register.js

import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, userID } = req.body;

  if (!email || !userID) {
    return res.status(400).json({ error: '邮箱和 userID 是必需的' });
  }

  // 将数据插入 Supabase 数据库
  const { data, error } = await supabase
    .from('users') // 确保在 Supabase 中创建了一个名为 "users" 的表
    .insert([{ email, userID }]);

  if (error) {
    console.error("数据库错误:", error);
    return res.status(500).json({ error: '数据库错误' });
  }

  res.status(201).json({ id: data[0].id, email, userID });
};
