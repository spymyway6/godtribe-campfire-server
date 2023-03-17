import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import { Map, List } from 'immutable';
import { arrayToObject } from './helper/index.js'

import {
    fetchCampfires,
    fetchOwnCampfires,
    fetchPublicCampfires,
    fetchPrivateCampfires,
    fetchCampfireById,
    createCampfire,
    updateCampfire,
    deleteCampfire,
    fetchCampfireMembers,
    updateMember,
    updateCampfireHandler,
} from './controllers/campfire.js';
import Campfire from './models/campfire.js';
import { createPeerServerListeners } from './groupCallHandler.js';

const socketInit = (server, app) => {
    const socketToRoom = {};
    const rooms = [];
    let admins = [];
    let audiences = [];
    let adminList = [];
    let audienceList = [];

    // const peerServer = ExpressPeerServer(server, {
    //     debug: true,
    // });

    // console.log(peerServer, 'peerServer');

    // app.use('/peerjs', peerServer);

    const io = new Server(server, {
        cors: {
            // TODO: will use the provided domain
            origin: ['http://localhost:3000', 'http://localhost:5000', 'https://campfire.godtribe.com', 'http://staging.godtribe.com'],
            // origin: '*',
            // origin: 'https://godtribe-8f80d.web.app',
            methods: ['GET', 'POST'],
            // credentials: true,
        },
        pingInterval: 10000,
        pingTimeout: 30000,
    });

    io.on('connection', (socket) => {
        socket.emit('connection');

        socket.on('join-campfire', (data) => {
            socket.join(data.campfireId);
            if (data.isAdmin) {
                admins.push(data);
            } else {
                audiences.push(data);
            }
            rooms.push(data.campfireId);
            io.sockets.emit('broadcast', {
                audiences,
                admins, 
            });
        });

        socket.on('join-campfire-group', async (data) => {
            try {
                socket.join(data.campfireId);
                io.to(data.campfireId).emit('receive-join-campfire-group', data);
                // if (data.isOwned) {
                //     const ownedCampfireStatus = await updateCampfireHandler(
                //         data.campfireId,
                //         {
                //             'creator.isActive': true,
                //             'creator.peerId': data.peerId,
                //             'creator.socketId': socket.id,
                //         }   
                //     );
                //     console.log(ownedCampfireStatus, 'ownedcampfirestatus');
                // } else {
                //     const updatedData = await updateMember(
                //         data.campfireId,
                //         data.userId,
                //         {
                //             'members.$.isActive': true,
                //             'members.$.peerId': data.peerId,
                //             'members.$.socketId': socket.id,
                //         }   
                //     );
                //     console.log(updatedData, 'updatedData');
                // }

                

                // const campfires = await Campfire.findOne(
                //     {
                //         _id: data.campfireId,
                //         createdAt: { 
                //             $lt: new Date(), 
                //             $gte: new Date(new Date().setDate(new Date().getDate()-1))
                //         },
                //     },
                //     { '_id': 1, members: 1, creator: 1 }
                // );

                if (data.isAdmin) {
                    const isExist = admins.find(item => item.campfireId === data.campfireId && item.userId === data.userId);
                    if (!isExist) {
                        admins.push(data);
                    }
                } else {
                    const isExist = audiences.find(item => item.campfireId === data.campfireId && item.userId === data.userId);
                    if (!isExist) {
                        audiences.push(data);
                    }
                }

                const filterAudiences = audiences.filter(item => item.userId !== data.userId && item.campfireId === data.campfireId);
                const filterAdmins = admins.filter(item => item.userId !== data.userId && item.campfireId === data.campfireId);

                io.to(data.campfireId).emit('broadcast-join', {
                    audiences: filterAudiences,
                    admins: filterAdmins,
                    newUid: data.userId,
                });

                // if (campfires) {
                //     const { creator, members, _id } = campfires;
                //     const creatorArr = [{
                //         userId: creator.uid,
                //         profileUrl: creator.profileUrl,
                //         name: creator.name,
                //         campfireId: data.campfireId,
                //         isActive: creator.isActive,
                //         peerId: creator.peerId,
                //         socketId: creator.socketId, 
                //     }];

                //     const membersArr = members.filter(res => res.isActive).map(val => {
                //         return {
                //             userId: val.uid,
                //             profileUrl: val.profileUrl,
                //             name: val.name,
                //             campfireId: val.campfire,
                //             isActive: val.isActive,
                //             peerId: val.peerId,
                //             socketId: val.socketId, 
                //         };
                //     });

                //     const filteredAdmin = admins.filter(val => val.campfireId === data.campfireId);
                //     const filteredAudience = audiences.filter(val => val.campfireId === data.campfireId);
                //     const filteredRemAdmin = admins.filter(val => val.campfireId !== data.campfireId);
                //     const filteredRemAudience = audiences.filter(val => val.campfireId !== data.campfireId);

                //     const arrObjectAdmin = Map(arrayToObject(filteredAdmin, 'userId'));
                //     const arrObjectAudience = Map(arrayToObject(filteredAudience, 'userId'));
                //     const arrObjectMembersArr = Map(arrayToObject(membersArr, 'userId'));
                //     const arrObjectCreatorArr = Map(arrayToObject(creatorArr, 'userId'));

                //     const newAdminList = arrObjectAdmin.mergeDeep(arrObjectCreatorArr);
                //     const newAudienceList = arrObjectAudience.mergeDeep(arrObjectMembersArr);

                //     admins = [
                //         ...filteredRemAdmin,
                //         ...Object.values(newAdminList.toJS()),
                //     ];
                //     audiences = [
                //         ...filteredRemAudience,
                //         ...Object.values(newAudienceList.toJS()),
                //     ];
                
                // }
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('disconnect', async (data) => {
            
        });

        socket.on('raise-hand', (data) => {
            audiences = audiences.map(item => {
                return item.campfireId === data.campfireId && item.userId === data.userId ? {
                    ...item,
                    isRaising: data.raise,
                } : item
            });
            io.to(data.campfireId).emit('raised-hand', {
                userId: data.userId,
                campfireId: data.campfireId,
                raise: data.raise,
            });
        })

        socket.on('set-user', (data) => {
            const { 
                userId,
                campfireId,
                key,
                speaker,
                moderator,
                menuKey,
            } = data;

            if (speaker || moderator) {
                const audience = audiences.find(
                    (val) => val.userId === userId && val.campfireId === campfireId,
                );

                if (audience) {
                    admins = [
                        ...admins,
                        {
                            ...audience,
                            ...key,
                            isRaising: false,
                        },
                    ];
                } else {
                    admins = admins.map((val) =>
                        val.userId === userId && val.campfireId === campfireId
                            ? {
                                ...val,
                                ...key,
                                isRaising: false,
                            } : val,
                        );
                }

                audiences = audiences.filter(
                    (val) => val.userId !== data.userId && val.campfireId === data.campfireId,
                );

            } else if (menuKey === 'removeSpeaker') {
                const admin = admins.find(
                    (val) => val.userId === userId && val.campfireId === campfireId,
                );
                if (admin) {
                    audiences = [
                        audiences,
                        {
                            ...admin,
                            ...key,
                            micEnabled: true,
                        },
                    ];
                }
                admins = admins.filter(
                    (val) => val.userId !== userId && val.campfireId === campfireId,
                );
            }
            io.to(data.campfireId).emit('received-set-user', {
                userId,
                campfireId,
                key,
                speaker,
                moderator,
                menuKey,
            });
        })

        socket.on('set-user-emoji', (data) => {
            const { userId, campfireId, key, isAudience } = data;
            io.to(campfireId).emit('received-set-user-emoji', {
                userId,
                campfireId,
                key,
                isAudience,
            });
        });

        socket.on('mute-all', (data) => {
            admins = admins.map((val) =>
                val.campfireId === data.campfireId
                    ? {
                        ...val,
                        isMuted: data.muted,
                    } : val,
            );
            audiences = audiences.map((val) => 
                val.campfireId === data.campfireId && val.micEnabled ? {
                    ...val,
                    isMuted: data.muted,
                } : val
            );
            io.to(data.campfireId).emit('mute-all-received', {
                campfireId: data.campfireId,
                muted: data.muted,
                userId: data.userId,
            });
        });

        socket.on('ended', (data) => {
            socket.leave(data.campfireId);
            audiences = audiences.filter(peer => peer.campfireId !== data.campfireId);
            admins = admins.filter(peer => peer.campfireId !== data.campfireId);
            io.to(data.campfireId).emit('campfire-ended', {
                campfireId: data.campfireId,
            });
        });

        socket.on('mute-user', (data) => {
            const audience = audiences.find(
                (val) => val.userId === data.userId && val.campfireId === data.campfireId,
            );

            if (audience) {
                audiences = audiences.map((val) => 
                val.userId === data.userId && val.campfireId === data.campfireId ? {
                        ...val,
                        isMuted: data.muted,
                        micEnabled: true,
                    } : val
                );
            } else {
                admins = admins.map((val) =>
                val.userId === data.userId && val.campfireId === data.campfireId
                        ? {
                            ...val,
                            isMuted: data.muted,
                        } : val,
                );
            }
            io.to(data.campfireId).emit('mute-received', {
                userId: data.userId,
                campfireId: data.campfireId,
                muted: data.muted,
            });
        });

        socket.on('leave', async (data) => {
            // try {
            //     const updatedData = await updateMember(
            //         data.campfireId,
            //         data.userId,
            //         { 
            //             'members.$.isActive': false,
            //             'members.$.peerId': '',
            //             'members.$.socketId': '',
            //         }   
            //     );
            //     const ownedcampfirestatus = await updateCampfireHandler(
            //         data.campfireId,
            //         {
            //             'creator.isActive': false,
            //             'creator.peerId': '',
            //             'creator.socketId': '',
            //         }   
            //     );
            //     console.log(updatedData, 'updatedData on leave');
            //     console.log(ownedcampfirestatus, 'ownedcampfirestatus on leave');
            // } catch (error) {
            //     console.log(error, 'error');
            // }
            socket.leave(data.campfireId);
            audiences = audiences.filter(peer => peer.userId !== data.userId);
            admins = admins.filter(peer => peer.userId !== data.userId);
            io.to(data.campfireId).emit('user-leave', {
                userId: data.userId,
            });
        });

        socket.on('send-latest-streams', (data) => {
            const filterAudiences = audiences.filter(item => item.campfireId === data.campfireId);
            const filterAdmins = admins.filter(item => item.campfireId === data.campfireId);
            io.to(data.socketId).emit('received-latest-streams', {
                audiences: filterAudiences,
                admins: filterAdmins,
                userId: data.userId,
            });
        });

        socket.on('send-kick-member', (data) => {
            audiences = audiences.filter(item => item.userId !== data.userId);
            admins = admins.filter(item => item.userId !== data.userId);
            io.to(data.campfireId).emit('received-kick-member', {
                userId: data.userId,
            });
        });

        socket.on('send-disable-mic', (data) => {
            if (data.allAudience) {
                audiences = audiences.map((val) => 
                    val.campfireId === data.campfireId ? {
                        ...val,
                        micEnabled: data.value,
                        isMuted: true,
                    } : val
                );
            } else {
                audiences = audiences.map((val) => 
                    val.userId === data.userId && val.campfireId === data.campfireId ? {
                        ...val,
                        micEnabled: data.value,
                        isMuted: true,
                    } : val
                );
            }
            
            io.to(data.campfireId).emit('received-disable-mic', {
                userId: data.userId,
                campfireId: data.campfireId,
                value: data.value,
                allAudience: data.allAudience,
            });
        })

        socket.on("disconnecting", async () => {
            console.log('disconnected');
            let user = null;
            const audience = audiences.find(item => item.socketId === socket.id);
            const admin = admins.find(item => item.socketId === socket.id);
            if (audience) {
                // await updateMember(
                //     audience.campfireId,
                //     audience.userId,
                //     {
                //         'members.$.isActive': false,
                //         'members.$.peerId': '',
                //         'members.$.socketId': '',
                //     }   
                // );
                user = audience;
            }
            if (admin) {
                // await updateCampfireHandler(
                //     admin.campfireId,
                //     {
                //         'creator.isActive': false,
                //         'creator.peerId': '',
                //         'creator.socketId': '',
                //     }   
                // );
                user = admin;
            }
            audiences = audiences.filter(peer => peer.socketId !== socket.id);
            admins = admins.filter(peer => peer.socketId !== socket.id);
            if (user) {
                try {
                    io.to(user.campfireId).emit('user-leave', {
                        userId: user.userId,
                    });
                } catch (error) {
                    console.log(error, 'error');
                }
            } 
        });


        socket.on('test-join', async (data, callback) => {
            try {
                const { userId, campfireId, peerId, isOwned } = data;
                socket.join(campfireId);
                let responseData = null;
                if (isOwned) {
                    const ownedCampfireStatus = await updateCampfireHandler(
                        campfireId,
                        {
                            'creator.isActive': true,
                            'creator.peerId': peerId,
                            'creator.socketId': socket.id,
                        }   
                    );
                    responseData = ownedCampfireStatus;
                    console.log(ownedCampfireStatus, 'ownedcampfirestatus');
                } else {
                    const updatedData = await updateMember(
                        campfireId,
                        userId,
                        {
                            'members.$.isActive': true,
                            'members.$.peerId': peerId,
                            'members.$.socketId': socket.id,
                        }   
                    );
                    responseData = updatedData;
                    console.log(updatedData, 'updatedData');
                }

                const campfires = await Campfire.findOne(
                    {
                        _id: campfireId,
                        createdAt: { 
                            $lt: new Date(), 
                            $gte: new Date(new Date().setDate(new Date().getDate()-1))
                        },
                        'members.isActive': true,
                    },
                    { '_id': 1, members: 1, creator: 1 }
                );

                console.log(campfires, 'campfires');
                if (campfires) {
                    const { creator, members, _id } = campfires;
                    const creatorArr = [{
                        userId: creator.uid,
                        profileUrl: creator.profileUrl,
                        name: creator.name,
                        campfireId: campfireId,
                        isActive: creator.isActive,
                        peerId: creator.peerId,
                        socketId: creator.socketId, 
                    }];

                    const membersArr = members.map(val => {
                        return {
                            userId: val.uid,
                            profileUrl: val.profileUrl,
                            name: val.name,
                            campfireId: val.campfire,
                            isActive: val.isActive,
                            peerId: val.peerId,
                            socketId: val.socketId, 
                        };
                    });
                    
                    const filteredAdmin = adminList.filter(val => val.campfireId === data.campfireId);
                    const filteredAudience = audienceList.filter(val => val.campfireId === data.campfireId);
                    const filteredRemAdmin = adminList.filter(val => val.campfireId !== data.campfireId);
                    const filteredRemAudience = audienceList.filter(val => val.campfireId !== data.campfireId);

                    const arrObjectAdmin = Map(arrayToObject(filteredAdmin, 'userId'));
                    const arrObjectAudience = Map(arrayToObject(filteredAudience, 'userId'));
                    const arrObjectMembersArr = Map(arrayToObject(membersArr, 'userId'));
                    const arrObjectCreatorArr = Map(arrayToObject(creatorArr, 'userId'));

                    const newAdminList = arrObjectAdmin.mergeDeep(arrObjectCreatorArr);
                    const newAudienceList = arrObjectAudience.mergeDeep(arrObjectMembersArr);

                    adminList = [
                        ...filteredRemAdmin,
                        ...Object.values(newAdminList.toJS()),
                    ];
                    audienceList = [
                        ...filteredRemAudience,
                        ...Object.values(newAudienceList.toJS()),
                    ];

                    console.log({
                        audiences: audienceList,
                        admins: adminList,
                    }, 'calback');

                    callback({
                        audiences: audienceList,
                        admins: adminList,
                    });
                }
            } catch (err) {
                console.log(err, 'error');
            }
        });
    });
}

export default socketInit;
