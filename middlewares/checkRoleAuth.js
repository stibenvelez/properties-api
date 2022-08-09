import { findUserById } from "../components/user/user.DAL.js";
import { veryfyToken } from "../helpers/verifyToken.js";

export const checkRoleAuth = (roles) => async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const tokenData = await veryfyToken(token);
        const [userData] = await findUserById(tokenData.idUser);
        if (!userData) {
            return res.status(401).json({ msg: "Usuario no existe" });
        }
        if ([].concat(roles).includes("public")) {

            return next();
        }
        if ([].concat(roles).includes(userData.role)) {
            return next();
        }
        res.status(401).json({ msg: "No tienes los permisos necesarios" });
    } catch (error) {
        res.status(400).json({ msg: "Hubo un error inesperado" });
        console.log(error);
    }
};