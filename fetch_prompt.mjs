import { StitchToolClient } from "@google/stitch-sdk";

async function main() {
    try {
        const client = new StitchToolClient({ apiKey: process.env.GOOGLE_PRIVATE_KEY });

        console.log("Fetching project details...");
        // Assuming there is a tool like 'get_project' or we can fetch screens
        const result = await client.callTool("get_project", { name: "projects/9631240855767992267" });
        console.log("Project Details:", JSON.stringify(result, null, 2));

        // Just in case, try to get screens or prompts if get_project fails or doesn't include the prompt
        try {
            const screens = await client.callTool("list_screens", { parent: "projects/9631240855767992267" });
            console.log("Screens:", JSON.stringify(screens, null, 2));
        } catch (e) { }

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
