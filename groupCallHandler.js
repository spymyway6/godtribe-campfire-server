export const createPeerServerListeners = (peerServer) => {
    peerServer.on('connection', (client) => {
        console.log(client.id, 'peer listens');
    });
};