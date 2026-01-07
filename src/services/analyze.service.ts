import { GitRepositoryRepository } from "../repositories/analyze.repository.js";
import { GitStats } from "../models/gitStats.model.js";

export class GitRepositoryService {
  constructor(private repo: GitRepositoryRepository) { }

  async getGitRepositories(username: string): Promise<GitStats> {
    const cached = await this.repo.getStats(username);

    if (
      cached &&
      cached.updated_at &&
      Date.now() - new Date(cached.updated_at).getTime() < 24 * 60 * 60 * 1000
    ) {
      console.log("Returning cached data");
      console.log(
        `Total additions: ${cached.additions}, Total deletions: ${cached.deletions}`
      );

      return {
        additions: cached.additions,
        deletions: cached.deletions,
      };
    }

    let additions = 0;
    let deletions = 0;

    const repos = await this.repo.getRepos(username);

    for (const repo of repos) {
      // Handle errors with no commits in a repo

      let commits;

      try {
        commits = await this.repo.getCommits(username, repo.name);
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;

        if (status === 409) {
          console.log(`Hit 409 for repo "${repo.name}", skipping`);
          continue;
        }

        console.error(`Failed fetching commits for ${repo.name}`, err);
        continue;
      }

      if (!commits || commits.length === 0) {
        console.log(`Repo "${repo.name}" has no commits, skipping`);
        continue;
      }

      for (const commit of commits) {
        // Handle errors fetching stats for a commit
        // Commit without code changes will have additions = 0 and deletions = 0
        try {
          console.log(commit.url);
          const stats = await this.repo.getCommitStats(commit.url);

          additions += stats.additions;
          deletions += stats.deletions;

        } catch (err: any) {
          const status = err?.response?.status ?? err?.status;

          if (status === 409) {
            console.log(`Hit 409 for commit ${commit.url}, skipping`);
            continue;
          }

          console.warn(
            `Failed to fetch stats for commit ${commit.url}, skipping`,
            err
          );
        }
      }
    }

    await this.repo.saveStats(username, additions, deletions);

    console.log("Inserted new stats");
    console.log(`Total additions: ${additions}, Total deletions: ${deletions}`);

    return { additions, deletions };
  }
}
