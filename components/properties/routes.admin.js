import express from "express";
import checkAuth from "../../middlewares/checkAuth.js";
import { checkRoleAuth } from "../../middlewares/checkRoleAuth.js";
import { uploadFile } from "../../middlewares/uploadfile.js";
import { uploadImages } from "../../middlewares/uploadImages.js";
import { uploadImagesProperty } from "../../middlewares/uploadImagesProperty.js";
import {
    addNewProperty,
    updateProperty,
    getPropertiesByUser,
    getPropertyByIdByUserId,
    importImagesProperties,
    importProperties,
    deleteProperty,
    getPropertyByReference,
} from "./properties.controller.js";
const router = express.Router();

router.get("/", checkAuth, checkRoleAuth(['admin', 'encargado', 'asesor']), getPropertiesByUser);
router.get("/reference/:reference", checkAuth, checkRoleAuth(['admin', 'encargado', 'asesor']), getPropertyByReference);
router.post("/", checkAuth, uploadImagesProperty, checkRoleAuth(['admin', 'encargado', 'asesor']), addNewProperty);
router
    .route("/:id")
    .get(checkAuth, checkRoleAuth(['admin', 'encargado', 'asesor']), getPropertyByIdByUserId)
    .put(checkAuth, uploadImagesProperty, checkRoleAuth(['admin', 'encargado', 'asesor']), updateProperty);
router.put("/delete/:id", checkAuth, deleteProperty);

router.post("/upload/properties", checkAuth, uploadFile, checkRoleAuth(['admin', 'encargado', 'asesor']), importProperties);
router.post("/upload/images", checkAuth, uploadImages, checkRoleAuth(['admin', 'encargado', 'asesor']), importImagesProperties);
export default router;
