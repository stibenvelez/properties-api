import jwt from "jsonwebtoken";

const generateJWT = ({ idUser, firstName, lastName, email, role }) => {
    return jwt.sign(
        { idUser, firstName, lastName, email, role },
        process.env.SECRET,
        {
            expiresIn: "30d",
        }
    );
};

export default generateJWT;