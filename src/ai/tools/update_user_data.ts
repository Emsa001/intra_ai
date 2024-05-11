import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

const changeUsersBalance = new DynamicStructuredTool({
    name: "change_users_balance",
    description: "Change the users balance",
    schema: z.object({
        user: z.string().describe("An user to change the balance for"),
        amount: z.number().describe("The amount to change the balance by"),
    }),
    func: async ({ user,amount }) => {
        // const person = people.getPerson(user);
        // person?.updateBalance(amount);
        // return JSON.stringify(person);
        return "yes";
    },
});

export { changeUsersBalance };