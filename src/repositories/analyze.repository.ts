import axios from 'axios';

export class GitRepositoryRepository {
  async getRepos(username: string) {
    const { data } = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );
    return data;
  }

  async getCommits(username: string, repo: string) {
    const { data } = await axios.get(
      `https://api.github.com/repos/${username}/${repo}/commits`
    );
    return data;
  }

  async getCommitStats(commitUrl: string) {
    const { data } = await axios.get(commitUrl);
    return data.stats;
  }
}