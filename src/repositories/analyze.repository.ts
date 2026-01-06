import axios, { AxiosInstance } from 'axios';
import pool from '../config/db.js';
import 'dotenv/config';
import { ApiError } from '../types/api-error.type.js';
import { getErrorMessage } from '../utils/getErrorMessage.util.js';

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
      const message = "Missing GITHUB_TOKEN in environment variables"
      const err = new Error(message) as ApiError;
      err.statusCode = 500;
      err.errors = [message];
      throw err;
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
    try {
      const { data } = await this.axiosInstance.get(`/users/${username}/repos`);
      return data;
    } catch (err) {
      const apiError = new Error(`Failed to fetch repositories for user: ${username}`) as ApiError;
      apiError.statusCode = 500;
      apiError.errors = [getErrorMessage(err)];
      throw apiError;
    }
  }

  async getCommits(username: string, repo: string) {
    try {
      const { data } = await this.axiosInstance.get(`/repos/${username}/${repo}/commits`);
      return data;
    } catch (err) {
      const apiError = new Error(`Failed to fetch commits for repo: ${username}/${repo}`) as ApiError;
      apiError.statusCode = 500;
      apiError.errors = [getErrorMessage(err)];
      throw apiError;
    }
  }

  async getCommitStats(commitUrl: string) {
    try {
      const { data } = await this.axiosInstance.get(commitUrl);
      return data.stats;
    } catch (err) {
      const apiError = new Error(`Failed to fetch commit stats from URL: ${commitUrl}`) as ApiError;
      apiError.statusCode = 500;
      apiError.errors = [getErrorMessage(err)];
      throw apiError;
    }
  }

  async getStats(username: string): Promise<GitStatsRow | null> {
    try {
      const res = await pool.query(`SELECT * FROM git_stats WHERE username = $1`, [username]);
      if (!res.rows[0]) return null;
      const row = res.rows[0];
      return {
        username: row.username,
        additions: row.additions,
        deletions: row.deletions,
        updated_at: row.updated_at,
      };
    } catch (err) {
      const apiError = new Error(`Failed to get stats from database for user: ${username}`) as ApiError;
      apiError.statusCode = 500;
      apiError.errors = [getErrorMessage(err)];
      throw apiError;
    }
  }

  async saveStats(username: string, additions: number, deletions: number): Promise<void> {
    try {
      const query = `
        INSERT INTO git_stats (username, additions, deletions, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (username)
        DO UPDATE SET additions = $2, deletions = $3, updated_at = NOW()
      `;
      await pool.query(query, [username, additions, deletions]);
    } catch (err) {
      const apiError = new Error(`Failed to save stats to database for user: ${username}`) as ApiError;
      apiError.statusCode = 500;
      apiError.errors = [getErrorMessage(err)];
      throw apiError;
    }
  }
}
