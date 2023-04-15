import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

import fs from "fs/promises";
import { initializeDatabase, queryStruct } from "../interface/Interface";
import { CONTACTS, USERS } from "./users";
import { Tables } from "./tables";

class DatabaseService implements initializeDatabase {
    async initialize() {
        const db = await this.getDatabase();
        await new Tables(db).create();
        this.insertData();
    }

    async insertData() {
        USERS.forEach(async (str) => {
            const img64 = await fs.readFile("assets/images/" + str.photo, "base64");

            const pw = await bcrypt.hash(str.password, 13);

            await new DatabaseService().prepareQuery({
                query: "INSERT INTO users (email, password, name, lastname, photo) VALUES (?, ?, ?, ?, ?)",
                values: [
                    str.email,
                    pw,
                    str.name,
                    str.lastname,
                    "data:image/jpeg;base64," + img64
                ]
            });
        });

        CONTACTS.forEach(async (str) => {
            await new DatabaseService().prepareQuery({ 
                query: "INSERT INTO contacts (contactId, contactOf) VALUES (?, ?)",
                values: [
                    str.id,
                    str.contactOf
                ]
            });
        });
    }

    async prepareQuery(params: queryStruct) {
        const db = await this.getDatabase();

        try {
            const result = await db.all(params.query, params.values);

            return {
                data: result,
                status: 200
            };
        }
        catch(error) {
            console.log(error);

            return {
                data: "As error has occurred.",
                status: 500
            };
        }
    }

    async getDatabase() {
        const db = await open({
            filename: "db/database.db",
            driver: sqlite3.Database
        });

        return db;
    }
}

export default DatabaseService;