import express from "express";
const routes = express.Router();
import propertiesRoutes from "../components/properties/routes.js";
import citiesRoutes from "../components/cities/routes.js";
import userRoutes from "../components/user/routes.js";
import suscriptionsRoutes from "../components/suscriptions/routes.js";
import propertyRoutesAdmin from "../components/properties/routes.admin.js";
import departamentsRoutes from "../components/departaments/routes.js";
import configRoutes from "../components/config/routes.js";
import contactRoutes from "../components/contact/routes.js";
import commentsRoutes from "../components/comments/routes.js";


routes.use(express.static("public"));
routes.use("/properties", propertiesRoutes);
routes.use("/cities", citiesRoutes);
routes.use("/users", userRoutes);
routes.use("/suscriptions", suscriptionsRoutes);
routes.use("/admin/properties", propertyRoutesAdmin);
routes.use("/departaments", departamentsRoutes);
routes.use("/config", configRoutes);
routes.use("/contact", contactRoutes);
routes.use("/comments", commentsRoutes);

export default routes;
