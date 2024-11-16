import express, { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { createMessageHandler, messagesByUserIdHandler, messagesHandler } from '.';
import { APP_TOKEN, HttpStatus } from '../util/constants';
import HttpError from '../util/http-error';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    const httpError = new HttpError('No token provided, access denied.', HttpStatus.BAD_REQUEST);
    return next(httpError);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    const httpError = new HttpError('Token missing, access denied.', HttpStatus.NOT_FOUND);
    return next(httpError);
  }

  if (token === APP_TOKEN) {
    next();
  } else {
    const httpError = new HttpError('Invalid token.', HttpStatus.VALIDATION_ERROR);
    return next(httpError);
  }
};

const messageRoutes = express.Router();

messageRoutes.post('/', [
  verifyToken,
  check('text').not().isEmpty().withMessage('Message text is required'),
], createMessageHandler);

messageRoutes.get('/', messagesHandler);

messageRoutes.get('/user/:uid', messagesByUserIdHandler);

export { messageRoutes };
