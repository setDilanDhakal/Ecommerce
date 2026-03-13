import {Router} from 'express';
import {Register} from '../controller/user.js'

const userRoute = Router();

userRoute.route('/register').post(Register);



export default userRoute