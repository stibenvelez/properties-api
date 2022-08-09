import { configHomeVideos } from "./config.DAL.js";

export const configHomeVideosServices = async () => {
    try {
        return await configHomeVideos();

    } catch (error) {
        throw error;
    }
}