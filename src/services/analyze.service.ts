// services/analyze.service.ts
import { GitRepositoryRepository } from "../repositories/analyze.repository.js";
import { GitStats } from "../models/gitStats.model.js";

export class GitRepositoryService {
  constructor(private repo: GitRepositoryRepository) { }

  async getGitRepositories(username: string): Promise<GitStats> {
    // 1️⃣ Check cached stats
    const cached = await this.repo.getStats(username);
    if (cached && (Date.now() - new Date(cached.updated_at!).getTime()) < 24 * 3600 * 1000) {
      console.log("Returning cached data");
      return { additions: cached.additions, deletions: cached.deletions };
    }

    // 2️⃣ Fetch fresh data from GitHub
    let additions = 0;
    let deletions = 0;

    const repos = await this.repo.getRepos(username);

    for (const repo of repos.slice(0, 2)) { // top 2 repos for speed
      const commits = await this.repo.getCommits(username, repo.name);

      for (const commit of commits) {
        const stats = await this.repo.getCommitStats(commit.url);
        additions += stats.additions;
        deletions += stats.deletions;
      }
    }

    // 3️⃣ Save updated stats to DB
    await this.repo.saveStats(username, additions, deletions);

    console.log(`Total additions: ${additions}, Total deletions: ${deletions}`);
    return { additions, deletions };
  }
}
