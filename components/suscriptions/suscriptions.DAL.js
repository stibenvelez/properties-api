import connection from "../../config/db.js";

export const insertSuscription = async (email) => {
    try {
        const sql = `INSERT INTO Subscriptions (email) VALUES ('${email}')`;
        return await connection.query(sql);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}