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
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const bcrypt_1 = __importDefault(require("bcrypt"));
const promises_1 = __importDefault(require("fs/promises"));
const users_1 = require("./users");
const tables_1 = require("./tables");
const path_1 = __importDefault(require("path"));
class DatabaseService {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDatabase();
            yield new tables_1.Tables(db).create();
            this.insertData();
        });
    }
    insertData() {
        return __awaiter(this, void 0, void 0, function* () {
            users_1.USERS.forEach((str) => __awaiter(this, void 0, void 0, function* () {
                const img64 = yield promises_1.default.readFile(path_1.default.join(__dirname, "../assets/images/" + str.photo, "base64"));
                const pw = yield bcrypt_1.default.hash(str.password, 13);
                yield new DatabaseService().prepareQuery({
                    query: "INSERT INTO users (email, password, name, lastname, photo) VALUES (?, ?, ?, ?, ?)",
                    values: [
                        str.email,
                        pw,
                        str.name,
                        str.lastname,
                        "data:image/jpeg;base64," + img64
                    ]
                });
            }));
        });
    }
    prepareQuery(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDatabase();
            try {
                const result = yield db.all(params.query, params.values);
                return {
                    data: result,
                    status: 200
                };
            }
            catch (error) {
                console.log(error);
                return {
                    data: "As error has occurred.",
                    status: 500
                };
            }
        });
    }
    getDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, sqlite_1.open)({
                filename: path_1.default.join(__dirname, "database.db"),
                driver: sqlite3_1.default.Database
            });
            return db;
        });
    }
}
exports.default = DatabaseService;
