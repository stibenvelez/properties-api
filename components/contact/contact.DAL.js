import connection from "../../config/db.js";

export const insertContactMe = async (contact) => {
    try {
        const sql = `
            INSERT INTO Contactme (
                email,
                firstName,
                lastName,
                message,
                observations,
                contactedBy,
                idProperty,
                stateId
            )
            VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )

                `;
        const values = [
            contact.email,
            contact.firstName,
            contact.lastName,
            contact.message,
            contact.observations,
            contact.contactedBy,
            contact.idProperty,
            contact.state,
        ];
        const [result] = await connection.query(sql, values);
        return result;
    } catch (error) {
        throw error;
    }
};

export const allToContact = async () => {
    try {
        const sql = `
            SELECT *
            FROM Contactme
            INNER JOIN StatesContact AS sc ON Contactme.stateId = sc.stateId  
            ORDER BY  Contactme.stateId ASC, Contactme.id DESC
            `;
        const [result] = await connection.query(sql);
        return result;
    } catch (error) {
        throw error;
    }
};

export const ToContactById = async (id) => {
    try {
        const sql = `
            SELECT c.*, sc.state, 01 AS holi
            FROM Contactme AS c
            INNER JOIN StatesContact AS sc ON c.stateId = sc.stateId
            WHERE id = ${id}
            `;
        const [result] = await connection.query(sql);
        return result;
    } catch (error) {
        throw error;
    }
};

export const allContactManagement = async (id) => {
    try {
        const sql = `
            SELECT cm.*, sc.state, u.firstName, u.lastName
            FROM ContactManagement AS cm
            INNER JOIN StatesContact AS sc ON cm.idStateContact  = sc.stateId
            INNER JOIN Users AS u ON cm.managedBy = u.idUser 
            WHERE cm.contactMeId  = ${id}
            ORDER BY createdAt DESC
            `;
        const [result] = await connection.query(sql);
        return result;
    } catch (error) {
        throw error;
    }
};

export const insertContactManagement = async (contactManagement) => {
    try {
        await connection.query("START TRANSACTION");
        const sql = `
            INSERT INTO ContactManagement (
                idStateContact,
                observations,
                managedBy,
                contactMeId
            )
            VALUES (
                ?,
                ?,
                ?,
                ?
            )

                `;
        const values = [
            contactManagement.state,
            contactManagement.observations,
            contactManagement.managedBy,
            contactManagement.id,
        ];
        const sqlContactMe = `
            UPDATE Contactme SET stateId = ${contactManagement.state}
            WHERE id = ${contactManagement.id}
            `;
        const [result] = await connection.query(sql, values);
        await connection.query(sqlContactMe);
        await connection.query(`COMMIT`);
        return result;
    } catch (error) {
        await connection.query("ROLLBACK");
        throw error;
    }
};

export const discardContactById = async ({ id, state, user }) => {
    try {
        await connection.query("START TRANSACTION");
        const sqlContactme = `
            UPDATE Contactme SET
            stateId = ${state},
            contactedBy = ${user.idUser}
            WHERE id = ${id}
            `;
        const sqlContactManagement = `
            INSERT INTO ContactManagement (
                idStateContact,
                managedBy,
                contactMeId
            )
            VALUES (
                ?,
                ?,
                ?
                
            )

                `;
        const values = [state, user.idUser, id];
        await connection.query(sqlContactme);
        await connection.query(sqlContactManagement, values);
        await connection.query(`COMMIT`);
        return;
    } catch (error) {
        await connection.query("ROLLBACK");
        throw error;
    }
};
