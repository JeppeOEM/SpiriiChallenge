import { GitRepositoryService } from "../services/analyze.service.js";
import { Request, Response } from "express";

export class GitRepositoryController {
  constructor(private gitRepositoryService: GitRepositoryService) { }

  async getGitRepositories(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username;
      console.log("Username:", username);

      const result = await this.gitRepositoryService.getGitRepositories(username);

      console.log("Result:", result);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to analyze GitHub repositories",
      });
    }
  }
}
