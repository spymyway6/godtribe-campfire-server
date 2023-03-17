import * as http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { PeerServer } from 'peer';

import app from './app.js'; 
import socketInit from './socketv1.js';

// import { createPeerServerListeners } from './groupCallHandler.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// const peerServer = PeerServer(server, {
//     debug: true,
// });

// app.use('/peerjs', peerServer);

// const peerServer = PeerServer(server);

// createPeerServerListeners(peerServer);

socketInit(server, app);

server.listen(PORT);
