import { Database } from "sqlite";

export class Tables {
    constructor(private db: Database) {   
    }

    async create() {
        await this.db.run("DROP TABLE IF EXISTS users");
        await this.db.run("DROP TABLE IF EXISTS contacts");
        await this.db.run("DROP TABLE IF EXISTS messages");

        await this.db.run(`
            CREATE TABLE IF NOT EXISTS users ( 
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                email VARCHAR(32) NOT NULL UNIQUE, 
                password VARCHAR(32) NOT NULL, 
                name VARCHAR(32) NOT NULL, 
                lastname VARCHAR(32) NOT NULL, 
                photo TEXT NOT NULL DEFAULT '', 
                date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
            ) 
        `);

        await this.db.run(`
            CREATE TABLE IF NOT EXISTS contacts ( 
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                contactId INTEGER NOT NULL, \
                contactOf INTEGER NOT NULL, \
                date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
            )
        `);

        await this.db.run(`
            CREATE TABLE IF NOT EXISTS messages ( 
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                sender INTEGER NOT NULL, 
                received INTEGER NOT NULL, 
                message VARCHAR(256) NOT NULL, 
                date TIMESTAMP NOT NULL 
            ) 
        `);
    }
}