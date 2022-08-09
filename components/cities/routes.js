import express from "express";
import { getAllCityes, getAllCityesWhitProperties } from "./cities.controller.js";
const router = express.Router();

router.get("/whitpropeties", getAllCityesWhitProperties);
router.get('/', getAllCityes)

export default router;