import { Request, Response } from "express";

import DatabaseService from "../db/db";
import { STATUS_OK } from "../http/codes";

export class UserController {
    static async getMessages(req: Request, res: Response) {
        const { id, user_id } = req.query;
        
        const response = await new DatabaseService().prepareQuery({
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
    }

    static sendMessages(req: Request, res: Response) {
        res.status(STATUS_OK).end();
    }

    static async getAvatar(req: Request, res: Response) {
        const { id } = req.query;
        
        const response = await new DatabaseService().prepareQuery({
            query: "SELECT photo FROM users WHERE id = ?",
            values: [
                id
            ]
        });

        res.status(response.status).send(response.data[0]);
    }

    static async getSearch(req: Request, res: Response) {
        const { search, id } = req.query;
        console.log(id);

        const response = await new DatabaseService().prepareQuery({
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
    }

    static async getContacts(req: Request, res: Response) {
        const { id } = req.query;

        // let separator = "@//|?[]@\\////1°@|";

        const response = await new DatabaseService().prepareQuery({
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
    }

    static async addContact(req: Request, res: Response) {
        const { id, contact } = req.body;

        const response = await new DatabaseService().prepareQuery({
            query: "INSERT INTO contacts (contactId, contactOf) VALUES (?, ?)",
            values: [
                contact,
                id
            ]
        });

        res.status(response.status).send(response.data);
    }
}