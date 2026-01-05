import { Message } from "../models/analyze.model.js";

export class GitRepositoryRepository {
  getMessage(): Message {
    return { id: 1, text: "Hello from the repository" };
  }
}
