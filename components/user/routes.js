import express from "express";
import {
    auth,
    createUser,
    confirmUser,
    forgetPassword,
    checkToken,
    newPassword,
    getProfile,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} from "./user.controller.js";
import checkAuth from "../../middlewares/checkAuth.js";
import { checkRoleAuth } from "../../middlewares/checkRoleAuth.js";
const router = express.Router();

router.get("/", checkAuth, getUsers);
router.put("/delete/:id", checkAuth, deleteUserById);
router.put("/:id", checkAuth, updateUserById);


router.get("/profile", checkAuth, getProfile )
router.get("/getuser/:id", checkAuth, getUserById);

router.post("/", checkAuth, checkRoleAuth(['encargado', 'asesor']), createUser);
router.post("/login", auth);
router.post("/confirm/:token", confirmUser);
router.post("/forget-password", forgetPassword);
router.route("/forget-password/:token").get(checkToken).post(newPassword);

export default router;
