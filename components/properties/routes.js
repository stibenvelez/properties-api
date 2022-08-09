import express from "express";
const router = express.Router();
import { getAllProperties, getPropertyById } from "./properties.controller.js";

router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

export default router;
