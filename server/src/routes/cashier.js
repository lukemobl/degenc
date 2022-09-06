// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const {
  createDepositAddress,
  createWithdrawTransaction,
  getWalletAccounts,
} = require("../controllers/coinbase");
const QRCode = require("qrcode");
const colors = require("colors");
const config = require("../config");
const { validateJWT } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const {
  getDepositState,
  getWithdrawState,
} = require("../controllers/site-settings");
const addressValidator = require("wallet-address-validator");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");

const User = require("../models/User");
const CryptoTransaction = require("../models/CryptoTransaction");

// // FIXME: Only for beta
// router.use((req, res, next) => {
//   res.status(400);
//   return next(new Error("Cashier is disabled during beta testing!"));
// });

// List all the accounts when server is started
try {
  // listAccountInfo();
} catch (error) {
  console.log(
    colors.grey("Coinbase >> Couldn't list account info:"),
    colors.red(error.message)
  );
}

// Function to generate QRCode data URL
async function generateCryptoQr(address) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(address, (error, url) => {
      // If there was an error while creating QR
      if (error) {
        reject(error);
      } else {
        resolve(url);
      }
    });
  });
}

// Function to list all the accounts
async function listAccountInfo() {
  const wallets = config.authentication.coinbase.wallets;
  const accountIds = Object.keys(wallets).map(key => wallets[key]);
  const accounts = await getWalletAccounts();
  const usedAccounts = accounts.filter(account =>
    accountIds.includes(account.id)
  );

  usedAccounts.forEach(account =>
    console.log(
      colors.grey("Coinbase >> Loaded account"),
      colors.blue(account.name) + colors.grey(","),
      colors.grey("balance:"),
      colors.blue(`${account.balance.amount} ${account.balance.currency}`)
    )
  );
}

/**
 * @route   GET /api/cashier/crypto/addresses
 * @desc    Get crypto addresses for all currencies
 * @access  Private
 */

router.get("/crypto/addresses", validateJWT, async (req, res, next) => {
  try {
    // Check if deposits are enabled
    const isEnabled = getDepositState();

    // If deposits are not enabled
    if (!isEnabled) {
      res.status(400);
      return next(
        new Error(
          "Deposits are currently disabled! Contact admins for more information"
        )
      );
    }

    const user = await User.findOne({ _id: req.user.id }).lean();

    // If user was not found
    if (!user) {
      return next(new Error("User not found! (database error)"));
    }

    // Check if user has created addresses
    if (user.crypto) {
      return res.json(user.crypto);
    }

    // Generate deposit address for all currencies
    const btc = await createDepositAddress("btc", user.id);
    const eth = await createDepositAddress("eth", user.id);
    const ltc = await createDepositAddress("ltc", user.id);

    // Construct channels object
    const addresses = {
      btc: {
        coinbaseId: btc.id,
        address: btc.address,
        dataUrl: await generateCryptoQr(btc.deposit_uri),
      },
      eth: {
        coinbaseId: eth.id,
        address: eth.address,
        dataUrl: await generateCryptoQr(eth.deposit_uri),
      },
      ltc: {
        coinbaseId: ltc.id,
        address: ltc.address,
        dataUrl: await generateCryptoQr(ltc.deposit_uri),
      },
    };

    // Update user
    await User.updateOne({ _id: req.user.id }, { $set: { crypto: addresses } });

    return res.json(addresses);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/cashier/crypto/withdraw
 * @desc    Withdraw a currency
 * @access  Private
 */
router.post(
  "/crypto/withdraw",
  [
    validateJWT,
    check("currency", "Withdraw currency is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid Withdraw currency type")
      .isIn(["BTC", "ETH", "LTC"])
      .withMessage("Invalid currency!"),
    check("address", "Withdraw address is required")
      .notEmpty()
      .isString()
      .withMessage("Invalid Withdraw address type"),
    check("amount", "Withdraw amount is required")
      .notEmpty()
      .isFloat()
      .withMessage("Invalid Withdraw amount!")
      .toFloat(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currency, address, amount } = req.body;
    try {
      // Check if deposits are enabled
      const isEnabled = getWithdrawState();

      // If deposits are not enabled
      if (!isEnabled) {
        res.status(400);
        return next(
          new Error(
            "Withdraws are currently disabled! Contact admins for more information"
          )
        );
      }

      // Check that amount exceeds $5.00
      if (amount < 5) {
        res.status(400);
        return next(new Error("Minimum withdraw amount must be atleast $5.00"));
      }

      // Validate wallet address
      const isValid = addressValidator.validate(address, currency, "prod");

      // If address is not valid
      if (!isValid) {
        res.status(400);
        return next(new Error("Please enter a valid wallet address!"));
      }

      // Get the latest user obj
      const user = await User.findOne({ _id: req.user.id });

      // Check that user is allowed to withdraw
      if (user.transactionsLocked) {
        res.status(403);
        return next(
          new Error(
            "Your account has a transaction restriction. Please contact support for more information."
          )
        );
      }

      // Check that user has enough balance
      if (Math.abs(amount) > user.wallet) {
        res.status(400);
        return next(new Error("You can't afford this withdraw!"));
      }

      // Check that user has wagered atleast 50% of his deposited amount
      if (user.wagerNeededForWithdraw > 0) {
        res.status(400);
        return next(
          new Error(
            `You must wager atleast $${user.wagerNeededForWithdraw.toFixed(
              2
            )} before withdrawing!`
          )
        );
      }

      // If user has deposited less than $5.00 before withdrawing
      if (user.totalDeposited < 5) {
        res.status(400);
        return next(
          new Error("You must have deposited atleast $5.00 before withdrawing!")
        );
      }

      // If user has wager limit, check if it's been passed
      if (user.wager < user.customWagerLimit) {
        res.status(400);
        return next(
          new Error(
            `Because your account has wager limit, you must wager still $${(
              user.customWagerLimit - user.wager
            ).toFixed(2)} before withdrawing!`
          )
        );
      }

      // Create a new document
      const newTransaction = new CryptoTransaction({
        type: "withdraw", // Transaction type

        currency, // Crypto currency name
        siteValue: amount, // Value in site balance (USD)
        cryptoValue: null, // Value in crypto currency
        address, // Crypto address

        txid: null, // Blockchain transaction id
        state: config.site.manualWithdrawsEnabled ? 4 : 1, // 1 = pending, 2 = declined, 3 = completed, 4 = manual hold

        _user: user.id, // User who made this transaction
      });

      // Remove balance from user
      await User.updateOne(
        { _id: user.id },
        {
          $inc: {
            wallet: -Math.abs(amount),
            totalWithdrawn: Math.abs(amount),
          },
        }
      );
      insertNewWalletTransaction(
        user.id,
        -Math.abs(amount),
        "Crypto withdraw",
        { transactionId: newTransaction.id }
      );

      // If manual withdraws are not on
      if (!config.site.manualWithdrawsEnabled) {
        // Create new payment using Coinpayments
        const newPayment = await createWithdrawTransaction(
          currency.toLowerCase(),
          address,
          Math.abs(amount),
          newTransaction.id
        );

        // Set values
        newTransaction.txid = newPayment.network.hash;
        newTransaction.cryptoValue = Math.abs(
          parseFloat(newPayment.amount.amount)
        );

        // Insert new entry to the db
        await newTransaction.save();
      } else {
        // Insert new entry to the db
        await newTransaction.save();
      }

      // Log debug info
      console.log(
        colors.blue("Coinbase >> New withdraw valued"),
        colors.cyan(`$${amount}`),
        colors.blue("to"),
        colors.cyan(address),
        colors.blue(`(Manual: ${config.site.manualWithdrawsEnabled})`)
      );

      return res.json({
        siteValue: newTransaction.siteValue,
        cryptoValue: newTransaction.cryptoValue,
        state: config.site.manualWithdrawsEnabled ? 4 : 1,
      });
    } catch (error) {
      console.log("Error while completing a withdraw:", error);

      // If the error was related to coinbase
      if (error.name === "ValidationError") {
        console.log(
          colors.red(
            `Coinbase >> Error contacting API! Check payment manually! Debug info below:`
          )
        );

        // Construct debug info
        const debug = {
          "User ID": req.user.id,
          "Withdraw wallet address": address,
          "Withdraw amount": amount,
          "Withdraw currency": currency,
        };

        // Print out debug information
        console.table(debug);

        return next(
          new Error(
            "There was a problem while contacting our crypto provider. Please contact support to check your withdraw status!"
          )
        );
      } else {
        return next(error);
      }
    }
  }
);
