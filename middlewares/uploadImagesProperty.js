import multer from "multer";

const config = {
    mimetype: "image/jpg",
    storage: multer.diskStorage({
        
        filename: (req, file, cb) => {
            //const ext = file.originalname.split(".").pop();
            const filename = file.originalname; //Date.now();
            cb(null, `${filename}`);
        },
        destination: (req, file, cb) => {
            cb(null, "public/imgProperties/");
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== "image/jpg") {
                cb(null, true);
            } else {
                console.log("hubo un error");
                cb(null, false);
            }
        },
    }),
};

const upload = multer(config).array("files", 100);

export const uploadImagesProperty = (req, res, next) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log(error)
            res.status(400).json({ msg: "Error al subir la imagen" });
            return;
        } else {
            next();
        }
    });
};
