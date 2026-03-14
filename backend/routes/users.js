import {Router} from 'express';
import {Register,Login,getUser,updateUser,deleteUser,updatePassword} from '../controller/user.js'
import {verify} from '../middlewares/auth.js'
import { upload } from '../middlewares/multer.js'

const userRoute = Router();

userRoute.route('/register').post(upload.single('image'), Register);
userRoute.route('/login').post(Login);
userRoute.route('/:id').get(verify, getUser);
userRoute.route('/:id').put(verify, upload.single('image'), updateUser);
userRoute.route('/:id').delete(verify, deleteUser);
userRoute.route('/update/:id').patch(verify, updatePassword);




export default userRoute;

