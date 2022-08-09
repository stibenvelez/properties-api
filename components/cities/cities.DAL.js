import connection from "../../config/db.js";

export const allCityes = async () => {
    try {
        const sql = `
        SELECT c.*,
        d.departament
        FROM Cities AS c

        LEFT JOIN Departaments AS d ON d.idDepartament = c.IdDepartament

        `;
        return await connection.query(sql);
    } catch (error) {
        console.log(error);
        throw error
    }
};

export const allCityesWhitProperties = async (query) => {
    try {
        const filterByOffer = () => {
            if (query.offer) {
                return `AND offer = '${query.offer}'`;
            }
            return '';
        }

        const sql = `
        SELECT c.*,
        d.departament,
        COUNT(c.cityId) AS countProperties,
        COUNT(IF(p.offerId = 1, 1, NULL)) countSell,
        COUNT(IF(p.offerId = 2, 1, NULL)) countRent,
        o.offer
        FROM Cities AS c

        LEFT JOIN Departaments AS d ON d.idDepartament = c.IdDepartament
        INNER JOIN Properties AS p ON p.cityId = c.cityId
        INNER JOIN Offer AS o ON o.offerId = p.offerId
         ${filterByOffer()}
        GROUP BY c.cityId
        ORDER BY COUNT(c.cityId) DESC
        `;
        return await connection.query(sql);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
