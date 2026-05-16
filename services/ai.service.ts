import { StitchToolClient } from "@google/stitch-sdk";

/**
 * AI Service for interacting with Google Stitch APIs.
 * This service is designed to be called from Server Components or API Routes.
 */
export const aiService = {
  /**
   * Fetches project details from Google Stitch.
   * @param projectName The resource name of the project (e.g., "projects/...")
   */
  async getProjectDetails(projectName: string) {
    const apiKey = process.env.GCP_API_KEY;
    if (!apiKey) {
      throw new Error("GCP_API_KEY is not defined in environment variables.");
    }

    const client = new StitchToolClient({ apiKey });

    try {
      console.log(`Fetching project details for: ${projectName}`);
      const result = await client.callTool("get_project", { name: projectName });
      
      let screens = null;
      try {
        screens = await client.callTool("list_screens", { parent: projectName });
      } catch (e) {
        console.warn("Failed to fetch screens, continuing with project details only.");
      }

      return {
        project: result,
        screens
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }
};
