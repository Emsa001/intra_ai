import "dotenv/config";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { model, prompt, history } from "./ai/models/paulogpt_gemini";
import { getUserData } from "./ai/tools/get_user_data";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

async function main_vertex() {
    const agent = await createToolCallingAgent({
        llm: model,
        tools: [getUserData],
        prompt,
    });

    const agentExecutor = new AgentExecutor({
        agent,
        tools: [getUserData],
    });

    const res = await agentExecutor.invoke({
        username: "",
        input: "What campus is escura in? How many wallet points does he have? What is his current project?",
        chat_history: history,
    });

    history.push(new HumanMessage(`${res.username}: ${res.input}`));
    history.push(new AIMessage(res.output));
    console.log(res.input);
    console.log(res.output);
}

main_vertex();
