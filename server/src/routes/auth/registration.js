// Require Dependencies
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const md5 = require("md5");
const config = require("../../config");
const {
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const bs58 = require("bs58");

const User = require("../../models/User");

// Additional variables
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BACKEND_URL = IS_PRODUCTION
  ? config.site.backend.productionUrl
  : config.site.backend.developmentUrl;
const FRONTEND_URL = IS_PRODUCTION
  ? config.site.frontend.productionUrl
  : config.site.frontend.developmentUrl;
const ADMINPANEL_URL = IS_PRODUCTION
  ? config.site.adminFrontend.productionUrl
  : config.site.adminFrontend.developmentUrl;

module.exports = addTokenToState => {
  router.post("/login", async (req, res, next) => {
    try {
      const encryptedPassword = encryptPassword(req.body.password);
      const conditions = {
        providerId: req.body.email,
        password: encryptedPassword,
      };
      const dbUser = await User.findOne(conditions);

      if (!dbUser)
        return res.json({
          success: false,
          error: `Email or password incorrect!`,
        });

      if (parseInt(dbUser.banExpires) > new Date().getTime())
        return res.json({ redirect: `${FRONTEND_URL}/banned` });

      // Create JWT Payload
      const payload = {
        user: {
          id: dbUser.id,
        },
      };

      // Sign and return the JWT token
      jwt.sign(
        payload,
        config.authentication.jwtSecret,
        { expiresIn: config.authentication.jwtExpirationTime },
        (error, token) => {
          if (error) throw error;

          // Generate a new identifier
          const identifier = uuid.v4();

          // Add token to state
          addTokenToState(identifier, token);

          // If this was from admin panel redirect to that
          const redirectBase =
            req.query.state === "adminpanel" ? ADMINPANEL_URL : FRONTEND_URL;
          const redirectUrl = `${redirectBase}/login?token=${identifier}`;

          return res.json({ redirect: redirectUrl });
        }
      );
    } catch (error) {
      console.log("Error while signing-in user:", error);
      return next(new Error("Internal Server Error, please try again later."));
    }
  });

  router.post("/register", async (req, res, next) => {
    try {
      // check if email is already in db
      const dbUser = await User.findOne({ providerId: req.body.email });
      if (dbUser)
        return res.json({ error: `This email address is already in use!` });

      // checks
      let username = req.body.username
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      if (username.length < 3 || username.length > 16)
        return res.json({
          error: "The username has to be between 3 and 16 characters!",
        });
      if (!validateEmail(req.body.email))
        return res.json({ error: `Invalid email address!` });
      if (req.body.password.length < 8)
        return res.json({
          error: "The password has to be at least 8 characters long!",
        });
      if (req.body.password.length > 30)
        return res.json({
          error: "The password is too long! Make it shorter.",
        });

      const avatars = [
        "https://i.imgur.com/1RLqyL2.png",
        "https://i.imgur.com/mFceWlZ.png",
        "https://i.imgur.com/2LtrvDX.png",
        "https://i.imgur.com/9bVz3a2.png",
        "https://i.imgur.com/m8QzMnZ.png",
      ];

      const random_avatar = avatars.sort(() => 0.5 - Math.random())[0];

      // const kp = Keypair.generate();

      let newUser = new User({
        provider: "user",
        providerId: req.body.email,
        username: req.body.username,
        password: encryptPassword(req.body.password),
        avatar: random_avatar,
        // solAddress: kp.publicKey.toString(),
        // solSecret: bs58.encode(kp.secretKey),
      });

      // Save the user
      await newUser.save();

      // Create JWT Payload
      const payload = {
        user: {
          id: newUser.id,
        },
      };

      // Sign and return the JWT token
      jwt.sign(
        payload,
        config.authentication.jwtSecret,
        { expiresIn: config.authentication.jwtExpirationTime },
        (error, token) => {
          if (error) throw error;

          // Generate a new identifier
          const identifier = uuid.v4();

          // Add token to state
          addTokenToState(identifier, token);

          // If this was from admin panel redirect to that
          const redirectBase =
            req.query.state === "adminpanel" ? ADMINPANEL_URL : FRONTEND_URL;
          const redirectUrl = `${redirectBase}/login?token=${identifier}`;

          return res.json({ redirect: redirectUrl });
        }
      );
    } catch (error) {
      console.log("Error while getting the redirect url:", error);
      return next(new Error("Internal Server Error, please try again later."));
    }
  });

  return router;
};

function encryptPassword(password) {
  return md5("BestAuthSystemv1.0-degencupsio-" + password);
}

const validateEmail = email => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
