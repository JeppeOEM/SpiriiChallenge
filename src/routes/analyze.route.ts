import { Router } from "express";
import { GitRepositoryRepository } from "../repositories/analyze.repository.js";
import { GitRepositoryService } from "../services/analyze.service.js";
import { GitRepositoryController } from "../controllers/analyze.controller.js";

const router = Router();

const repo = new GitRepositoryRepository();
const service = new GitRepositoryService(repo);
const controller = new GitRepositoryController(service);

router.get("/:username", (req, res, next) => controller.getGitRepositories(req, res, next));

export default router;
