"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const db_1 = __importDefault(require("../db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const codes_1 = require("../http/codes");
const SECRET_KEY = "|@User@|@Authentication||";
class AuthController {
    static authorization(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.get("Authorization");
            if (!authorization) {
                return next("Usuario no autorizado");
            }
            try {
                const auth = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
                const verify = jsonwebtoken_1.default.verify(auth, SECRET_KEY);
                const { user_id } = verify;
                const response = yield new db_1.default().prepareQuery({
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
        });
    }
    static checkAuth(req, res) {
        res.status(codes_1.STATUS_OK).end();
    }
    static userLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const result = yield new db_1.default().prepareQuery({
                query: "SELECT id, password, name, lastname, date, photo FROM users WHERE email LIKE ?",
                values: [
                    email
                ]
            });
            if (!result.data.length) {
                return next("Los datos introducidos son incorrectos.");
            }
            const pw = yield bcrypt_1.default.compare(password, result.data[0].password);
            if (!pw) {
                return next("Los datos introducidos son incorrectos.");
            }
            const userInfo = {
                user_id: result.data[0].id,
                user_name: result.data[0].name,
                user_lastname: result.data[0].lastname
            };
            const token = jsonwebtoken_1.default.sign(userInfo, SECRET_KEY, {
                expiresIn: "1h"
            });
            res.status(result.status).json({
                token: token
            });
        });
    }
    static userRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const pw = yield bcrypt_1.default.hash(data.password, 13);
            yield new db_1.default().prepareQuery({
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
        });
    }
}
exports.AuthController = AuthController;
