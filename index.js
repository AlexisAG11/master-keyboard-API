import express from "express";
import dotenv from 'dotenv';
import OpenAI from "openai";


const app = express();
dotenv.config();

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
const openai = new OpenAI({
    apiKey: API_KEY,
});

const contentText = "Give me 10 easy words to write, 10 difficult words to write, 10 medium difficulty words and format them in a 30 numbered list like this:\n\n    Easy Words:\n        word 1\n        word 2";
let arrayData = [];

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
    for (let index = 1; index < 31; index++) {
        let indexStr = index.toString();
        let indexStr1 = (index+1).toString();
        let indexOfNumberBegin = responseData.indexOf(indexStr+". ");
        let indexOfNumberEnd = responseData.indexOf(indexStr1);
        if (index===29) {
            arrayData.push(responseData.slice(indexOfNumberBegin+3));
            break;
        }
        arrayData.push(responseData.slice(indexOfNumberBegin+3, indexOfNumberEnd-1));
    }
    // console.log(responseData);
    console.log(arrayData);

    res.status(200).send({
        data: responseData
    })
})

app.listen(PORT,(console.log(`Server is istening on port ${PORT}`)))