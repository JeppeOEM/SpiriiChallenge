import { GitRepositoryService } from "../services/analyze.service.js";
import { Request, Response } from "express";

export class GitRepositoryController {
  constructor(private gitRepositoryService: GitRepositoryService) {}

  getGitRepositories(req: Request, res: Response): void {
    const msg = this.gitRepositoryService.getMessage();
    res.json(msg);
  }
}
