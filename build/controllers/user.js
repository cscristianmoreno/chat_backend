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
exports.UserController = void 0;
const db_1 = __importDefault(require("../db/db"));
const codes_1 = require("../http/codes");
class UserController {
    static getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = req.query;
            const response = yield new db_1.default().prepareQuery({
                query: `
                SELECT 
                    sender,
                    received,
                    message,
                    date
                FROM 
                    messages
                WHERE 
                        received = ?
                    AND
                        sender = ?
                OR
                        received = ?
                    AND
                        sender = ?
                `,
                values: [
                    user_id,
                    id,
                    id,
                    user_id
                ]
            });
            res.status(response.status).send(response.data);
        });
    }
    static sendMessages(req, res) {
        res.status(codes_1.STATUS_OK).end();
    }
    static getAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            const response = yield new db_1.default().prepareQuery({
                query: "SELECT photo FROM users WHERE id = ?",
                values: [
                    id
                ]
            });
            res.status(response.status).send(response.data[0]);
        });
    }
    static getSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, id } = req.query;
            console.log(id);
            const response = yield new db_1.default().prepareQuery({
                query: `
                SELECT 
                    u.id, 
                    u.name, 
                    u.lastname,
                    u.photo
                FROM 
                    users AS u
                LEFT JOIN
                    contacts AS c
                ON
                    c.contactId = u.id
                AND
                    c.contactOf = ?
                WHERE
                    c.contactId IS NULL
                AND
                    u.id != ?
                AND
                    u.name || u.lastname LIKE ?
                GROUP BY
                    u.id
                `,
                values: [
                    id,
                    id,
                    `%${search}%`,
                ]
            });
            res.send(response.data);
        });
    }
    static getContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            // let separator = "@//|?[]@\\////1°@|";
            const response = yield new db_1.default().prepareQuery({
                query: `
                    SELECT 
                        t1.id,
                        t1.name,
                        t1.lastname,
                        t1.photo,
                        t3.message AS messages,
                        MAX(t3.id) AS lastID,
                        t3.date
                    FROM 
                        users AS t1
                    LEFT JOIN 
                        contacts AS t2
                    ON 
                        t2.contactOf = ?
                    LEFT JOIN
                        messages as t3
                    ON
                        t3.sender = t1.id
                    AND
                        t3.received = ?
                    OR
                        t3.sender = ?
                    AND
                        t3.received = t1.id 
                    WHERE 
                        t1.id = t2.contactId
                    GROUP BY
                        t1.id
                    ORDER BY
                        lastID DESC
                    `,
                values: [
                    id,
                    id,
                    id
                ]
            });
            res.status(response.status).send(response.data);
        });
    }
    static addContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, contact } = req.body;
            const response = yield new db_1.default().prepareQuery({
                query: "INSERT INTO contacts (contactId, contactOf) VALUES (?, ?)",
                values: [
                    contact,
                    id
                ]
            });
            res.status(response.status).send(response.data);
        });
    }
}
exports.UserController = UserController;
