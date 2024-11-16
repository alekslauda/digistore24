import HttpError from '../util/http-error';
import uuid from 'uuid';
const myUUID = uuid.v4();
import { validationResult } from "express-validator";
import { Message } from './message-model';
import { User } from '../user';
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { HttpStatus } from "../util/constants";


const createMessageHandler = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const httpError = new HttpError('Invalid data input.', HttpStatus.VALIDATION_ERROR);
    return next(httpError);
  }

  const { text, creator } = req.body;
  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating message failed, please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', HttpStatus.NOT_FOUND);
    return next(error);
  }

  const createMessage = new Message({
    message: text,
    creator
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const savedMessage = await createMessage.save({ session: sess });
    user.messages.push(savedMessage._id as mongoose.Types.ObjectId);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating message failed, please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    return next(error);
  }

  res.status(201).json({ message: createMessage.toObject({ getters: true }) });
};

const messagesByUserIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.uid;
  let messages;
  try {
    messages = await Message.find({ creator: userId }).exec();
  } catch (error) {
    const httpError = new HttpError('Something went wrong. Could not find any messages', HttpStatus.INTERNAL_SERVER_ERROR);
    return next(httpError);
  }

  if (!messages || messages.length === 0) {
    const httpError = new HttpError('Could not find a message for the provided user id.', HttpStatus.NOT_FOUND);
    return next(httpError);
  }

  res.json({ items: messages.map(m => m.toObject({ getters: true })) });
};


const messagesHandler = async (req: Request, res: Response, next: NextFunction) => {
  let messages;
  
  try {
    messages = await Message.find({}).exec();
  } catch (error) {
    const err = new HttpError('Fetching messages failed, please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    return next(err);
  }

  res.json({ items: messages.map(m => m.toObject({ getters: true })) });
}

export {
  createMessageHandler,
  messagesByUserIdHandler,
  messagesHandler
}
