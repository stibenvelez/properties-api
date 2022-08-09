import { configHomeVideosServices } from "./config.services.js";


export const getConfigHomeVideos = async (req, res) => {
    try {
        const result = await configHomeVideosServices();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'error obteneindo la configuración'})
    }
};
