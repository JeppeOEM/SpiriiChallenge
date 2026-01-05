// services/analyze.service.ts
import { GitRepositoryRepository } from "../repositories/analyze.repository.js";
import { GitStats } from "../models/gitStats.model.js";

export class GitRepositoryService {
  private repo: GitRepositoryRepository;

  constructor(token: string) {
    this.repo = new GitRepositoryRepository(token);
  }

  async getGitRepositories(username: string): Promise<GitStats> {
    let additions = 0;
    let deletions = 0;

    const repos = await this.repo.getRepos(username);

    for (const repo of repos) {
      const commits = await this.repo.getCommits(username, repo.name);

      for (const commit of commits) {
        const stats = await this.repo.getCommitStats(commit.url);
        additions += stats.additions;
        deletions += stats.deletions;
      }
    }

    console.log(`Total additions: ${additions}, Total deletions: ${deletions}`);
    return { additions, deletions };
  }
}
