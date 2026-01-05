// services/analyze.service.ts
import { GitRepositoryRepository } from "../repositories/analyze.repository.js";
import { GitStats } from "../models/gitStats.model.js";

export class GitRepositoryService {
  constructor(private repo: GitRepositoryRepository) { }

  async getGitRepositories(username: string): Promise<GitStats> {
    let additions = 0;
    let deletions = 0;

    const repos = await this.repo.getRepos(username);

    for (const repo of repos.slice(0, 2)) {
      const commits = await this.repo.getCommits(username, repo.name);
      console.log(commits);

      for (const commit of commits) {
        const stats = await this.repo.getCommitStats(commit.url);
        additions += stats.additions;
        deletions += stats.deletions;
      }
    }
    console.log(repos)

    console.log(`Total additions: ${additions}, Total deletions: ${deletions}`);
    return { additions, deletions };
  }
}
