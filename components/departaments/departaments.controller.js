import { getAllDepartamentsService } from "./departaments.services.js";

export const getAllDepartaments = async (req, res) => {
    try {
        const departaments = await getAllDepartamentsService();
        res.json(departaments);
    } catch (error) {
        
    }
}