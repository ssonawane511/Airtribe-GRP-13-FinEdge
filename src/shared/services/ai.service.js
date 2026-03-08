import OpenAI from "openai";
import 'dotenv/config';

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env.GITHUB_TOKEN,
});

const MODEL = "openai/gpt-4.1";

const SYSTEM_PROMPT = `
You are a finance assistant.

Given a transaction title, infer the most appropriate expense category.

Rules:
- Create a short generic category name
- Categories should be common financial categories like Food, Transport, Shopping, Bills, Travel, etc.
- If unclear return "Other"

Return JSON only.

Example format:
{
  "category": "Food"
}
`

export async function analyzeExpense(title) {
    const response = await client.chat.completions.create({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            {
                role: "user",
                content: `Transaction title: ${title}`
            }
        ]
    });
    const result = JSON.parse(response.choices[0].message.content);
    return result;
}

export default { analyzeExpense };
