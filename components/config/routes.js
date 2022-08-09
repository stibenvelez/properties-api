import express from "express";
import { getConfigHomeVideos } from "./config.controller.js";
const router = express.Router();

router.get("/home/videos", getConfigHomeVideos);

export default router;
