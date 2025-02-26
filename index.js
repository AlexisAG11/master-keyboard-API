import express from "express";
import dotenv from 'dotenv';
import OpenAI from "openai";
import cors from "cors"
import helmet from "helmet"
import xss from "xss-clean";



const app = express();
dotenv.config();

const port = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;
const ORIGIN = process.env.ORIGIN
const openai = new OpenAI({
    apiKey: API_KEY,
});

const contentText = "Give me exactly 30 random words and format them in a JSON with only JSON data no useless text with the name of the array : 'words'";
// const contentText = "Give me 10 easy words to write, 10 difficult words to write, 10 medium difficulty words and format them in a JSON with only JSON data no useless text and the name of the array are 'easy', 'medium', 'difficult'";


app.use(cors({
    origin: ORIGIN
}));
app.use(helmet())
app.use(xss())
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

// app.get('/gptResponse2', async (req, res) => {
//     const completion = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//             {
//                 role: "user",
//                 content: contentTextReAsking,
//             },
//         ],
//         store: true,
//     });

//     let responseData = completion.choices[0].message.content;
//     const indexFirst = responseData.indexOf('{');
//     const indexEnd = responseData.indexOf('}');
//     const formatResponse = responseData.slice(indexFirst, indexEnd+1);

//     let responseDataJSON = JSON.parse(formatResponse);

//     res.status(200).send({
//         data: responseDataJSON
//     })
// })

app.listen(port,(console.log(`Server is istening on port ${port}`)))