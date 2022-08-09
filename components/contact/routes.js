import express from "express";
import checkAuth from "../../middlewares/checkAuth.js";
import { checkRoleAuth } from "../../middlewares/checkRoleAuth.js";
import { contactMe, createContactManagement, discardContact, getAllToContact, getToContactById } from "./contact.controller.js";
const router = express.Router();

router.get("/to-contact", checkRoleAuth(['admin', 'encargado','asesor']), getAllToContact);
router.get("/to-contact/:id", checkRoleAuth(['admin', 'encargado', 'asesor']), getToContactById);
router.post("/contactme", contactMe)
router.post("/contact-management", checkAuth, createContactManagement);
router.post("/discard/:id", checkAuth, checkRoleAuth(['admin', 'encargado', 'asesor']), discardContact);

export default router;
