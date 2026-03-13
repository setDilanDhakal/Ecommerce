import {Router} from 'express';
import {Register} from '../controller/user.js'
import { upload } from '../middlewares/multer.js'

const userRoute = Router();

userRoute.route('/register').post(upload.single('image'), Register);



export default userRoute
