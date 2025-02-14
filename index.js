import express from "express";
import dotenv from 'dotenv';
import OpenAI from "openai";
import cors from "cors"



const app = express();
dotenv.config();

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
const openai = new OpenAI({
    apiKey: API_KEY,
});

const contentText = "Give me 10 easy words to write, 10 difficult words to write, 10 medium difficulty words and format them in a JSON with only JSON data no useless text";

app.use(cors({
    origin: 'http://localhost:4200'
  }));

app.use(express.json());
app.get('/gptResponse', async (req, res) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: contentText,
            },
        ],
        store: true,
    });

    let responseData = completion.choices[0].message.content;
    const indexFirst = responseData.indexOf('{');
    const indexEnd = responseData.indexOf('}');
    const formatResponse = responseData.slice(indexFirst, indexEnd+1);

    let responseDataJSON = JSON.parse(formatResponse);

    res.status(200).send({
        data: responseDataJSON
    })
})

app.listen(PORT,(console.log(`Server is istening on port ${PORT}`)))