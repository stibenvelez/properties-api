import { allDepartaments } from "./departaments.DAL.js";

export const getAllDepartamentsService = async () => {
    try {
        const departaments = await allDepartaments();
        return departaments;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
