import jwt from "jsonwebtoken";
import { findUserById } from "../components/user/user.DAL.js";

const checkAuth = async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.SECRET);
            const [user] = await findUserById(decoded.idUser);
            delete user.password;
            delete user.token;
            delete user.confirmed;
            delete user.observations;
            delete user.createdAt;
            delete user.updatedAt;

            req.user = user;
            return next();
        } catch (error) {
            return res.status(401).json({ msg: "Hubo un error validando el token" });
        }
    }

    if (!token) {
        const error = new Error("No token valido");
        return res.status(401).json({ msg: error.message });
    }


};

export default checkAuth;
