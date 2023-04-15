import { Server, Socket } from "socket.io";
import http from "http";
import { messageStruct } from "../interface/Interface";
import DatabaseService from "../db/db";

export class SocketController {
    static db: DatabaseService = new DatabaseService();

    constructor(private server: http.Server) {
        const io = new Server<http.Server>(server, {
            cors: {
                origin: "*"
            }
        });

        const map = new Map();

        io.on("connection", (socket: Socket) => {            
            socket.on("id", (id: number) => {
                map.set(id, socket.id);
                console.log(map);
            });

            socket.on("message", async (data: messageStruct) => {
                // console.log(map);
                await this.saveMessage(data);
                const receptor = map.get(data.received);

                const isContact = await this.checkUserContact(data.sender, data.received);

                if (!isContact) {
                    socket.to(receptor).emit("new", data);

                    await new DatabaseService().prepareQuery({
                        query: "INSERT INTO contacts (contactId, contactOf) VALUES (?, ?)",
                        values: [
                            data.sender,
                            data.received
                        ]
                    });

                    return;
                }

                socket.to(receptor).emit("message", data);
            });
        });
    }   

    public async saveMessage(data: messageStruct) {

        await new DatabaseService().prepareQuery({
            query: "INSERT INTO messages (sender, received, message, date) VALUES (?, ?, ?, ?)",
            values: [
                data.sender,
                data.received,
                data.message,
                data.date
            ]
        });

        console.log("Mensaje insertado");
    }

    public async checkUserContact(sender: number, received: number) {
        const response = await new DatabaseService().prepareQuery({
            query: "SELECT id FROM contacts WHERE contactId = ? AND contactOf = ?",
            values: [
                sender,
                received
            ]
        });

        return response.data.length;
    }
}