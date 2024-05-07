import express from "express";
import cors from "cors";
import { Queries } from "./types";
import { generateUserPrompt } from "./query";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/makeapicall", async (req, res) => {
  const { queries }: { queries: Queries } = req.body;

  const userPrompt = generateUserPrompt(queries);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  const json: unknown = await response.json();

  res.json(json);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
