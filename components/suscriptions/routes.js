import express from "express";
import { inserNewSuscriptor } from "./suscriptions.controller.js";
const router = express.Router();

router.post("/", inserNewSuscriptor);


export default router;