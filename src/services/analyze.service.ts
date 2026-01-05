import { GitRepositoryRepository } from "../repositories/analyze.repository.js";
import { Message } from "../models/analyze.model.js";

export class GitRepositoryService {
  constructor(private messageRepository: GitRepositoryRepository) {}

  getMessage(): Message {
    return this.messageRepository.getMessage();
  }
}
