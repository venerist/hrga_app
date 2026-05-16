import { StitchToolClient } from "@google/stitch-sdk";

/**
 * GCP Service for interacting with Google Stitch / Vertex AI tools.
 * Implements logic previously held in legacy scripts.
 */
export class GcpService {
  private client: StitchToolClient;

  constructor() {
    const apiKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_PRIVATE_KEY is missing in environment variables.");
    }
    this.client = new StitchToolClient({ apiKey });
  }

  /**
   * Retrieves project metadata and associated screens.
   * @param projectId The full resource name of the project.
   */
  async getProjectContext(projectId: string = "projects/9631240855767992267") {
    try {
      console.log(`[GcpService] Fetching context for: ${projectId}`);
      
      const projectDetails = await this.client.callTool("get_project", { 
        name: projectId 
      });

      let screens = [];
      try {
        const screenResult = await this.client.callTool("list_screens", { 
          parent: projectId 
        });
        screens = screenResult || [];
      } catch (err) {
        console.warn("[GcpService] Screens could not be fetched, continuing with project details.");
      }

      return {
        project: projectDetails,
        screens,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("[GcpService] Execution Error:", error);
      throw error;
    }
  }
}

export const gcpService = new GcpService();
