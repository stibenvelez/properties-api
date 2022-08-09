import { getCommentsByProperty, insertComment } from "./comments.DAL.js";

export const createCommentService = async (req, res) => {
    const data = req.body;
    try {
        await insertComment(data);
    } catch (error) {
        throw error;
    }
}

export const getCommentsByPropertyService = async (id) => {
    try {
        const comments = await getCommentsByProperty(id);
        return comments;
    } catch (error) {
        throw error;
    }
}