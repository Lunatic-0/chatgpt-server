const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 使用环境变量来存储 API KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
  const messages = req.body.messages || [];

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.text
      }))
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });

  } catch (error) {
    console.error('OpenAI 请求失败:', error.message);
    res.status(500).json({ reply: '请求出错，请稍后再试。' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ChatGPT 服务已启动：http://localhost:${PORT}`);
});
