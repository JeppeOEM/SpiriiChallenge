import { GitRepositoryService } from "../services/analyze.service.js";
import { Request, Response, NextFunction } from "express";

export class GitRepositoryController {
  constructor(private gitRepositoryService: GitRepositoryService) { }

  async getGitRepositories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const username = req.params.username;
      console.log("Username:", username);

      const result = await this.gitRepositoryService.getGitRepositories(username);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
