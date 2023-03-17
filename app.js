
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import campfireRoutes from './routes/campfire.js';
import memberRoutes from './routes/member.js';
import userRoute from './routes/user.js';
import baseRoute from './routes/base.js';
import turnCredentialRoute from './routes/turnCredentials.js';
import { errorHandler } from './controllers/error.js';
import './dbConn.js';

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'https://campfire.godtribe.com', 'http://staging.godtribe.com'];

const corsOptions = {
	origin: allowedOrigins,
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
	// credentials: true,
};

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: false }));
app.use(cors(corsOptions));

app.use('/api', baseRoute);
app.use('/api', campfireRoutes);
app.use('/api', memberRoutes);
app.use('/api', userRoute);
app.use('/api', turnCredentialRoute);


app.use((req, res, next) => {
	const error = new Error('Not Found!');
	error.status = 404;
	next(error);
});

app.use(errorHandler);

export default app;
