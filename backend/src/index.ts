import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { userRoutes } from './user';
import { messageRoutes } from './message';
import HttpError from './util/http-error';
import mongoose from 'mongoose';
import { MONGO_URL } from './util/constants';

// const PORT = 3000; this should be uncommented when sending the assignment
const PORT = 4141;

const app = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
})
app.use(bodyParser.json());
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);


app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
})

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({message: error.message || 'Unknown error occurred!'});
})


mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connection established!");
    console.log(`App listen on PORT: ${PORT}!`);
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  })
