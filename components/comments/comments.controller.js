import { createCommentService, getCommentsByPropertyService } from "./comments.services.js";


export const createComment = async (req, res) => {
    try {
        await createCommentService(req, res);
        res.status(200).json({ msg: "Comentario creado" });
    } catch (error) {
        throw error;
    }
}

export const getCommentsByProperty = async (req, res) => {
    try {
        const comments = await getCommentsByPropertyService(req.params.id);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener comentarios" });
    }
}   