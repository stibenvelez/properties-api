import connection from "../../config/db.js";

export const allProperties = async ({
    rangePrices,
    propertyType,
    bedrooms,
    bathrooms,
    city,
    category,
    reference,
    neighborhood,
}) => {
    try {
        const filterByRangePrices = () => {
            if (rangePrices && rangePrices[0] == 0 && rangePrices[1] == 0) {
                return `p.price >0`;
            }

            if (rangePrices && rangePrices[0] && rangePrices[1]) {
                return `p.price >= ${rangePrices[0]} AND p.price <= ${rangePrices[1]}`;
            }
            return `p.price >0`;
        };

        const filterByPropertyType = () => {
            if (propertyType) {
                return `and pt.propertyType LIKE '%${propertyType}%'`;
            }
            return "";
        };

        const filterByBedroomsNumber = () => {
            if (bedrooms) {
                return `AND p.bedrooms >= '${bedrooms}'`;
            }
            return "";
        };
        const filterByBathroomsNumber = () => {
            if (bathrooms) {
                return `AND p.bathrooms >= '${bathrooms}'`;
            }
            return "";
        };
        const filterByCity = () => {
            if (city) {
                return `AND c.city LIKE '%${city}%'`;
            }
            return "";
        };
        const filterByOffer = () => {
            if (category) {
                return `AND offer = '${category}'`;
            }
            return "";
        };
        const filterByReference = () => {
            if (reference && reference !== "") {
                return `AND p.reference = '${reference}'`;
            }
            return "";
        };

        const filterByNeighborhood = () => {
            if (neighborhood && neighborhood !== "") {
                return `AND p.neighborhood LIKE '%${neighborhood}%'`;
            }
            return "";
        };

        const sql = `
        SELECT p.*, c.city, sp.state
        FROM Properties AS p
        LEFT JOIN PropertyTypes AS pt ON pt.propertyTypeId = p.propertyTypeId
        LEFT JOIN Offer AS o ON p.offerId = o.offerId
        INNER JOIN Cities AS c ON c.cityId = p.cityId
        INNER JOIN StatesProperty AS sp ON sp.stateId = p.stateId
        WHERE
        ${filterByRangePrices()}
        ${filterByPropertyType()}
        ${filterByBedroomsNumber()}
        ${filterByBathroomsNumber()}
        ${filterByCity()}
        ${filterByOffer()}
        ${filterByReference()}
        ${filterByNeighborhood()}
        AND p.stateId = 1
        `;

        return await connection.query(sql);
    } catch (error) {
        throw error;
    }
};
export const propertyById = async (id) => {
    try {
        const sql = `
        SELECT p.*, pt.propertyType, o.offer, c.city, sp.state
        FROM Properties AS p
        LEFT JOIN PropertyTypes AS pt ON pt.propertyTypeId = p.propertyTypeId
        LEFT JOIN Offer AS o ON p.offerId = o.offerId
        LEFT JOIN Cities AS c ON c.cod = p.cityId
        LEFT JOIN StatesProperty AS sp ON sp.stateId = p.stateId
        WHERE p.idProperty = ${id}          
        `;
        const [property] = await connection.query(sql);
        return property;
    } catch (error) {
        throw error;
    }
};

export const allPropertiesByUserId = async ({ idUser, role }) => {
    try {
        const sql = `
        SELECT p.*, pt.propertyType, o.offer, c.city, sp.state

        FROM Properties AS p

        INNER JOIN Cities AS c ON p.cityId = c.cityId
        INNER JOIN PropertyTypes AS pt ON p.propertyTypeId = pt.propertyTypeId 
        INNER JOIN Offer AS o ON p.offerId = o.offerId
        INNER JOIN StatesProperty AS sp ON sp.stateId = p.stateId
        ${role !== "admin" ? `WHERE p.createdBy = ${idUser}` : ""}
        ${role !== "admin" ? `AND p.stateId != 2` : ""}
        ORDER BY p.stateId ASC, p.createdAt DESC
        `;
        return await connection.query(sql);
    } catch (error) {
        throw error;
    }
};

export const propertyByIdByUserId = async (id, user) => {
    const filterByCreatedBy = () => {
        if (user.role !== "admin") {
            return `AND p.createdBy = '${user.userId}'`;
        }
        return "";
    };

    try {
        const sql = `
        SELECT p.*, pt.propertyType, o.offer, c.city, d.idDepartament, d.departament, sp.state
        FROM Properties AS p
        LEFT JOIN PropertyTypes AS pt ON pt.propertyTypeId = p.propertyTypeId
        LEFT JOIN Offer AS o ON p.offerId = o.offerId
        LEFT JOIN Cities AS c ON c.cityId = p.cityId
        LEFT JOIN Departaments AS d ON d.idDepartament = c.idDepartament
        INNER JOIN StatesProperty AS sp ON sp.stateId = p.stateId
        
        WHERE p.idProperty = '${id}'
        ${filterByCreatedBy()}
        `;

        const [rows] = await connection.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
};

export const propertyByReference = async (reference) => {
    try {
        const sql = `
        SELECT p.reference, p.stateId
        FROM Properties AS p
        WHERE p.reference = '${reference}'
        `;
        const [rows] = await connection.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
};

export const insertProperty = async (property) => {
    try {
        const values = [
            property.reference,
            property.title,
            property.description,
            property.price,
            property.address,
            property.building,
            property.contactName,
            property.contactEmail,
            property.contactPhone,
            property.contactCellphone,
            property.antiquityYears,
            property.lastAdminprice,
            property.neighborhood,
            property.propertyType,
            property.offer,
            property.area,
            property.stratum,
            property.bedrooms,
            property.numElevators,
            property.numFloor,
            property.bathrooms,
            property.garage,
            property.parking,
            property.remodelation,
            property.latitude,
            property.longitude,
            property.city,
            property.contact,
            property.saleOff,
            property.image1,
            property.image2,
            property.image3,
            property.image4,
            property.image5,
            property.image6,
            property.createdBy,
        ];
        const sql = `
        INSERT INTO Properties (
            reference,
            title,
            description,
            price,
            address,
            building,
            contactName,
            contactEmail,
            contactPhone,
            contactCellphone,
            antiquityYears,
            lastAdminprice, 
            neighborhood,
            propertyTypeId,
            offerId,
            area,
            stratum,
            bedrooms,
            numElevators,
            numFloor,
            bathrooms,
            garage,
            parking,
            remodelation,
            latitude,
            longitude,
            cityId,
            contact,
            saleOff,
            image1,
            image2,
            image3,
            image4,
            image5,
            image6,
            createdBy
            )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        
        `;
        return await connection.query(sql, values);
    } catch (error) {
        throw error;
    }
};

export const importPorperties = async (properties) => {   
    try {
        await connection.query("START TRANSACTION");
        const sql = `
        INSERT INTO Properties (
                reference,
                title,
                description,
                price,
                address,
                building,
                contactName,
                contactEmail,
                contactPhone,
                contactCellphone,
                antiquityYears,
                lastAdminprice,
                neighborhood,
                propertyTypeId,
                offerId,
                area,
                stratum,
                bedrooms,
                numElevators,
                numFloor,
                bathrooms,
                garage,
                parking,
                remodelation,
                latitude,
                longitude,
                saleOff,
                cityId,
                stateId,
                image1,
                image2, 
                image3,
                image4,
                image5, 
                image6,
                createdBy

                )           
        VALUES ?
        `;
        await connection.query(sql, [properties]);
        const result = await connection.query(`COMMIT`);
        return result;
    } catch (error) {

        await connection.query("ROLLBACK");

        if (error.code === "ER_BAD_FIELD_ERROR") {
            throw {
                msg: "Error con el archivo",
                text: "Las columnas no coinciden con las esperadas por la base de datos",
            };
        }

        if (error.code === "ER_DUP_ENTRY") {
            
            throw {
                msg: "Datos duplicados",
                text: "El archivo contiene referencias duplicadas",
            };
        }

        throw {
            msg: "Error importanto las propiedades",
        };
    }
    
};

export const columnsPorperties = async () => {
    try {
        const sql = `
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Properties'
        `;
        return await connection.query(sql);
    } catch (error) {
        throw error;
    }
};

export const uploadProperty = async (property) => {
    try {
        const sql = `
        UPDATE Properties SET
            reference = ?,
            title = ?,
            description = ?,
            price = ?,
            address = ?,
            building = ?,
            contactName = ?,
            contactEmail = ?,
            contactPhone = ?,
            contactCellPhone = ?,
            antiquityYears = ?,
            lastAdminprice = ?,
            neighborhood = ?,
            propertyTypeId = ?,
            offerId = ?,
            area = ?,
            stratum = ?,
            bedrooms = ?,
            numElevators = ?,
            numFloor = ?,
            bathrooms = ?,
            garage = ?,
            parking = ?,
            remodelation = ?,
            latitude = ?,
            longitude = ?,
            cityId = ?,
            saleOff = ?,
            image1 = ?,
            image2 = ?,
            image3 = ?,
            image4 = ?,
            image5 = ?,
            image6 = ?,
            stateId = ?
        WHERE idProperty = ?
        `;
        return await connection.query(sql, [
            property.reference,
            property.title,
            property.description,
            property.price,
            property.address,
            property.building,
            property.contactName,
            property.contactEmail,
            property.contactPhone,
            property.contactCellphone,
            property.antiquityYears,
            property.lastAdminprice,
            property.neighborhood,
            property.propertyTypeId,
            property.offerId,
            property.area,
            property.stratum,
            property.bedrooms,
            property.numElevators,
            property.numFloor,
            property.bathrooms,
            property.garage,
            property.parking,
            property.remodelation,
            property.latitude,
            property.longitude,
            property.cityId,
            property.saleOff,
            property.image1,
            property.image2,
            property.image3,
            property.image4,
            property.image5,
            property.image6,
            property.stateId,
            property.idProperty,
        ]);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteProperty = async (property) => {
    try {
        const sql = `
        UPDATE Properties SET
            stateId = ?
        WHERE idProperty = ?
        `;
        return await connection.query(sql, [
            property.stateId,
            property.idProperty,
        ]);
    } catch (error) {
        throw error;
    }
};

export const minMaxPrice = async ({ category }) => {
    const filterByOffer = () => {
        if (category) {
            return `WHERE o.offer = '${category}'`;
        }
        return "";
    };

    try {
        const sql = `
        SELECT MIN(price) as minPrice, MAX(price) as maxPrice FROM Properties AS p
        LEFT JOIN Offer AS o ON p.offerId = o.offerId
         ${filterByOffer()}

        `;
        const [rows] = await connection.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
};
