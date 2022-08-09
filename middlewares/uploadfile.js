import multer from "multer";

const config = {
    limits: { filesize: 4000000 },
    mimetype: "text/csv",
    storage: multer.diskStorage({
        filename: (res, file, cb) => {
            //const ext = file.originalname.split(".").pop();
            const filename = file.originalname; //Date.now();
            cb(null, `${filename}`);
        },
        destination: (req, file, cb) => {
            cb(null, "uploads/properties/");
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== "text/csv") {
                cb(null, true);
            } else {
                cb(null, false);
            }
        },
    }),
};

const upload = multer(config).single("file");

export const uploadFile = (req, res, next) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({
                msg: "Error al subir la propiedad",
            });
            return;
         
        } else {
            next();
        }
    });
};
