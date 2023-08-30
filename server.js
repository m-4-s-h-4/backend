require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/generate-box-ideas', async (req, res) => {
    const { answers } = req.body;
    const prompt = `Create 3 different box ideas for a person who likes ${answers.join(', ')}. 
    Ensure that at least 1 box targets the person to try a similar activity.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                model: 'gpt-3.5-turbo-0613'
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        res.json(response.data.choices[0].message.content.trim());
    } catch (err) {
        console.error('Error in generating box ideas:', err);
        if (err.response) {
            console.error('Error response from OpenAI:', err.response.data);
        }
        res.status(500).json({ error: 'An error occurred while trying to generate box ideas.' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
