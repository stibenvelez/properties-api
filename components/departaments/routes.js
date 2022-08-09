import express from "express";
import { getAllDepartaments } from "./departaments.controller.js";
const router = express.Router();

router.get("/", getAllDepartaments);

export default router;
