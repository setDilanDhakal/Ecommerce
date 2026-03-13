import {Router} from 'express';
import {Register,Login,getUser,updateUser,deleteUser} from '../controller/user.js'
import { upload } from '../middlewares/multer.js'

const userRoute = Router();

userRoute.route('/register').post(upload.single('image'), Register);
userRoute.route('/login').post(Login);
userRoute.route('/:id').get(getUser);
userRoute.route('/:id').put(upload.single('image'), updateUser);
userRoute.route('/:id').delete(deleteUser);




export default userRoute

