import { Message } from "../models/analyze.model.js";

export class GitRepositoryRepository {
  getGitRepositories(username: string): Message {
    return { id: 1, text: `Hello, ${username}!` };
  }
}
