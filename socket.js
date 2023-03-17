import { Server } from 'socket.io';


const socketInit = (server) => {
    const io = new Server(server, {
        cors: {
            // TODO: will use the provided domain
            origin: ['http://localhost:3000', 'https://campfire.godtribe.com', 'http://staging.godtribe.com'],
            // origin: '*',
            // origin: 'https://godtribe-8f80d.web.app',
            // methods: ['GET', 'POST'],
            // credentials: true,
        },
    });

    let users = {};

    const socketToRoom = {};

    io.on('connection', (socket) => {
        socket.on('join room', ({
            campfireId,
            userId,
            isAdmin,
            isModerator,
            isSpeaker,
            userName,
            profileUrl,
        }) => {
            if (users[campfireId]) {
                const isUserExist = users[campfireId][userId];
                if (!isUserExist) {
                    users[campfireId] = {
                        ...users[campfireId],
                        [userId]: {
                            socketId: socket.id,
                            userId,
                            campfireId,
                            isAdmin,
                            isModerator,
                            isSpeaker,
                            userName,
                            profileUrl,
                        },
                    };
                }
            } else {
                users = {
                    [campfireId]: {
                        [userId]: {
                            socketId: socket.id,
                            userId,
                            campfireId,
                            isAdmin,
                            isModerator,
                            isSpeaker,
                            userName,
                            profileUrl,
                        },
                    },
                };
            }
            socketToRoom[socket.id] = campfireId;
            const newUsers = users[campfireId];
            socket.emit('send newUsers', newUsers);
        });

        socket.on('send new user joined', (payload) => {
            io.to(payload.callerId).emit('received new user joined', {
                userDetail: payload.userDetail,
                peerSignal: payload.peerSignal,
                memberId: payload.memberId,
            });
        });

        socket.on('returning signal', (payload) => {
            io.to(payload.callerID).emit('receiving returned signal', {
                signal: payload.signal,
                socketId: socket.id,
                userId: payload.userId,
                memberId: payload.memberId,
            });
        });

        socket.on(
            'setUsers',
            ({ campfireId, userSocketId, selectedUserId, operation, setValue }) => {
                if (operation === 'kick') {
                    const { [selectedUserId]: kickedUsers, ...rest } = users[campfireId];
                    users[campfireId] = rest;
                } else if (operation === 'kickAll') {
                    selectedUserId.forEach((val) => {
                        delete users[campfireId][val];
                    });
                } else {
                    users[campfireId] = {
                        ...users[campfireId],
                        [selectedUserId]: {
                            ...users[campfireId][selectedUserId],
                            ...setValue,
                        },
                    };
                }
                io.to(userSocketId).emit('receiving setUsers', {
                    selectedUserId,
                    operation,
                    setValue,
                });
            },
        );

        socket.on(
            'send raise signal',
            ({ campfireId, userId, isRaising, userSocketId }) => {
                users[campfireId] = {
                    ...users[campfireId],
                    [userId]: {
                    ...users[campfireId][userId],
                        isRaising,
                    },
                };
                io.to(userSocketId).emit('receiving raised signal', {
                    userId,
                    isRaised: isRaising,
                });
            },
        );

        socket.on(
            'send setEmoji',
            ({ campfireId, selectedId, emojiDetails, userSocketId }) => {
                users[campfireId] = {
                    ...users[campfireId],
                    [selectedId]: {
                        ...users[campfireId][selectedId],
                        ...emojiDetails,
                    },
                };
                io.to(userSocketId).emit('received setEmoji signal', {
                    setEmojiUserId: selectedId,
                    emojiDetails,
                });
            },
        );

        socket.on('end campfire', ({ userSocketId, campfireId }) => {
            users[campfireId] = {};
            io.to(userSocketId).emit('received end campfire');
        });

        socket.on('disconnect', (reason) => {
            const campfireId = socketToRoom[socket.id];
            let room = users[campfireId];
        
            if (room) {
                const disconnectedUser = Object.values(room).filter(
                    (user) => user.socketId === socket.id,
                )?.[0];
                if (disconnectedUser) {
                    const { [disconnectedUser.userId]: val, ...rest } = users[campfireId];
                    users[campfireId] = rest;
                    socket.broadcast.emit('user leave', {
                        userId: disconnectedUser.userId,
                        campfireId: disconnectedUser.campfireId,
                        reason,
                    });
                }
            }
            socket.disconnect();
        });

    });
}

export default socketInit;
