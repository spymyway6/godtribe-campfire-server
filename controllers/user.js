import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { cipherText } from '../middleware/crypto.js';

import { randomInt } from '../helper/index.js'

export const fetchRandomUser = async (req, res, next) => {
    try {
        const user = await User.findOne(
            {
                id: randomInt(81, 85),
            }
        );
        if (user === null) throw new Error('User does not exist!');
        res.status(200).json(user);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

export const addUsers = async (req, res, next) => {
    try {
        const users = await User.insertMany([
            {
                id: "81",
                name: "Jane Doe",
                profileUrl: "https://picsum.photos/id/500/200",
                email: "jane@test.com",
            },
            {
                id: "82",
                name: "Deeb deeb",
                profileUrl: "https://picsum.photos/id/123/200",
                email: "deeb@deeb.com",
            },
            {
                id: "83",
                name: "Abel",
                profileUrl: "https://picsum.photos/id/321/200",
                email: "abel@test.com",
            },
            {
                id: "84",
                name: "Cain",
                profileUrl: "https://picsum.photos/id/12/200",
                email: "cain@test.com",
            },
            {
                id: "85",
                name: "Koro",
                profileUrl: "https://picsum.photos/id/45/200",
                email: "koro@test.com",
            },
        ]);
        res.status(201).json(users);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

export const encryptUser = async (req, res, next) => {
    try {
        const { campfireId, name, profileUrl, uid } = req.body;
        if (!campfireId || !name || !profileUrl || !uid) throw new Error('Some fields are missing!'); 
        const cipheredVal = cipherText({ campfireId, name, profileUrl, uid});
        res.status(200).json({ data: cipheredVal });
    } catch (error) {
        next(error);
    }
};
