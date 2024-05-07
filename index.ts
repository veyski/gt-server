import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { Queries } from "./types";
import { generateUserPrompt } from "./query";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/makeapicall", async (req, res) => {
  const { queries }: { queries: Queries } = req.body;

  const userPrompt = generateUserPrompt(queries);

  try {
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

    const json: any = await response.json();
    const advice = json.choices[0].message.content;

    res.json({ answer: advice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to make API call" });
  }
});

export default app;
