import { GitRepositoryService } from "../services/analyze.service.js";
import { Request, Response } from "express";

export class GitRepositoryController {
  constructor(private gitRepositoryService: GitRepositoryService) {}

  getGitRepositories(req: Request, res: Response): void {
    const username = req.params.username;
    console.log("Username:", username);
    const result = this.gitRepositoryService.getGitRepositories(username);
    res.json(result);
  }
}
