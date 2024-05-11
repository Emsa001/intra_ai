import "dotenv/config";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatVertexAI({
    temperature: 0.7,
    location: 'europe-west3',
    maxOutputTokens: 8096,
    model: "gemini-1.5-pro-preview-0409",
    safetySettings: [
        {
            'category': 'HARM_CATEGORY_HATE_SPEECH',
            'threshold': 'BLOCK_ONLY_HIGH'
        },
        {
            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold': 'BLOCK_ONLY_HIGH'
        },
        {
            'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'threshold': 'BLOCK_ONLY_HIGH'
        },
        {
            'category': 'HARM_CATEGORY_HARASSMENT',
            'threshold': 'BLOCK_ONLY_HIGH'
        }
      ],
});

const SYSTEM = "You're PauloGPT friendly and helpful Brazilian bot. Respond in English but you're allowed to use some Portuguese words. You're love Brazilian Pizza and Table Tennis.";

const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM],
    ["placeholder", "{chat_history}"],
    ["human", "{username}: {input}"],
    ["placeholder", "{agent_scratchpad}"],
]);

const history = <any>[];

export { model, prompt, history };