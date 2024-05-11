import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import IntraRequest from "../../api";
import moment from "moment";

const getIntraData = async (user,data) => {
    const request = new IntraRequest(null);

    const userData = await request.get(`/v2/users/${user}`, {});
    if(!userData) return "User does not exist.";

    const response = <any>[];
    data.forEach((d) => {
        switch (d) {
            case "general":
                console.log('geenral');
                const uData = {
                    email : userData.email,
                    phone: userData.phone,
                    login : userData.login,
                    displayname : userData.displayname,
                    role: userData.kind,
                    computer: userData.location,
                    wallet: userData.wallet,
                    groups: userData.groups?.map((group) => group.name).join(", "),
                    created_at: moment(new Date(userData.created_at)).format("DD/MM/YYYY"),
                    campus: {
                        name: userData.campus?.name,
                        city: userData.campus?.city,
                    },
                    projects: userData.projects_users?.map((project) => {
                        return {
                            name: project.project.name,
                            final_mark: project.final_mark,
                            status: project.status,
                            validated: project.validated,
                        };
                    }),
                }
        
                return response.push(uData);
            case "location":
                return response.push({location: userData.location});
            case "started":
                const month = moment(new Date(userData.pool_month)).format("MM");
                const year = moment(new Date(userData.pool_month)).format("YYYY");

                return response.push({started: `${month}/${year}`});
            case "wallet":
                return response.push({wallet: userData.wallet});
            case "alumni":
                return response.push({alumni: userData.is_alumni});
            case "groups":
                return response.push({groups: userData.groups?.map((group) => group.name).join(", ")});
            case "campus":
                return response.push({campus: userData.campus});
            case "projects":
                const projectData = userData.projects_users?.map((project) => {
                    return {
                        name: project.project.name,
                        final_mark: project.final_mark,
                        status: project.status,
                        validated: project.validated,
                    };
                });
                return response.push(projectData);
            case "current_project":
                return response.push({current_project: userData.projects_users?.find((project) => project.status === "in_progress")});
            case "skills":
                const skillData = userData.cursus_users.find((cursus) => cursus.cursus.name === "42cursus");

                if (!skillData) return "User has no skills.";
                return response.push(skillData.skills);
            case "piscine":
                const piscineData = userData.cursus_users?.find((cursus) => cursus.cursus.name === "Piscine C");
                if (!piscineData) return "User has not done piscine.";
                piscineData.user = {};

                return response.push(piscineData);
            case "coalition":
                return response.push({coalition: userData.coalitions});
            case "achievements":
                return response.push({achievements: userData.achievements});
            case "expertise":
                return response.push({expertise: userData.expertises_users});
            case "level":
                const levelData = userData.cursus_users?.map((cursus) => {
                    return {
                        cursus: cursus.cursus.name,
                        level: cursus.level,
                        grade: cursus.grade,
                    };
                });
                return response.push(levelData);
        }
    });

    return response;
}

const getUserData = new DynamicStructuredTool({
    name: "get_user_data",
    description: "Get the user's data",
    schema: z.object({
        user: z.string().describe("As specific user to get the data for"),
        data: z.array(z.enum(["general", "location", "startd", 
            "wallet", "alumni", "groups", "campus", "projects", 
            "current_project", "skills", "piscine", "coalition", 
            "achievements", "expertise", "level"
        ])).describe("The type of data to get"),
    }),
    func: async ({ user, data }) => {
        console.log('user:', user);
        console.log('data:', data);

        const userData = await getIntraData(user, data);
        console.log(JSON.stringify(userData, null, 2));
        return JSON.stringify(userData, null, 2);
    },
});

export { getUserData };