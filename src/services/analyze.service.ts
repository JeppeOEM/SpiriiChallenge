import { GitRepositoryRepository } from "../repositories/analyze.repository.js";
import { Message } from "../models/analyze.model.js";

export class GitRepositoryService {
  constructor(private messageRepository: GitRepositoryRepository) {}

  getGitRepositories(username: string): Message {
    return this.messageRepository.getGitRepositories(username);
  }
}
