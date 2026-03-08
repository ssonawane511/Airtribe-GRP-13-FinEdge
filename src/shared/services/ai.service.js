import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env.GITHUB_TOKEN,
});

const MODEL = "openai/gpt-4.1";

const DEFAULT_CATEGORY = "Other";

export async function analyzeExpense(title) {
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
`;

    try {
        const response = await client.chat.completions.create({
            model: MODEL,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: `Transaction title: ${title}`,
                },
            ],
        });

        const content = response?.choices?.[0]?.message?.content;
        if (!content) {
            return { category: DEFAULT_CATEGORY };
        }

        const result = JSON.parse(content);
        const category = result?.category;
        return {
            category: typeof category === "string" && category.trim()
                ? category.trim()
                : DEFAULT_CATEGORY,
        };
    } catch (error) {
        console.error("[analyzeExpense] API or parse error:", error.message);
        return { category: DEFAULT_CATEGORY };
    }
}

export async function getSuggest(ask, data, user) {
    const SYSTEM_PROMPT = `
    You are an expert personal finance advisor.
    
    The user will ask a financial question about their spending, saving, or budgeting.
    You will also receive structured financial data showing their daily financial trend.
    
    The data includes:
    - income
    - expense
    - balance
    - number of transactions
    - date
    
    Your job:
    1. Analyze the financial trend carefully.
    2. Understand the user's question.
    3. Give clear financial advice based on the data.
    4. Suggest realistic ways to improve saving or spending habits.
    
    Rules:
    - Base your answer on the provided financial data.
    - If the data is limited, mention that the advice is based on available data.
    - Be practical and concise.
    - Focus on budgeting, saving strategies, and spending control.
    - Avoid generic advice — relate suggestions to the numbers in the data.
    
    Return ONLY JSON in this format:
    
    {
      "answer": "direct answer to the user's question",
      "financial_health": "poor | moderate | good",
      "insight": "short explanation of what the data shows",
      "recommended_savings_rate": "percentage of income to save",
      "action_steps": [
        "specific actionable step",
        "specific actionable step",
        "specific actionable step"
      ]
    }
    
    Do not include text outside the JSON.
    `;

    try {
        const response = await client.chat.completions.create({
            model: MODEL,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `${user.name} is asking: ${ask}, This is the financial data: ${JSON.stringify(data)}` },
            ],
        });
        const result = JSON.parse(response.choices[0].message.content);
        return result;
    } catch (error) {
        console.error("[getSuggest] API or parse error:", error.message);
        return { answer: "Sorry, I'm having trouble answering your question. Please try again later.", financial_health: "unknown", insight: "unknown", recommended_savings_rate: "unknown", action_steps: [] };
    }
}

export default { analyzeExpense, getSuggest };
