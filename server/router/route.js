import { Router } from "express";
const router = Router();

/* import all controllers */
import * as controller from "../controllers/appcontroller.js";
import { sendMail } from "../controllers/mailer.js";
import Auth, { localVariables } from "../middleware/auth.js";

/* GET requests */
router.route("/register").post(controller.register); // register
router.route("/sendmail").post(sendMail); // send mail
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.login); // login user

/* POST requests*/
router.route("/user/:username").get(controller.getUser); // get user
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); // verify OTP
router.route("/createResetSession").get(controller.createResetSession); // create reset session

/* PUT requests */
router.route("/updateuser").put(Auth, controller.updateUser); // update user
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); // reset password

export default router;
