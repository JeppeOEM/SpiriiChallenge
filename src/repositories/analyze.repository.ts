// repositories/analyze.repository.ts
import axios, { AxiosInstance } from 'axios';
import pool from '../config/db.js';
import 'dotenv/config';

export interface GitStatsRow {
  username: string;
  additions: number;
  deletions: number;
  updated_at: Date;
}

export class GitRepositoryRepository {
  private axiosInstance: AxiosInstance;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is required in .env as GITHUB_TOKEN');
    }

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

  // --- Database methods ---

  async getStats(username: string): Promise<GitStatsRow | null> {
    const res = await pool.query(
      `SELECT * FROM git_stats WHERE username = $1`,
      [username]
    );
    if (!res.rows[0]) return null;
    const row = res.rows[0];
    return {
      username: row.username,
      additions: row.additions,
      deletions: row.deletions,
      updated_at: row.updated_at,
    };
  }

  async saveStats(username: string, additions: number, deletions: number): Promise<void> {
    const query = `
      INSERT INTO git_stats (username, additions, deletions, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (username)
      DO UPDATE SET additions = $2, deletions = $3, updated_at = NOW()
    `;
    await pool.query(query, [username, additions, deletions]);
  }
}
