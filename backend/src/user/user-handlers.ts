import uuid from 'uuid';
const myUUID = uuid.v4();
import HttpError from '../util/http-error';
import { validationResult } from "express-validator";
import { User } from '../user';
import { Request, Response, NextFunction } from "express";
import { APP_TOKEN, HttpStatus } from "../util/constants";


const usersHandler = async(req: Request, res: Response, next: NextFunction) => {
  let users;
  
  try{
    users = await User.find({}, '-password');
  } catch (error) {
    const err = new HttpError('Fetching users failed, please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    return next(err);
  }

  res.json({items: users.map( u => u.toObject({getters: true}) )})
};

const registerHandler = async(req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    const httpError = new HttpError('Invalid data input.', HttpStatus.VALIDATION_ERROR);
    return next(httpError);
  }

  const { username, password } = req.body;
  let existingUser;
  try{
    existingUser = await User.findOne({username}).exec();
  } catch (err) {
    const httpError = new HttpError('Could not find user with the given username.', HttpStatus.INTERNAL_SERVER_ERROR);
    return next(httpError);
  }

  if(existingUser) {
    const httpError = new HttpError('User with this username exists.', HttpStatus.VALIDATION_ERROR);
    return next(httpError);
  }

  const user = new User({
    username, 
    password,
    messages: []
  });

  try{
    await user.save();
  } catch (err) {
    console.log("Erer", err);
    const httpError = new HttpError('Signup up failed, please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    return next(httpError);
  }

  res.status(201).json({token: APP_TOKEN, user: user.toObject({getters: true})});
};

const loginHandler = async(req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  let identifiedUser;
  try{
    identifiedUser = await User.findOne({username}).exec();
  } catch (err) {
    const httpError = new HttpError('Could not find user with the given username.', HttpStatus.INTERNAL_SERVER_ERROR);
    return next(httpError);
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError('Invalid credentials', HttpStatus.VALIDATION_ERROR)
    return next(error);
  }

  res.json({token: APP_TOKEN, user: identifiedUser.toObject({getters: true})})
};

export {
  usersHandler,
  registerHandler,
  loginHandler
}
