import generateJWT from "../../helpers/generatejwt.js";
import {
    confirmUserByToken,
    findUserByToken,
    updateUser,
} from "./user.DAL.js";
import {
    authService,
    createUserService,
    deleteUserByIdService,
    forgetPassswordService,
    getUserByIdService,
    getUsersService,
} from "./user.services.js";
import bcrypt from "bcrypt";

export const auth = async (req, res) => {
    try {
        const user = req.body;
        const [result] = await authService(user);
        res.json({
            idUser: result.idUser,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            role: result.role,
            token: generateJWT({
                idUser: result.idUser,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                role: result.role,
            }),
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const confirmUser = async (req, res) => {
    try {
        const { token } = req.params;
        const [userToConfirm] = await findUserByToken(token);
        if (!userToConfirm) {
            throw new Error("Token no valido");
        }

        userToConfirm.confirmed = 1;
        userToConfirm.token = "";

        const updateDataUser = {
            idUser: userToConfirm.idUser,
            confirmed: 1,
            token: "",
        };
        await confirmUserByToken(updateDataUser);
        res.json({ msg: "usuario confirmado" });
        // TODO update user
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        await createUserService(req.body);
        res.json({ mgs: "Usuario creado" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

export const forgetPassword = async (req, res) => {
    try {
        await forgetPassswordService(req.body);
        res.json({ mgs: "ok" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

export const checkToken = async (req, res) => {
    try {
        const { token } = req.params;
        const [isValidToken] = await findUserByToken(token);

        if (!isValidToken) {
            throw new Error("Token no valido");
        }
        res.json({ msg: "token valido y el usuario existe" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

export const newPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const [user] = await findUserByToken(token);
        if (!user) {
            throw new Error("Token no valido");
        }

        const updateData = {
            ...user,
            idUser: user.idUser,
            password: password,
            token: "",
        };

        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
        await updateUser(updateData);
        res.json({ msg: "Contraseña actualizada con exito" });
        
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const user= req.user;
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

export const getUsers = async (req, res) => {
        const user = req.user;
    if (user.role !== "admin") {
        res.status(403).json({ msg: "No tienes permisos necesarios para acceder a este sitio" });
        return
    }    
    try {
        const users = await getUsersService(req);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
}
export const getUserById = async (req, res) => {
    const user = req.user;
    const {id} = req.params
    if (user.role !== "admin") {
        res.status(403).json({
            msg: "No tienes permisos necesarios para acceder a este sitio",
        });
        return;
    }
    try {
        const users = await getUserByIdService(id);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

export const updateUserById = async (req, res) => {
    const user = req.user;
    const body = req.body;

    if (user.role !== "admin") {
        res.status(403).json({
            msg: "No tienes permisos necesarios para acceder a este sitio",
        });
        return;
    }
    try {
        const users = await updateUser(body);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    
}

export const deleteUserById = async (req, res) => {
    const user = req.user;
    const {id} = req.params
    if (user.role !== "admin") {
        res.status(403).json({
            msg: "No tienes permisos necesarios para acceder a este sitio",
        });
        return;
    }
    try {
        const users = await deleteUserByIdService(id);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
}