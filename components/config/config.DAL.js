import connection from "../../config/db.js";

export const configHomeVideos = async () => {
    try {
        const sql = `SELECT * FROM ConfigHomeVideos`;
        const [result] = await connection.query(sql);
        return result;
    } catch (error) {
        throw error;
    }
}