import { allCityes, allCityesWhitProperties } from "./cities.DAL.js";


export const getAllCityesService = async () => {
    try {
        const [result] = await allCityes();
        return result;
    } catch (error) {
        throw error
    }
}
export const getAllCityesWhitPropertiesService = async (query) => {
    try {
        const [result] = await allCityesWhitProperties(query);
        return result;
    } catch (error) {
        throw error
    }
}