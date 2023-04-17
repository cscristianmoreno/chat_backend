import cors from "cors";
import express from "express";
import { AuthController } from "./controllers/auth";

import http from "http";
import { SocketController } from "./controllers/sockets";
import { ErrorController } from "./controllers/error";
import { UserController } from "./controllers/user";
import DatabaseService from "./db/db";
import path from "path";

const app = express();
const PORT = 4000;

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb"}));
app.use(cors());
    
const server: http.Server = app.listen(PORT, () => {
    // new DatabaseService().initialize();
    console.log("Corriendo en el puerto " + PORT);
});

new SocketController(server);

app.post("/login", AuthController.userLogin);
app.post("/register", AuthController.userRegister);

app.use(AuthController.authorization);
app.post("/auth", AuthController.checkAuth);


app.get("/contacts", UserController.getContacts);
app.get("/messages", UserController.getMessages);
app.get("/avatar", UserController.getAvatar);
app.get("/search", UserController.getSearch);
app.post("/messages", UserController.sendMessages);
app.post("/add", UserController.addContact);

app.use(ErrorController.error);