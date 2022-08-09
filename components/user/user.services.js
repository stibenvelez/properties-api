import { emailCreateUser, emailForgetPassword } from "../../helpers/emails.js";
import {
    allUsers,
    deleteUser,
    findUserByEmail,
    findUserById,
    inserUser,
    updateUser,
} from "./user.DAL.js";
import bcrypt from "bcrypt";
import generateId from "../../helpers/generateId.js";

export const createUserService = async (user) => {
    const { email } = user;
    const [userExist] = await findUserByEmail(email);

    try {
        if (userExist) {
            throw new Error("Ya existe un usuario con este correo");
        }
        user.token = generateId();
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await inserUser(user);

        //send confirm email
        await emailCreateUser({
            email: user.email,
            fisrtName: user.firstName,
            lastName: user.lastName,
            token: user.token,
        });
    } catch (error) {
        throw error;
    }
};

export const authService = async (user) => {
    try {
        const { email, password } = user;
        const rows = await findUserByEmail(email);

        if (rows.length === 0) {
            const error = new Error("El usuario no existe");
            throw error;
        }
        // valid password
        const checkPassword = async () => {
            return await bcrypt.compare(password, rows[0].password);
        };
        const passwordCorrect = await checkPassword();

        if (!passwordCorrect) {
            const error = new Error("contraseña incorrecta");
            throw error;
        }

        // valid confirm
        if (!rows[0].confirmed) {
            const error = new Error("El usuario no está confirmado");
            throw error;
        }

        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const forgetPassswordService = async (user) => {
    try {
        const { email } = user;
        const [userExist] = await findUserByEmail(email);

        if (!userExist) {
            throw new Error("El usuario no existe");
        }

        userExist.token = generateId();
        await updateUser(userExist);

        //send email
        emailForgetPassword({
            email: userExist.email,
            fisrtName: userExist.firstName,
            lastName: userExist.lastName,
            token: userExist.token,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUsersService = async () => {
    try {
        const rows = await allUsers();
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUserByIdService = async (id) => {

    try {
        
        const [user] = await findUserById(id);
        delete user.password;
        delete user.token;
        return user;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteUserByIdService = async (id) => {
    const [user] = await findUserById(id);
    user.state = 0;
    try {
        await deleteUser(user);
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}
