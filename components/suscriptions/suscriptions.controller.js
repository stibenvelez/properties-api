import { inserSuscriptionService } from "./suscriptions.services.js";


export const inserNewSuscriptor = async (req, res) => {
    
    try {
        const email = req.body.email;
        await inserSuscriptionService(email);
        res.json({msg: 'Suscription created'});
    } catch (error) {
        if (error.code == "ER_DUP_ENTRY") {
            res.status(400).send("Ya te encuentras registrado con este email");
            return;
        }

        res.status(500).json("Algo salió mal, intenta nuevamente");
        console.log(error);
    }
};