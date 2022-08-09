import connection from "../../config/db.js";

export const allDepartaments = async () => {
    try {
        const sql = `SELECT * FROM Departaments`;
        const [result] = await connection.query(sql);
        return result;
    } catch (error) {
        throw error;
    }
}