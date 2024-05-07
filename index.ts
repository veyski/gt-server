import express from "express";
import cors from "cors";
import { Queries } from "./types";
import { generateUserPrompt } from "./query";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
console.log(process.env);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

type GptResponse = {
  answer: string;
};

const openai = new OpenAI({ apiKey: process.env.API_KEY });

app.post("/makeapicall", async (req, res) => {
  const { queries }: { queries: Queries } = req.body;

  const userPrompt = generateUserPrompt(queries);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 500,
    temperature: 0.5,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  res.send(response.choices[0].message.content);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
