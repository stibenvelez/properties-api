import nodeMailer from "nodemailer";
import doenv from "dotenv";

doenv.config();

export const emailCreateUser = async  ({email, fisrtName,lastName, token})   => {

    const transport = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    // info email
    const info = await transport.sendMail({
        from: '"Properties" <properties@correo.com>',
        to: email,
        subject: "Properties - Confirmacion de cuenta",
        text: "Confirma tu cuenta en Properties",
        html: `
            <p>Hola: ${fisrtName}, comprueba tu cuenta como ausuario de properties</p>
            <p>Para confirmar tu cuenta haz click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirmar cuenta</a>

            <p>Si no has solicitado una cuenta, puedes ignorar este correo.</p>

        `,
    });

};

export const emailForgetPassword = async ({ email, fisrtName, lastName, token }) => {

    const transport = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // info email
    const info = await transport.sendMail({
        from: '"Properties" <properties@correo.com>',
        to: email,
        subject: "Properties - Restablece tu contraseña",
        text: "Has solicitado restablecer tu contraseña",
        html: `
            <p>Hola: ${fisrtName}, Has solicitado generar una nueva contraseña</p>
            <p>Sigue el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/admin/users/forget-password/${token}">Restrablecer contraseña</a>

            <p>Si no hiciste la solicitud, ignora este correo</p>

        `,
    });
}

export const emailContactMe = async ({ email, fisrtName }) => {
    const transport = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // info email
    const info = await transport.sendMail({
        from: '"Properties" <properties@correo.com>',
        to: email,
        subject: "Properties - Mensaje de contacto",
        text: "Has solicitado enviar un mensaje de contacto",
        html: `

            <p>Hola: ${fisrtName}, Has solicitado enviar un mensaje de contacto</p>
            <p>Hemos recibido tu solicitud con éxito. Uno de nuestros asesores se pondrá en contacto lo más pronto posible para resolver todas tus inquietudes.</p>
            <p>Si no hiciste la solicitud, ignora este correo</p>
        `,
    });
    console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
}
    