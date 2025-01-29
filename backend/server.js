import express from 'express';
import { Server } from 'socket.io';
import http from 'http'
import cors from 'cors';
import sqlite3 from 'sqlite3'
import { open } from 'sqlite';

const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
})

await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        username TEXT,
        newMessage TEXT,
        imageLink TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

const app = express()
const server = http.createServer(app);
const io = new Server(server, { 
    connectionStateRecovery: {},
    cors: { origin : '*'},
});

app.use(cors())

io.on('connection', async (socket) => {
    console.log('Usuário Conectado');

    socket.on('chatMessage', async (data) => {
        let result;
        try {
            result = await db.run(`
                INSERT INTO users (username, newMessage, imageLink) 
                VALUES (?, ?, ?)`, 
                data.username, data.newMessage, data.imageLink)
        } catch (error) {
            return
        }

        const inserted = await db.get('SELECT * FROM users WHERE id = ?', result.lastID)
        io.emit('chatMessage', inserted)
    })
    if (!socket.recovered) {
        try {
            await db.each('SELECT * FROM users WHERE id > ?', [socket.handshake.auth.serverOffset || 0], (_err, row) => {
                socket.emit('chatMessage', row);
            });
        } catch (error) {
            console.log(error);
        }
    }
    

})

server.listen(3000, () => {
    console.log("Servidor ON");
})