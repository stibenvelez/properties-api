import {
    allProperties,
    allPropertiesByUserId,
    deleteProperty,
    importPorperties,
    insertProperty,
    minMaxPrice,
    propertyById,
    propertyByIdByUserId,
    propertyByReference,
    uploadProperty,
} from "./properties.DAL.js";
import csvtojson from "csvtojson";
import { findUserById } from "../user/user.DAL.js";
import { getCommentsByProperty } from "../comments/comments.DAL.js";

const COLUMNS_REQUIRED = [
    "reference",
    "title",
    "description",
    "price",
    "address",
    "building",
    "contactName",
    "contactEmail",
    "contactPhone",
    "contactCellphone",
    "antiquityYears",
    "lastAdminprice",
    "neighborhood",
    "propertyTypeId",
    "offerId",
    "area",
    "stratum",
    "bedrooms",
    "numElevators",
    "numFloor",
    "bathrooms",
    "garage",
    "parking",
    "remodelation",
    "latitude",
    "longitude",
    "saleOff",
    "cityId",
    "stateId",
    "image1",
    "image2",
    "image3",
    "image4",
    "image5",
    "image6",
    "createdBy",
];

const FIELDS_REQUIRED = [
    "title",
    "description",
    "price",
    "address",
    "cityId",
    "propertyTypeId",
    "offerId",
    "createdBy",
];

const IMAGES_ALLOWED = [
    "image1",
    "image2",
    "image3",
    "image4",
    "image5",
    "image6",
];

export const getAllPropertiesService = async (query) => {
    const [rows] = await allProperties(query);
    const [minMax] = await minMaxPrice(query);
    const addGalleryImgs = rows.map((property) => {
        let galleryImgs = [];

        IMAGES_ALLOWED.map((image) => {
            if (property[image]) {
                galleryImgs.push(property[image]);
            }
        });

        if (galleryImgs.length === 0) {
            galleryImgs = [];
        }
        delete property.createdAt;
        delete property.updateAt;
        delete property.createBy;
        delete property.image1;
        delete property.image2;
        delete property.image3;
        delete property.image4;
        delete property.image5;
        delete property.image6;
        return {
            ...property,
            galleryImgs,
        };
    });
    const dataPropeties = {
        results: addGalleryImgs,
        count: rows.length,
        ...minMax,
    };

    return dataPropeties;
};

export const getPropertyByIdService = async (req, res) => {
    const { id } = req.params;
    try {
        const [property] = await propertyById(id);


        if (!property) {
            res.status(400).json({ msg: "No se encontro la propiedad" });
            return
        }

        let galleryImgs = [];
        IMAGES_ALLOWED.map((image) => {
            if (property[image]) {
                galleryImgs.push(property[image]);
            }
        });
        property.latitude = parseFloat(property.latitude);
        property.longitude = parseFloat(property.longitude);
        if (property) {
            delete property.image1;
            delete property.image2;
            delete property.image3;
            delete property.image4;
            delete property.image5;
            delete property.image6;
        }
        property.galleryImgs = galleryImgs;
        const [user] = await findUserById(property.createdBy);
        property.createBy =
            {
                idUser: user?.idUser,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
            } || null;


        const comments = await getCommentsByProperty(id);
        property.comments = comments;
        return property;
    } catch (error) {
        throw error;
    }
};

export const getPropertyByReferenceService = async (req, res) => {
    const { reference } = req.params;
    try {
        const [property] = await propertyByReference(reference);
        if (property) {
            delete property.createdAt;
            delete property.updateAt;
            delete property.createBy;
            delete property.image1;
            delete property.image2;
            delete property.image3;
            delete property.image4;
            delete property.image5;
            delete property.image6;
        }
        return property;
    } catch (error) {
        throw error;
    }
};

export const getPropertiesByUserIdService = async (user) => {
    try {
        const [properties] = await allPropertiesByUserId(user);
        const dataPropeties = {
            results: properties,
            count: properties.length,
        };
        return dataPropeties;
    } catch (error) {
        throw error;
    }
};

export const getPropertyByIdByUserIdService = async (property) => {
    try {

        const galleryImgs = IMAGES_ALLOWED.map((item) => {
            if (!property[item] && typeof property[item] === undefined) {
                return false;
            }
            return property[item];
        }).filter((item) => item);
        property.galleryImgs = galleryImgs;
        property.latitude = parseFloat(property.latitude);
        property.longitude = parseFloat(property.longitude);

        return property;
    } catch (error) {
        throw error;
    }
};

export const updatePropertyService = async (req, res) => {
    const { id } = req.params;
    const [property] = await propertyById(id);
    const files = req.files;
    const body = req.body;

    if (!property) {
        return res.status(404).json({
            status: "error",
            msg: "Propiedad no encontrada",
        });
    }

    if (
        property.createdBy.toString() !== req.user.idUser.toString() &&
        req.user.role !== "admin"
    ) {
        return res
            .status(401)
            .json({ msg: "No tienes permisos para editar este inmueble" });
    }

    const filesNames = files.map((file) => file.originalname);
    if (typeof body.images === "string") {
        body.images = [body.images];
    }

    let images = [];
    if (typeof body.images !== "undefined") {
        images = body.images.concat(filesNames);
    } else {
        images = filesNames;
    }

    IMAGES_ALLOWED.map((image, index) => {
        if (images[index] !== undefined) {
            body[image] = images[index];
        } else {
            body[image] = null;
        }
    });

    const uploadData = {
        ...body,
        idProperty: id,
    };

    await uploadProperty(uploadData);

    try {
    } catch (error) {
        throw error;
    }
};

export const addNewPropertyService = async (body, files, user) => {
    try {
        IMAGES_ALLOWED.forEach(
            (image, index) => (body[image] = files[index]?.originalname || null)
        );
        body.createdBy = user.idUser;
        const result = await insertProperty(body);
        return result;
    } catch (error) {
        throw error;
    }
};

export const importPopertiesCSVService = async (file) => {

    const getProperties = (propertyData) => {
        const properties = propertyData
            .filter((property) => property.title)
            .map((property) =>
                Object.keys(property).map((key) => property[key])
            );
        return properties;
    };

    const validateColumns = async (data) => {
        if (data.length === 0) {
            return false;
        }
        let [columns] = data
            .filter((property) => property.title)
            .map((property) => Object.keys(property));

        let errors = [];
        COLUMNS_REQUIRED.forEach((column) => {
            if (!columns.includes(column)) {
                errors.push({
                    column: column,
                    error: `No se encontro la columna ${column}`,
                });
            }
        });

        if (errors.length > 0) {
            throw {
                msg: "Faltan columnas en el archivo",
                errors,
            };
        }


    };

    const validateRows = async (data) => {
        let errors = [];
        FIELDS_REQUIRED.forEach((field) => {
            data.forEach((property) => {
                if (!property[field]) {
                    errors.push({
                        reference: property.reference,
                        column: field,
                        error: `La columna <<${field}>> no puede estar vacia`,
                    });
                }
            });
        });

        if (errors.length > 0) {
            throw {
                msg: "Se encontraron errores en el archivo",
                errors,
            };
        }
    };

    const validateFormatFile = async (file) => {
        const extension = file.mimetype.split("/")[1];
        if (extension !== "csv") {
            throw { msg: "El formato del archivo no es valido" };
        }
    };

    try {
        const filePath = file.path;
        await validateFormatFile(file);
        const dataCSV = await csvtojson().fromFile(filePath);
        await validateColumns(dataCSV);
        await validateRows(dataCSV);
        const properties = await getProperties(dataCSV);
        await importPorperties(properties);
    } catch (error) {
        throw error;
    }
};

export const deletePropertyService = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const [property] = await propertyByIdByUserId(id, user);
        if (!property) {
            return res.status(404).json({
                msg: "Propiedad no encontrada",
            });
        }

        if (user.idUser !== property.createdBy && user.role !== "admin") {
            res.status(403).json({
                msg: "No tienes permisos necesarios para acceder a este sitio",
            });
            return;
        }

        const disablePropertyData = {
            idProperty: id,
            stateId: 2,
        };

        await deleteProperty(disablePropertyData);
    } catch (error) {
        throw error;
    }
};
