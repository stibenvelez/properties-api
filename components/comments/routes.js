import express from "express";
import { createComment, getCommentsByProperty } from "./comments.controller.js";
const router = express.Router();

router.get("/:id", getCommentsByProperty);
router.post("/", createComment);

export default router;