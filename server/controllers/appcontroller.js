import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // check the existing user
    const existUsername = await UserModel.findOne({ username });
    if (existUsername) {
      return res.status(400).send({ error: "Please use unique username" });
    }

    // check for existing email
    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ error: "Please use unique Email" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username,
        password: hashedPassword,
        profile: profile || "",
        email,
      });

      // return save result as a response
      const result = await user.save();
      return res.status(201).send({ msg: "User Register Successfully" });
    } else {
      return res.status(400).send({ error: "Password is required" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username or password wrong" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send({ error: "Username or password wrong" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res
      .status(200)
      .send({ msg: "Login successful", token, username: user.username });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username)
      return res.status(400).send({ error: "Invalid username provided" });

    const user = await UserModel.findOne({ username });

    if (!user) return res.status(404).send({ error: "User not found" });

    const { password, ...rest } = Object.assign({}, user.toJSON());

    return res.status(200).send(rest);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  try {
    // const id = req.query.id;

    const { userId } = req.user;

    if (userId) {
      const body = req.body;

      UserModel.updateOne({ _id: userId }, body);

      return res.status(201).send({ msg: "User updated Successfuly" });
    } else {
      return res.status(401).send({ error: "User not Found" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req, res) {
  const { code } = req.query;

  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "Verify Successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "access granted!" });
  }
  return res.status(400).send({ error: "Session expired!" });
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(404).send({ error: "Session expired!" });

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    return res.status(200).send({ msg: "Reset password successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}
