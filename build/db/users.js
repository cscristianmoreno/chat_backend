"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTACTS = exports.USERS = void 0;
exports.USERS = [
    {
        id: 1,
        email: "facundo_hernandez@mailtest.com",
        password: "facundo_hernandez",
        name: "Facundo",
        lastname: "Hernandez",
        photo: "photo.jpg",
    },
    {
        id: 2,
        email: "camila_herrera@mailtest.com",
        password: "camila_herrera",
        name: "Camila",
        lastname: "Herrara",
        photo: "photo2.jpg",
    },
    {
        id: 3,
        email: "test",
        password: "test",
        name: "Romina",
        lastname: "Perez",
        photo: "photo3.jpg",
    },
    {
        id: 4,
        email: "carlos_montenegro@mailtest.com",
        password: "carlos_montenegro",
        name: "Carlos",
        lastname: "Montenegro",
        photo: "photo4.jpg",
    },
    {
        id: 5,
        email: "marcos_ibaceta@mailtest.com",
        password: "marcos_ibaceta",
        name: "Marcos Ibaceta",
        lastname: "Montenegro",
        photo: "photo4.jpg",
    },
    {
        id: 6,
        email: "oscar_ruedas@mailtest.com",
        password: "oscar_ruedas",
        name: "Oscar Ruedas",
        lastname: "Montenegro",
        photo: "photo4.jpg",
    },
];
exports.CONTACTS = [
    {
        id: 1,
        contactOf: 1,
        name: "Oscar Fernandez",
        photo: "photo.jpg",
    },
    {
        id: 2,
        contactOf: 1,
        name: "Camila Herrera",
        photo: "photo2.jpg",
    },
    {
        id: 3,
        contactOf: 5,
        name: "Romina Perez",
        photo: "photo3.jpg",
    },
    {
        id: 4,
        contactOf: 1,
        name: "Carlos Montenegro",
        photo: "photo4.jpg",
    },
];
