import express from "express"
import { check } from "express-validator"
import { loginHandler, registerHandler, usersHandler } from ".";

const userRoutes = express.Router();

userRoutes.get('/', usersHandler);

userRoutes.post('/login', loginHandler);

userRoutes.post('/register', [
  check('username').isLength({min: 3}),
  check('password').isLength({min: 6}),
], registerHandler);


export { userRoutes };
