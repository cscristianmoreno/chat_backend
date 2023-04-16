import { NextFunction, Request, Response } from "express";
import DatabaseService from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { userStruct } from "../interface/Interface";
import { STATUS_OK } from "../http/codes";

const SECRET_KEY = "|@User@|@Authentication||";

export class AuthController {
    static async authorization(req: Request, res: Response, next: NextFunction) {
        
        const authorization = req.get("Authorization");
        
        if (!authorization) {
            return next("Usuario no autorizado");
        }

        
        try {
            const auth = authorization?.split(" ")[1];
            const verify = jwt.verify(auth, SECRET_KEY);
            
            const { user_id } = verify as userStruct;
            
            const response = await new DatabaseService().prepareQuery({
                query: "SELECT id, name, lastname, photo FROM users WHERE id = ?",
                values: [
                    user_id
                ]
            });

            if (response.data.length === 0) {
                return next("Usuario no autorizado");
            }

            next();
        }
        catch (error) {
            return next(error);
        }   
    }

    static checkAuth(req: Request, res: Response) {
        res.status(STATUS_OK).send("Llegó acá");
    }

    static async userLogin(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const result = await new DatabaseService().prepareQuery({
            query: "SELECT id, password, name, lastname, date, photo FROM users WHERE email LIKE ?",
            values: [
                email
            ]
        });

        if (!result.data.length) {
            return next("Los datos introducidos son incorrectos.");
        }
        
        const pw: boolean = await bcrypt.compare(password, result.data[0].password);
        
        if (!pw) {
            return next("Los datos introducidos son incorrectos.");
        }
        const userInfo = {
            user_id: result.data[0].id,
            user_name: result.data[0].name,
            user_lastname: result.data[0].lastname
        };
    
        const token = jwt.sign(userInfo, SECRET_KEY, {
            expiresIn: "1h"
        });

        res.status(result.status).json({
            token: token
        });
    }

    static async userRegister(req: Request, res: Response) {
        const data = req.body;

        const pw = await bcrypt.hash(data.password, 13);
    
        await new DatabaseService().prepareQuery({
            query: "INSERT INTO users (email, password, name, lastname, photo) VALUES (?, ?, ?, ?, ?)",
            values: [
                data.email,
                pw,
                data.name,
                data.lastname,
                data.file,
            ]
        });
    
        // console.log(result);
    
        res.end();
    }
}