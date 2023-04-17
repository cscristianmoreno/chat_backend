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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tables = void 0;
class Tables {
    constructor(db) {
        this.db = db;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.run("DROP TABLE IF EXISTS users");
            yield this.db.run("DROP TABLE IF EXISTS contacts");
            yield this.db.run("DROP TABLE IF EXISTS messages");
            yield this.db.run(`
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
            yield this.db.run(`
            CREATE TABLE IF NOT EXISTS contacts ( 
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                contactId INTEGER NOT NULL, \
                contactOf INTEGER NOT NULL, \
                date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
            )
        `);
            yield this.db.run(`
            CREATE TABLE IF NOT EXISTS messages ( 
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                sender INTEGER NOT NULL, 
                received INTEGER NOT NULL, 
                message VARCHAR(256) NOT NULL, 
                date TIMESTAMP NOT NULL 
            ) 
        `);
        });
    }
}
exports.Tables = Tables;
