import connection from "../../config/db.js";


const USERS_TABLE = [
    {id: 1,
    user: "admin",
    password: "admin"}
];

export const inserUser = async (user) => {
    try {
        const sql = `INSERT INTO Users (
            firstName,
            lastName,
            email,
            password,
            idRole,
            token
        )
        VALUES (
            '${user.firstName}',    
            '${user.lastName}',
            '${user.email}',
            '${user.password}',
            '${user.role}',
            '${user.token}'
        )`;
        return await connection.query(sql);
    } catch (error) {
        throw error;
    }

}

export const findUserByEmail = async (email) => {
    try {
        const sql = `
        SELECT * FROM Users
        LEFT JOIN Roles ON Users.idRole = Roles.idRole      
        WHERE email = '${email}'`;
        const [user] = await connection.query(sql);
        return user;
    } catch (error) {
        throw error;
    }
}
export const findUserByToken = async (token) => {
    try {
        const sql = `SELECT * FROM Users 
        LEFT JOIN Roles ON Users.idRole = Roles.idRole   
        WHERE token = '${token}'`;
        const [user] = await connection.query(sql);
        return user;
    } catch (error) {
        throw error;
    }
};
export const findUserById = async (id) => {
    try {
        const sql = `SELECT * FROM Users 
        LEFT JOIN Roles ON Users.idRole = Roles.idRole   
        WHERE idUser = '${id}'`;
        const [user] = await connection.query(sql);
        return user;
    } catch (error) {
        throw error;
    }
};

export const confirmUserByToken= async (user) => {
    try {
        const sql = `UPDATE Users SET
            token = '${user.token}',
            confirmed = '${user.confirmed}'
        WHERE idUser = ${user.idUser}`;
        return await connection.query(sql);
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (user) => {
    try {
        const sql = `UPDATE Users SET
            firstName = '${user.firstName}',
            lastName = '${user.lastName}',
            email = '${user.email}',
            idRole = '${user.idRole}',
            password = '${user.password}',
            observations = '${user.observations}',
            state = ${user.state}
        WHERE idUser = ${user.idUser}`;
        return await connection.query(sql);
    } catch (error) {
        throw error;
    }
};
export const deleteUser = async (user) => {
    try {
        const sql = `UPDATE Users SET
            state = ${user.state}
        WHERE idUser = ${user.idUser}`;
        return await connection.query(sql);
    } catch (error) {
        throw error;
    }
};

export const allUsers = async () => {
    try {
        const sql = `
        SELECT u.*, r.role FROM Users AS u
        INNER JOIN Roles AS r ON u.idRole = r.idRole
        WHERE u.state = '1' 
        `;
        const [users] = await connection.query(sql);
        return users;
    } catch (error) {
        throw error;
    }
}
