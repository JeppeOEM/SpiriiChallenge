// repositories/analyze.repository.ts
import axios, { AxiosInstance } from 'axios';

export class GitRepositoryRepository {
  private axiosInstance: AxiosInstance;

  constructor(token: string) {
    if (!token) {
      throw new Error('GitHub token is required for authenticated requests');
    }

    // Create a single axios instance with authentication headers
    this.axiosInstance = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
  }

  async getRepos(username: string) {
    const { data } = await this.axiosInstance.get(`/users/${username}/repos`);
    return data;
  }

  async getCommits(username: string, repo: string) {
    const { data } = await this.axiosInstance.get(
      `/repos/${username}/${repo}/commits`
    );
    return data;
  }

  async getCommitStats(commitUrl: string) {
    const { data } = await this.axiosInstance.get(commitUrl);
    return data.stats;
  }
}
