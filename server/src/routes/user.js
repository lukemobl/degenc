// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const rateLimit = require("express-rate-limit");
const { check, validationResult } = require("express-validator");
const { validateJWT } = require("../middleware/auth");
const { getWithdrawState } = require("../controllers/site-settings");
const {
  sendVerficationTextMessage,
  verifyTextMessageCode,
} = require("../controllers/twilio");
const { checkInventoryForLoyaltyBadge } = require("../controllers/steam");
const config = require("../config");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const { checkMaintenance } = require("../middleware/maintenance");
const { verifyRecaptchaResponse } = require("../controllers/recaptcha");

const User = require("../models/User");
const Signature = require("../models/Signature");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const CryptoTransaction = require("../models/CryptoTransaction");
const WalletTransaction = require("../models/WalletTransaction");
const CupsGame = require("../models/CupsGame");
const CrashGame = require("../models/CrashGame");
const ShuffleGame = require("../models/ShuffleGame");
const KingGame = require("../models/KingGame");
const RouletteGame = require("../models/RouletteGame");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const bs58 = require("bs58");
const sanitize = require("mongo-sanitize");

const {
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const { parse } = require("querystring");

// Create request limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1, // limit each IP to 100 requests per windowMs
  message: {
    error: "You can do this only every 5 minutes. Please wait",
    stack: {},
  },
});

// Combine middleware
const middleware = [checkMaintenance, validateJWT];

// Calculate winner from random data
const getWinningColor = async winningMultiplier => {
  return new Promise((resolve, reject) => {
    if (winningMultiplier === 2) {
      resolve("blue");
    } else if (winningMultiplier === 3) {
      resolve("green");
    } else if (winningMultiplier === 5) {
      resolve("purple");
    } else if (winningMultiplier === 20) {
      resolve("yellow");
    } else if (winningMultiplier === 7) {
      resolve("7x");
    } else if (winningMultiplier === 0) {
      resolve("mystery");
    } else {
      reject(
        new Error("Couldn't calculate winner: Invalid multiplier amount!")
      );
    }
  });
};

/**
 * @route   GET /api/user/
 * @desc    Get authenticated user
 * @access  Private
 */
router.get("/", validateJWT, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select({
      crypto: 0,
      phoneVerificationCode: 0,
    });

    // Check that user exists
    if (!user) {
      console.error("User not found, maybe database did an oopsie?");
      return next(new Error("User not found, maybe database did an oopsie?"));
    }
    return res.json({
      user,
      token: req.authToken,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/user/history
 * @desc    Get authenticated user's games history
 * @access  Private
 */
router.get("/history", middleware, async (req, res, next) => {
  try {
    // Get user
    const user = await User.findOne({ _id: req.user.id });
    const query = { "players._id": user.id };

    // Get user shuffle games
    const shuffleQuery = { "_winner._id": user.id };
    const shuffleGames = await ShuffleGame.find(query).lean();
    const shuffleGamesWon = await ShuffleGame.find(shuffleQuery).lean();

    // Convert every document to a game object
    const gamesPlayed = [
      ...shuffleGames.map(g => ({
        ...g,
        gamemode: "shuffle",
        ownBetAmount: g.players.find(player => player._id === user.id)
          .betAmount,
      })),
    ];

    // Convert every document to a game object
    const gamesWon = [
      ...shuffleGamesWon.map(g => ({
        ...g,
        gamemode: "shuffle",
        ownBetAmount: g.players.reduce((a, b) => a.betAmount + b.betAmount, 0),
      })),
    ];

    return res.json(
      [
        ...gamesPlayed.map(game => ({ ...game, won: false })),
        ...gamesWon.map(game => ({ ...game, won: true })),
      ].sort((a, b) => b.created - a.created)
    );
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/user/profile
 * @desc    Get authenticated user's profile info
 * @access  Private
 */

router.get("/profile", middleware, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // Check that user exists
    if (!user) {
      console.error("User not found, maybe database did an oopsie?");
      return next(new Error("User not found, maybe database did an oopsie?"));
    }

    // Get user withdraws/deposits
    //const cryptoTransactions = await CryptoTransaction.//find({ _user: user.id });

    // Get wallet transactions
    const transactions = await WalletTransaction.find({
      _user: user.id,
    }).sort({ created: -1 });

    // Convert every document to a transaction object
    //const transactions = [
    // ...cryptoTransactions.map(trx => ({
    //    state: trx.state,
    //    created: trx.created,
    //    _id: trx._id,
    //    amount: trx.siteValue.toFixed(2),
    //    won: trx.type === "deposit",
    //    action: `${trx.currency} ${
    //trx.type.charAt(0).toUpperCase() + trx.type.//slice(1)
    //}`,
    //})),
    //];

    // Get user games
    const cupsGames = await CupsGame.find({ "players._id": user.id });
    const cupsGamesWon = await CupsGame.find({ _winner: user.id });
    const shuffleGames = await ShuffleGame.find({ "players._id": user.id });
    const shuffleGamesWon = await ShuffleGame.find({ "_winner._id": user.id });
    const kingGames = await KingGame.find({
      $or: [{ _creator: user.id }, { _opponent: user.id }],
    });
    const kingGamesWon = await KingGame.find({ _winner: user.id });
    const rouletteGames = await RouletteGame.find({
      "players._id": user.id,
    }).lean();

    const crashGames = await CrashGame.find({ _players: user.id });

    const rouletteGamesWon = rouletteGames.filter(
      game =>
        game.winner === "mystery" ||
        game.winner ===
          game.players.find(player => player._id === user.id).color
    );

    // Convert every document to a game object
    const gamesPlayed = [
      ...cupsGames,
      ...shuffleGames,
      ...kingGames,
      ...rouletteGames,
      ...crashGames,
    ];

    // Convert every document to a game object
    const gamesWon = [
      ...cupsGamesWon,
      ...shuffleGamesWon,
      ...kingGamesWon,
      ...rouletteGamesWon,
    ];

    return res.json({
      gamesPlayed: gamesPlayed.length,
      gamesWon: gamesWon.length,
      totalDeposited: user.totalDeposited.toFixed(2),
      totalWithdrawn: user.totalWithdrawn.toFixed(2),
      wager: user.wager.toFixed(2),
      hasVerifiedAccount: user.hasVerifiedAccount,
      transactions,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/user/affiliates
 * @desc    Get authenticated user's affiliate info
 * @access  Private
 */
router.get("/affiliates", middleware, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // Check that user exists
    if (!user) {
      console.error("User not found, maybe database did an oopsie?");
      return next(new Error("User not found, maybe database did an oopsie?"));
    }

    // Get user's affiliator
    const affiliator = await User.findOne({ _id: user._affiliatedBy });
    const affiliatedUsers = await User.find({
      _affiliatedBy: user.id,
    }).select({ username: 1, avatar: 1, wager: 1 });

    return res.json({
      affiliateCode: user.affiliateCode || "",
      affiliateLink: user.affiliateCode
        ? `${config.site.frontend.productionUrl}/a/${user.affiliateCode}`
        : "Set affiliate code first!",
      affiliateMoney: user.affiliateMoney,
      affiliateMoneyAvailable:
        user.affiliateMoney - user.affiliateMoneyCollected,
      affiliateMoneyCollected: user.affiliateMoneyCollected,
      usersAffiliated: affiliatedUsers.length,
      currentlySupporting: affiliator
        ? { code: affiliator.affiliateCode, username: affiliator.username }
        : null,
      affiliatedUsers,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/user/affiliates/update-code
 * @desc    Update user's affiliate code
 * @access  Private
 */
router.post(
  "/affiliates/update-code",
  [
    checkMaintenance,
    validateJWT,
    check("code", "New affiliate code is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid affiliate code type"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code } = req.body;
    try {
      // Remove any illegal characters
      const parsedCode = encodeURI(
        code
          .replace(/[^\w\s]/gi, "")
          .replace(/\s/g, "")
          .toLowerCase()
      );

      // If still not valid
      if (parsedCode.length < 3) {
        res.status(400);
        return next(
          new Error(
            "Your code must be atleast 3 characters long and musn't contain special characters!"
          )
        );
      }

      // Get existing user with that affiliate code
      const existingUser = await User.findOne({
        affiliateCode: parsedCode,
      });

      // If affiliate code is already in-use
      if (existingUser && existingUser.id !== req.user.id) {
        res.status(400);
        return next(new Error("This affiliate code is already in-use!"));
      }

      // Update user document
      await User.updateOne(
        { _id: req.user.id },
        { $set: { affiliateCode: parsedCode } }
      );

      return res.json({ newAffiliateCode: parsedCode });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @route   POST /api/user/affiliates/redeem
 * @desc    Redeem affiliate code and receive first time $0.10
 * @access  Private
 */
router.post(
  "/affiliates/redeem",
  [
    checkMaintenance,
    validateJWT,
    check("code", "Affiliate code is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid affiliate code type"),
  ],

  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code } = req.body;
    try {
      // Get user from db
      const user = await User.findOne({ _id: req.user.id });

      // If user is not found
      if (!user) {
        return next(
          new Error("Couldn't find user! Maybe database did an error?")
        );
      }

      // If user isn't verified   !user.hasVerifiedAccount
      //if (user.totalDeposited < 5) {
      //  res.status(400);
      //  return next(
      //    new Error(
      //      "You must deposit min. $5.00 before redeeming an affiliate code!"
      //    )
      //  );
      //}

      // Get existing user with that affiliate code
      const existingUser = await User.findOne({
        affiliateCode: code.toLowerCase(),
      });

      // If affiliate code isn't valid
      if (!existingUser) {
        res.status(400);
        return next(
          new Error(
            "This affiliate code doesn't belong to anyone! Please double-check your input"
          )
        );
      }

      // If user is trying to affiliate himself
      if (existingUser.id === user.id) {
        res.status(400);
        return next(new Error("You can't affiliate yourself :)"));
      }

      // If this is user's first time redeeming a code
      if (!user._affiliatedBy) {
        // Update user
        await User.updateOne(
          { _id: user.id },
          {
            $inc: { wallet: 0.1 },
            $set: {
              _affiliatedBy: existingUser.id,
              affiliateClaimed: new Date().toISOString(),
            },
          }
        );
        insertNewWalletTransaction(
          user.id,
          0.1,
          "First time affiliate redeem",
          { affiliatorId: existingUser.id }
        );

        return res.json({
          code,
          username: existingUser.username,
          freeMoneyClaimed: true,
        });
      } else {
        // Update user
        await User.updateOne(
          { _id: user.id },
          { $set: { _affiliatedBy: existingUser.id } }
        );

        return res.json({
          code,
          username: existingUser.username,
          freeMoneyClaimed: false,
        });
      }
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @route   POST /api/user/affiliates/claim
 * @desc    Claim user's affiliate earnings
 * @access  Private
 */
router.post("/affiliates/claim", middleware, async (req, res, next) => {
  try {
    // Get user from DB
    const user = await User.findOne({ _id: req.user.id });

    // If user doesn't exist
    if (!user) {
      res.status(400);
      return next(new Error("User not found! (database error)"));
    }

    // User affiliate revenue
    const affiliateRevenue = user.affiliateMoney - user.affiliateMoneyCollected;

    // Check if user has enough revenue to collect it
    if (affiliateRevenue < 1) {
      res.status(400);
      return next(
        new Error("You must have collected atleast $1.00 before claiming it!")
      );
    }

    // Update user document
    await User.updateOne(
      { _id: user.id },
      {
        $inc: {
          wallet: Math.abs(affiliateRevenue),
          affiliateMoneyCollected: Math.abs(affiliateRevenue),
        },
      }
    );
    insertNewWalletTransaction(
      user.id,
      Math.abs(affiliateRevenue),
      "Affiliate revenue claim"
    );

    return res.json({ claimedAmount: parseFloat(affiliateRevenue.toFixed(2)) });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/user/verify
 * @desc    Return data required to verify user's account
 * @access  Private
 */
router.get("/verify", middleware, async (req, res, next) => {
  try {
    // Get user from DB
    const user = await User.findOne({ _id: req.user.id });

    // If user doesn't exist
    if (!user) {
      res.status(400);
      return next(new Error("User not found! (database error)"));
    }

    return res.json({
      hasVerifiedAccount: user.hasVerifiedAccount,
      verifiedPhoneNumber: user.verifiedPhoneNumber,
      verificationType: "textmessage",
      // user.provider === "steam" ? "loyaltybadge" : "textmessage",
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/user/verify/check
 * @desc    Check Steam user's inventory for Loyalty Badge
 * @access  Private
 */
router.post(
  "/verify/check",
  [checkMaintenance, validateJWT, limiter],
  async (req, res, next) => {
    res.status(400);
    return next(
      new Error(
        "We have removed this verification method, please use the SMS verification instead!"
      )
    );
    try {
      const user = await User.findOne({ _id: req.user.id });

      // If user doesn't exist
      if (!user) {
        res.status(400);
        return next(new Error("User not found! (database error)"));
      }

      // Check that user has registered with Steam
      if (user.hasVerifiedAccount || user.provider !== "steam") {
        res.status(400);
        return next(new Error("You can't verify using this method!"));
      }

      // Check if user has loyalty badge
      const hasBadge = await checkInventoryForLoyaltyBadge(user.providerId);

      // If user doesn't have the badge
      if (!hasBadge) {
        res.status(400);
        return next(
          new Error(
            "Couldn't find the Loyalty Badge in your CS:GO inventory. Unfortunately you cannot verify your account at the moment."
          )
        );
      }

      // Update user
      await User.updateOne(
        { _id: user.id },
        {
          $set: {
            hasVerifiedAccount: true,
            accountVerified: new Date().toISOString(),
          },
        }
      );

      return res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @route   POST /api/user/verify/send
 * @desc    Send an SMS verification code to user's phone number
 * @access  Private
 */
router.post(
  "/verify/send",
  [
    checkMaintenance,
    validateJWT,
    check("number", "Phone number is required")
      .notEmpty()
      .bail()
      .isString()
      .withMessage("Invalid phone number type")
      .bail(),
    // .isMobilePhone("any", { strictMode: true })
    // .withMessage("Please enter a valid phone number"),
    check("recaptchaResponse", "Please check the ReCAPTCHA field").notEmpty(),
    limiter,
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { number, recaptchaResponse } = req.body;
    try {
      // Verify reCaptcha response
      const valid = await verifyRecaptchaResponse(recaptchaResponse);

      // If captcha wasn't valid
      if (!valid) {
        res.status(400);
        return next(
          new Error("Invalid ReCAPTCHA response, please try again later!")
        );
      }

      const user = await User.findOne({ _id: req.user.id });

      // If user doesn't exist
      if (!user) {
        res.status(400);
        return next(new Error("User not found! (database error)"));
      }

      // // If user has registered with steam
      // if (user.provider === "steam") {
      //   res.status(400);
      //   return next(
      //     new Error(
      //       "You can't use this verification method because you registered with Steam!"
      //     )
      //   );
      // }

      // Get account registered with this number
      const registeredUser = await User.findOne({
        verifiedPhoneNumber: number,
      });

      // If number is registered to another user
      if (registeredUser && registeredUser.id !== user.id) {
        res.status(400);
        return next(
          new Error(
            "This phone number has been used to register another user, please use a different phone number."
          )
        );
      }

      // Try to send the message
      await sendVerficationTextMessage(number);

      // Update user
      await User.updateOne(
        { _id: user.id },
        { $set: { verifiedPhoneNumber: number } }
      );

      return res.json({ mobileNumber: number });
    } catch (error) {
      console.log(
        "Error while sending verification code:",
        error.message,
        error.code,
        error.moreInfo
      );

      // Check if this was valid twilio error
      if (error.code && error.moreInfo) {
        // Filter common statuses
        if (error.code === 20003) {
          return next(
            new Error(
              "We are currently unavailable to send your verification code, please contact admins with this error code: 20003"
            )
          );
        } else {
          return next(
            new Error(
              "Couldn't send your verification code! Error: " + error.code
            )
          );
        }
      } else {
        return next(error);
      }
    }
  }
);

/**
 * @route   POST /api/user/verify/submit
 * @desc    Check verification code to verify user
 * @access  Private
 */
router.post(
  "/verify/submit",
  [
    checkMaintenance,
    validateJWT,
    check("code", "Verification code is required")
      .notEmpty()
      .bail()
      .isString()
      .withMessage("Invalid verification code type")
      .bail()
      .isLength({ min: 6, max: 6 })
      .withMessage("Invalid verification code!"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code } = req.body;
    try {
      const user = await User.findOne({ _id: req.user.id });

      // If user doesn't exist
      if (!user) {
        res.status(400);
        return next(new Error("User not found! (database error)"));
      }

      // Check that user hasn't registered with Steam
      if (user.hasVerifiedAccount /* || user.provider === "steam" */) {
        res.status(400);
        return next(new Error("You can't verify using this method!"));
      }

      // Check if code is valid
      const verification = await verifyTextMessageCode(
        user.verifiedPhoneNumber,
        code
      );

      // Update user
      await User.updateOne(
        { _id: user.id },
        {
          $set: {
            hasVerifiedAccount: true,
            accountVerified: new Date().toISOString(),
          },
        }
      );

      return res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @route   POST /api/user/deposit
 * @desc    Check verification code to verify user
 * @access  Private
 */
router.post(
  "/deposit",
  [
    checkMaintenance,
    validateJWT,
    // check("code", "Verification code is required").notEmpty().bail().isString(),
  ],

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      // Check for validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, signature, blockhash } = sanitize(req.body.data);

      // Get current sol price from Bianance
      const currentPrice = await axios
        .get("https://api.binance.us/api/v3/ticker/price?symbol=SOLUSDT")
        .then(res => {
          return parseFloat(res.data.price).toFixed(2);
        })
        .catch(e => {
          console.log(e);
        });

      if (!currentPrice) return;

      const user = await User.findOne({ _id: req.user.id });

      if (!user) {
        res.status(400);
        return next(new Error("User not found! (database error)"));
      }

      const isInvalidSignature = await Signature.findOne({
        signature: signature,
      });

      if (isInvalidSignature) {
        console.log("Bad Signature");
        return res.json({ success: false });
      }

      let addSig = await new Signature({
        signature: signature,
        createdAt: Date.now(),
        uuid: uuidv4(),
      });

      await addSig.save();

      if (!amount || amount <= 0 || isNaN(amount))
        return res.json({ success: false });

      // Determine amount to add to balance
      const depositAmount = parseFloat(currentPrice * amount).toFixed(2);

      console.log(depositAmount);

      const connection = new Connection(process.env.SOLANA_NODE_URL);

      let finalized = false;
      let attempts = 0;
      let signatures = await connection.getSignatureStatus(signature);

      let getSigs = setInterval(async () => {
        try {
          attempts++;

          // Sanity check
          if (attempts > 100) {
            console.log("max attempts reached");

            return clearInterval(getSigs);
          }

          // break loop if all params are met
          if (finalized) {
            console.log("TX finalized terminating process.");

            return clearInterval(getSigs);
          }

          // Update the signature status on each loop
          signatures = await connection.getSignatureStatus(signature);

          // Send confirmation count to client, 31 to confirm
          if (signatures && signatures.value) {
            let confirmations = signatures.value.confirmations;

            // console.log(confirmations);

            if (confirmations) {
              console.log(confirmations);
            }
          }

          // Check if signature is finalized
          if (
            signatures.value &&
            signatures.value.confirmationStatus === "finalized"
          ) {
            finalized = true;

            let isValid = await connection.getParsedConfirmedTransaction(
              signature
            );

            let hasPaid;

            // Check if the user has sent the correct amount in the transaction
            try {
              hasPaid =
                isValid.meta.preBalances[0] - isValid.meta.postBalances[0];
            } catch (e) {
              console.log(e);
              finalized = false;
              return;
            }

            isNaN(hasPaid) ? (finalized = false) : (finalized = true);

            let correctAmount = amount * LAMPORTS_PER_SOL;

            if (hasPaid < correctAmount) {
              console.log("wrong price");
              clearInterval(getSigs);
              return res.json({ success: false });
            }

            // Check if the sender wallet === to user's wallet in DB
            let userWallet =
              isValid.transaction.message.accountKeys[0].pubkey.toString();

            if (!userWallet) return;

            // Check if the recipient wallet === to user's saved keypair in DB
            let properAccount =
              isValid.transaction.message.accountKeys[1].pubkey.toString();

            console.log(properAccount);

            if (!properAccount) return;

            if (!properAccount.toString() === process.env.SOL_DEPOSIT_ADDRESS)
              return clearInterval(getSigs);

            // save deposit to database
            const deposit = new Deposit({
              user: user.username,
              recipient: properAccount,
              amount: hasPaid / LAMPORTS_PER_SOL,
              signature: signature,
              complete: true,
              createdAt: Date.now(),
              uuid: uuidv4(),
            });

            await deposit.save();

            // Update the users balance in the Database
            user.wallet += (hasPaid / LAMPORTS_PER_SOL) * currentPrice;
            await user.save();

            console.log("Deposit Success");
            clearInterval(getSigs);

            const cryptoTx = new CryptoTransaction({
              type: "deposit",
              currency: "SOL",
              siteValue: (hasPaid / LAMPORTS_PER_SOL) * currentPrice,
              cryptoValue: hasPaid / LAMPORTS_PER_SOL,
              address: userWallet,
              txid: signature,
              state: 3,
              created: Date.now(),
              user: user,
            });

            await cryptoTx.save();

            return res.json({
              success: true,
              amount: (hasPaid / LAMPORTS_PER_SOL) * currentPrice,
            });
          } else if (
            signatures.value &&
            signatures.value.confirmationStatus === "failed"
          ) {
            console.log("failed tx");

            clearInterval(getSigs);
          }
        } catch (e) {
          clearInterval(getSigs);
          console.log(e);
          clearInterval(getSigs);
        }
      }, 5000);
    } catch (e) {
      clearInterval(getSigs);
      console.log(e);
      return next(e);
    }
  }
);

/**
 * @route   POST /api/user/withdraw
 * @access  Private
 */
router.post(
  "/withdraw",
  [
    checkMaintenance,
    validateJWT,
    // check("code", "Verification code is required").notEmpty().bail().isString(),
  ],

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      // Check for validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!getWithdrawState()) {
        return res.json({
          success: false,
          message: "Withdrawals are currently disabled.",
        });
      }

      const { amount, address } = sanitize(req.body.data);

      const user = await User.findOne({ _id: req.user.id });

      if (!user) {
        res.status(400);
        return res.json({
          success: false,
          message: "User not found.",
        });
      }

      if (user.wallet < amount) {
        console.log("Balance too low");
        return res.json({ success: false, message: "Balance too low." });
      }

      // Get current sol price from Bianance
      const currentPrice = await axios
        .get("https://api.binance.us/api/v3/ticker/price?symbol=SOLUSDT")
        .then(res => {
          return parseFloat(res.data.price).toFixed(2);
        })
        .catch(e => {
          console.log(e);
        });

      if (!currentPrice)
        return res.json({
          success: false,
          message: "Couldn't fetch current market price.",
        });

      if (!amount || amount <= 0 || isNaN(amount))
        return res.json({
          success: fals,
          message: "Invalid amount",
        });

      let convertedToSol = parseFloat(amount).toFixed(2) / currentPrice;

      convertedToSol = Math.round(convertedToSol * LAMPORTS_PER_SOL);

      user.wallet = user.wallet - amount;
      await user.save();

      const withdraw = new Withdrawal({
        user: user.username,
        recipient: address.toString(),
        amount: amount,
        signature: "incomplete",
        complete: false,
        createdAt: Date.now(),
        uuid: uuidv4(),
      });

      await withdraw.save();

      // Send SOL to users wallet
      const connection = await new Connection(process.env.SOLANA_NODE_URL);

      const from = Keypair.fromSecretKey(
        bs58.decode(process.env.SOL_SECRET_KEY)
      );

      const to = new PublicKey(address.toString());

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: convertedToSol,
        })
      );

      let { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign transaction, broadcast, and confirm
      const tx = await sendAndConfirmTransaction(connection, transaction, [
        from,
      ]);

      if (!tx) {
        return res.json({
          success: false,
          message: `Withdrawal failed, please try again later.`,
        });
      }

      const cryptoTx = new CryptoTransaction({
        type: "withdraw",
        currency: "SOL",
        siteValue: amount,
        cryptoValue: convertedToSol / LAMPORTS_PER_SOL,
        address: address,
        txid: tx,
        state: 3,
        created: Date.now(),
        user: user,
      });

      await cryptoTx.save();

      withdraw.complete = true;
      withdraw.signature = tx;

      await withdraw.save();

      return res.json({
        success: true,
        message: `Succesfully withdrew ${
          convertedToSol / LAMPORTS_PER_SOL
        } Sol`,
        amount,
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
);
