import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const getTurnCredentials = async (req, res) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        const token = await client.tokens.create();
        res.status(200).json(token);
    } catch (error) {
        next(error);
    }
};

router.get('/turn-credentials', getTurnCredentials);

export default router;
