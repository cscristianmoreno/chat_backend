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
exports.SocketController = void 0;
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("../db/db"));
class SocketController {
    constructor(server) {
        this.server = server;
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: "*"
            }
        });
        const map = new Map();
        io.on("connection", (socket) => {
            socket.on("id", (id) => {
                map.set(id, socket.id);
                console.log(map);
            });
            socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                // console.log(map);
                yield this.saveMessage(data);
                const receptor = map.get(data.received);
                const isContact = yield this.checkUserContact(data.sender, data.received);
                if (!isContact) {
                    socket.to(receptor).emit("new", data);
                    yield new db_1.default().prepareQuery({
                        query: "INSERT INTO contacts (contactId, contactOf) VALUES (?, ?)",
                        values: [
                            data.sender,
                            data.received
                        ]
                    });
                    return;
                }
                socket.to(receptor).emit("message", data);
            }));
        });
    }
    saveMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new db_1.default().prepareQuery({
                query: "INSERT INTO messages (sender, received, message, date) VALUES (?, ?, ?, ?)",
                values: [
                    data.sender,
                    data.received,
                    data.message,
                    data.date
                ]
            });
            console.log("Mensaje insertado");
        });
    }
    checkUserContact(sender, received) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield new db_1.default().prepareQuery({
                query: "SELECT id FROM contacts WHERE contactId = ? AND contactOf = ?",
                values: [
                    sender,
                    received
                ]
            });
            return response.data.length;
        });
    }
}
SocketController.db = new db_1.default();
exports.SocketController = SocketController;
