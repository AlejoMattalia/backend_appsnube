import jwt from "jwt-simple";
import moment from "moment";
import { secret } from "../service/jwt.js";



export const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "Error",
            message: "La petición no tiene cabecera de autenticación"
        });
    }

    //limpiar token
    let token = req.headers.authorization.replace(/['"]+/g, "")

    try {
        let payload = jwt.decode(token, secret)

        if (payload.exp <= moment().unix()) {
            res.status(404).json({
                status: "Error",
                message: "Token expirado",
            })
        }

        req.user = payload;

    } catch (err) {
        res.status(404).json({
            status: "Error",
            message: "Token invalido",
            err
        })
    }

    next();
}


export const authAdmin = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "Error",
            message: "La petición no tiene cabecera de autenticación"
        });
    }

    //limpiar token
    let token = req.headers.authorization.replace(/['"]+/g, "")

    try {
        let payload = jwt.decode(token, secret)

        if (payload.exp <= moment().unix()) {
            res.status(404).json({
                status: "Error",
                message: "Token expirado",
            })
        }

        if (payload.role !== "admin") {
            res.status(404).json({
                status: "Error",
                message: "No eres administrador",
            })
        }

        req.user = payload;

    } catch (err) {
        res.status(404).json({
            status: "Error",
            message: "Token invalido",
            err
        })
    }

    next();
}