// Require Dependencies
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const throttlerController = require("./throttler");
const { verifyRecaptchaResponse } = require("./recaptcha");
const config = require("../config");
const { getVipLevelFromWager } = require("./vip");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const colors = require("colors/safe");

const User = require("../models/User");
const Trivia = require("../models/Trivia");

// Declare chat state
const CHAT_STATE = [];
const RAIN_STATE = {
  active: false, // Whether rain is currently active
  prize: 0, // Prize split between players
  timeLeft: 0, // How many players can participate in this rain
  players: [], // Array of UserID's who have participated in the rain
};
let CHAT_PAUSED = false;

// Parse days, hours and minutes from ms timestamp
const parseUnixTimestamp = ms => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000)),
    daysms = ms % (24 * 60 * 60 * 1000),
    hours = Math.floor(daysms / (60 * 60 * 1000)),
    hoursms = ms % (60 * 60 * 1000),
    minutes = Math.floor(hoursms / (60 * 1000)),
    minutesms = ms % (60 * 1000),
    sec = Math.floor(minutesms / 1000);
  return "(" + days + "d " + hours + "h " + minutes + "m " + sec + "s)";
};

// Get state from outside the component
const getChatMessages = () => CHAT_STATE;
const getRainStatus = () => RAIN_STATE;

// How long should user wait between messages
const slowModeBuffer = 3000; // 3 seconds = 3000ms

// Get socket.io instance
const listen = io => {
  // End rain (all players have joined)
  const endCurrentRain = async () => {
    // Disable joining
    RAIN_STATE.active = false;

    try {
      // Calculate profit for each participant
      const profit = RAIN_STATE.prize / RAIN_STATE.players.length;

      // Loop through each participant
      for (let index = 0; index < RAIN_STATE.players.length; index++) {
        const player = RAIN_STATE.players[index];

        // Update document
        await User.updateOne({ _id: player }, { $inc: { wallet: profit } });
        insertNewWalletTransaction(player, profit, "Chat rain win");

        // Notify user
        io.of("/chat")
          .to(player)
          .emit("notify-success", `You won $${profit.toFixed(2)} from rain!`);
        io.of("/chat").to(player).emit("update-wallet", Math.abs(profit));
      }

      // Reset rain state
      RAIN_STATE.players = [];
      RAIN_STATE.timeLeft = 0;
      RAIN_STATE.prize = 0;

      // Remove rain from clients
      io.of("/chat").emit("rain-state-changed", RAIN_STATE);
      io.of("/chat").emit(
        "notify-error",
        `Rain has ended.. Good luck next time!`
      );
    } catch (error) {
      console.log("Error while ending rain:", error);
      io.of("/chat").emit(
        "notify-error",
        "There was an error while ending this rain! Please contact site administrators!"
      );
    }
  };

  // Start a new rain
  const startNewRain = (timeInMs, prize) => {
    // If there currently is an active rain
    if (RAIN_STATE.active) return;

    // Update state
    RAIN_STATE.active = true;
    RAIN_STATE.timeLeft = timeInMs;
    RAIN_STATE.prize = prize;

    // Notify clients
    io.of("/chat").emit("rain-state-changed", RAIN_STATE);

    // Start countdown
    const countdown = setInterval(() => {
      // Decrement time left
      RAIN_STATE.timeLeft -= 10;

      // Check if timer has reached 0
      if (RAIN_STATE.timeLeft <= 0) {
        clearInterval(countdown);
        return endCurrentRain();
      }
    }, 10);
  };

  // End active trivia
  const endActiveTrivia = async gameId => {
    try {
      // Get active trivia
      const activeTrivia = await Trivia.findOne({ active: true, _id: gameId });

      // If active trivia was not found
      if (!activeTrivia) return;

      // Update document
      await Trivia.updateOne({ _id: gameId }, { $set: { active: false } });

      // Loop through winners
      for (let index = 0; index < activeTrivia.winners.length; index++) {
        const winnerId = activeTrivia.winners[index];

        // Update document
        await User.updateOne(
          { _id: winnerId },
          { $inc: { wallet: activeTrivia.prize } }
        );
        insertNewWalletTransaction(
          winnerId,
          activeTrivia.prize,
          "Chat trivia win",
          { triviaId: gameId }
        );

        // Notify user
        io.of("/chat")
          .to(winnerId)
          .emit(
            "notify-success",
            `You won $${activeTrivia.prize.toFixed(2)} from trivia!`
          );
        io.of("/chat")
          .to(winnerId)
          .emit("update-wallet", Math.abs(activeTrivia.prize));
      }

      io.of("/chat").emit("trivia-state-changed", null);
      io.of("/chat").emit(
        "notify-error",
        `Trivia has ended.. Good luck next time!`
      );

      console.log(
        colors.green("Trivia >> Automatically ended trivia"),
        activeTrivia.id
      );
    } catch (error) {
      console.log("Error while ending trivia:", error);
      io.of("/chat").emit(
        "notify-error",
        "There was an error while ending this trivia! Please contact site administrators!"
      );
    }
  };

  // Listen for new websocket connections
  io.of("/chat").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connnections
    socket.use(throttlerController(socket));

    // Authenticate websocket connection
    socket.on("auth", async token => {
      if (!token) {
        loggedIn = false;
        user = null;
        return socket.emit(
          "error",
          "No authentication token provided, authorization declined"
        );
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.authentication.jwtSecret);

        user = await User.findOne({ _id: decoded.user.id });
        if (user) {
          if (parseInt(user.banExpires) > new Date().getTime()) {
            // console.log("banned");
            loggedIn = false;
            user = null;
            return socket.emit("user banned");
          } else {
            loggedIn = true;
            socket.join(String(user._id));
            // socket.emit("notify-success", "Successfully authenticated!");
            io.of("/chat").emit(
              "users-online",
              Object.keys(io.of("/chat").sockets).length
            );
          }
        }
        // return socket.emit("alert success", "Socket Authenticated!");
      } catch (error) {
        loggedIn = false;
        user = null;
        return socket.emit("notify-error", "Authentication token is not valid");
      }
    });

    // Check for users ban status
    socket.use(async (packet, next) => {
      if (loggedIn && user) {
        try {
          const dbUser = await User.findOne({ _id: user.id });

          // Check if user is banned
          if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
            return socket.emit("user banned");
          } else {
            return next();
          }
        } catch (error) {
          return socket.emit("user banned");
        }
      } else {
        return next();
      }
    });

    // Update online users count
    io.of("/chat").emit(
      "users-online",
      Object.keys(io.of("/chat").sockets).length
    );

    // Create a new chat message
    socket.on("set-displayname", async name => {
      console.log("NAME SETTING");
      console.log("NAME SETTING");
      console.log("NAME SETTING");
      console.log("NAME SETTING");
      console.log("NAME SETTING");
      console.log("NAME SETTING");
      console.log("NAME SETTING");
      console.log("NAME SETTING");
      // Validate user input
      if (typeof name !== "string")
        return socket.emit("notify-error", "Invalid Name!");

      try {
        // Get latest user obj
        const dbUser = await User.findOne({ _id: user.id });

        dbUser.username = name
          .replace(".gg", "x")
          .replace(".GG", "x")
          .replace("CSGO", "x")
          .replace("csgo", "x")
          .replace(".COM", "x")
          .replace(".com", "x")
          .replace(".NET", "x")
          .replace(".net", "x")
          .replace("porn", "x")
          .replace("PORN", "x")
          .replace("/", "x")
          .replace("+", "x")
          .replace("nigga", "x")
          .replace("nigger", "x")
          .replace("-", "x")
          .replace("niger", "x")
          .replace("niga", "x")
          .replace(".", "")
          .substring(0, 16);

        if (dbUser.username === "") {
          dbUser.username = "Anonymous";
        }

        await dbUser.save();
        return socket.emit(
          "notify-success",
          "Successfully changed username! Refresh site to see changes.."
        );
      } catch (err) {}
    });

    // Create a new chat message
    socket.on("send-chat-message", async content => {
      // Validate user input
      if (typeof content !== "string")
        return socket.emit("notify-error", "Invalid Message Type!");
      if (content.trim() === "")
        return socket.emit("notify-error", "Invalid Message Length!");
      if (!loggedIn)
        return socket.emit("notify-error", "You are not logged in!");

      // More validation on the content
      if (content.length > 200) {
        return socket.emit(
          "notify-error",
          "Your message length must not exceed 200 characters!"
        );
      }

      try {
        // Get latest user obj
        const dbUser = await User.findOne({ _id: user.id });

        // Get active trivia
        const activeTrivia = await Trivia.findOne({ active: true });

        // If there is an active trivia
        // and user entered the right answer
        if (
          activeTrivia &&
          content.toLowerCase() === activeTrivia.answer.toLowerCase()
        ) {
          // If the user has not participated in it yet
          if (!activeTrivia.winners.includes(String(user.id))) {
            // Update document
            await Trivia.updateOne(
              { _id: activeTrivia.id },
              { $push: { winners: user.id } }
            );

            // If user was last to join
            if (activeTrivia.winners.length + 1 === activeTrivia.winnerAmount) {
              // End active trivia
              endActiveTrivia(activeTrivia.id);
            }
          } else {
            return socket.emit(
              "notify-error",
              "You have already participated in this trivia!"
            );
          }
        }

        // Check for chat commands
        const args = content.split(" ");
        const command = args[0];
        const ObjectId = require("mongoose").Types.ObjectId;

        // Check self-exclusion command
        if (command.includes("/selfexclude")) {
          if (!args[1] || !args[2])
            return socket.emit(
              "notify-error",
              "Please enter category and duration"
            );

          if (isNaN(args[2]))
            return socket.emit(
              "notify-error",
              "Enter a valid number for duration"
            );

          args[2] = +args[2] * 60 * 60 * 1000;

          if (args[2] < 15 * 60 * 1000 || args[2] > 144 * 60 * 60 * 1000)
            return socket.emit(
              "notify-error",
              "Duration has to be at least 0.25h and at most 144h"
            );

          if (args[1] === "All_Modes") {
            dbUser.selfExcludes.crash = Math.max(
              dbUser.selfExcludes.crash,
              Date.now() + args[2]
            );
            dbUser.selfExcludes.shuffle = Math.max(
              dbUser.selfExcludes.shuffle,
              Date.now() + args[2]
            );
            dbUser.selfExcludes.cups = Math.max(
              dbUser.selfExcludes.cups,
              Date.now() + args[2]
            );
            dbUser.selfExcludes.roulette = Math.max(
              dbUser.selfExcludes.roulette,
              Date.now() + args[2]
            );
          } else if (args[1] === "Crash") {
            dbUser.selfExcludes.crash = Math.max(
              dbUser.selfExcludes.crash,
              Date.now() + args[2]
            );
          } else if (args[1] === "Shuffle") {
            dbUser.selfExcludes.shuffle = Math.max(
              dbUser.selfExcludes.shuffle,
              Date.now() + args[2]
            );
          } else if (args[1] === "Cups") {
            dbUser.selfExcludes.cups = Math.max(
              dbUser.selfExcludes.cups,
              Date.now() + args[2]
            );
          } else if (args[1] === "Roulette") {
            dbUser.selfExcludes.roulette = Math.max(
              dbUser.selfExcludes.roulette,
              Date.now() + args[2]
            );
          } else {
            return socket.emit(
              "notify-error",
              "Select a self-exclusion category"
            );
          }

          await dbUser.save();

          return socket.emit(
            "notify-success",
            `You have self-excluded yourself from ${args[1]} for ${(
              args[2] /
              60 /
              60 /
              1000
            ).toFixed(1)} hours`
          );
        }

        // Check if user is trying to tip another user
        if (command.includes("/tip")) {
          if (!args[1] || !args[2])
            return socket.emit(
              "notify-error",
              "Please type the <userId> and <amount>"
            );

          // Check if error
          if (!ObjectId.isValid(args[1]))
            return socket.emit(
              "notify-error",
              "Invalid UserID. Please try again."
            );

          if (isNaN(args[2]))
            return socket.emit(
              "notify-error",
              "Type a valid number for <amount> parameter"
            );

          if (isNaN(args[2]))
            return socket.emit(
              "notify-error",
              "Type a valid number for <amount> parameter"
            );

          args[2] = parseFloat(parseFloat(args[2]).toFixed(2));

          // Not enough balance!
          if (dbUser.wallet < parseFloat(args[2]))
            return socket.emit(
              "notify-error",
              "You don't have enough balance to send a tip to this user!"
            );

          // You can't send yourself check.
          if (dbUser.id === args[1])
            return socket.emit(
              "notify-error",
              "You can't send a tip to yourself!"
            );

          // userID doesn't exists check.
          const tipped_user = await User.findOne({ _id: args[1] });
          if (!tipped_user)
            return socket.emit("notify-error", "This userID does not exists!");

          // At least lvl 20 check.
          if (dbUser.wager < 300)
            return socket.emit(
              "notify-error",
              "You need to be at least level 20 to use tip feature!"
            );

          // Check if banned.
          let timp_ramas = dbUser.banExpires - new Date().getTime();
          if (timp_ramas > 0)
            return socket.emit(
              "notify-error",
              "You are banned from degencupsio, you can't use the tip feature!"
            );

          // If transactions locked
          if (dbUser.transactionsLocked)
            return socket.emit(
              "notify-error",
              "You have the transactions locked and can't use the tip feature!"
            );

          // Check min amount: 1.00; max amount: 100.00
          if (args[2] < 1.0 || args[2] > 100.0)
            return socket.emit(
              "notify-error",
              "You can send tips only between $1.00 - $100.00!"
            );

          // Update both users' wallet balances.
          await User.updateOne({ _id: args[1] }, { $inc: { wallet: args[2] } });
          await User.updateOne(
            { _id: dbUser.id },
            { $inc: { wallet: `-${args[2]}` } }
          );

          // Insert new transaction for the tipped user & send new wallet update.
          insertNewWalletTransaction(
            args[1],
            args[2],
            `Tip received from userID ${user.id}`
          );
          // let tipped_user_wallet = await User.findOne({_id:args[1]}).wallet;
          io.of("/chat").to(args[1]).emit("update-wallet", parseFloat(args[2]));

          // Insert new transaction for the tipper user & send new wallet update.
          insertNewWalletTransaction(
            user.id,
            `-${args[2]}`,
            `Tip sent to userID ${args[1]}`
          );
          // let tipper_user_wallet = await User.findOne({_id:dbUser.id}).wallet;
          io.of("/chat")
            .to(dbUser.id)
            .emit("update-wallet", -parseFloat(args[2]));

          io.of("/chat")
            .to(args[1])
            .emit(
              "notify-success",
              `You've successfully received $${args[2]} from ${args[1]}!`
            );
          return socket.emit(
            "notify-success",
            `You've successfully sent $${args[2]} to userID ${args[1]}!`
          );
        }

        // Check if user is trying to create new rain game
        if (dbUser.rank === 5 && command.includes(".create-rain")) {
          // Validate admin input
          if (!args[1] || !args[2])
            return socket.emit(
              "notify-error",
              "Please specify <timeInSeconds> and <prize>"
            );
          if (isNaN(args[1]) || isNaN(args[2]))
            return socket.emit(
              "notify-error",
              "<timeInSeconds> and <prize> must be numbers!"
            );

          // Create a new game
          startNewRain(parseInt(args[1]) * 1000, parseFloat(args[2]));
          io.of("/chat").emit(
            "notify-success",
            `New rain started.. 3 minutes left to join!`
          );
          return socket.emit("notify-success", "Successfully started rain!");
        }

        // Check if user is trying to remove a message
        if (dbUser.rank >= 3 && command.includes(".remove-message")) {
          // Validate admin input
          if (!args[1])
            return socket.emit("notify-error", "Please specify <MessageID>");

          // Find message to see if it exists
          const message = CHAT_STATE.find(message => message.msgId === args[1]);

          // If message was not found
          if (!message) {
            return socket.emit(
              "notify-error",
              "Couldn't find any message to remove with that MessageID"
            );
          }

          // Get message index
          const messageIndex = CHAT_STATE.findIndex(
            message => message.msgId === args[1]
          );

          // Remove message from state
          CHAT_STATE.splice(messageIndex, 1);

          // Remove from local state
          io.of("/chat").emit("remove-message", args[1]);

          return socket.emit(
            "notify-success",
            "Successfully deleted a message!"
          );
        }

        // Check if user is trying to pause the chat
        if (dbUser.rank >= 3 && command.includes(".pause-chat")) {
          // Toggle local variable
          CHAT_PAUSED = !CHAT_PAUSED;

          return socket.emit(
            "notify-success",
            `Successfully ${CHAT_PAUSED ? "paused" : "enabled"} chat!`
          );
        }

        // Check if user is trying to ban a user
        if (dbUser.rank >= 3 && command.includes(".ban-user")) {
          // Validate admin input
          if (!args[1])
            return socket.emit("notify-error", "Please specify <UserId>");

          // Get user from DB
          const banUser = await User.findOne({ _id: args[1] });

          // If user doesn't exist
          if (!banUser) {
            return socket.emit(
              "notify-error",
              "Couldn't find any users with that UserID!"
            );
          }

          // Update document
          await User.updateOne(
            { _id: args[1] },
            { $set: { banExpires: 9999999999999 } }
          );

          return socket.emit("notify-success", "Successfully banned a user!");
        }

        // Check if user is trying to mute a user
        if (dbUser.rank >= 3 && command.includes(".mute-user")) {
          // Validate admin input
          if (!args[1])
            return socket.emit("notify-error", "Please specify <UserId>");

          // Get user from DB
          const muteUser = await User.findOne({ _id: args[1] });

          // If user doesn't exist
          if (!muteUser) {
            return socket.emit(
              "notify-error",
              "Couldn't find any users with that UserID!"
            );
          }

          // Update document
          await User.updateOne(
            { _id: args[1] },
            { $set: { muteExpires: 9999999999999 } }
          );

          return socket.emit("notify-success", "Successfully muted a user!");
        }

        // Check if user is muted
        if (parseInt(dbUser.muteExpires) > new Date().getTime()) {
          const timeLeft = parseInt(dbUser.muteExpires) - new Date().getTime();
          return socket.emit(
            "notify-error",
            `You are muted ${parseUnixTimestamp(timeLeft)}`
          );
        }

        // Get user's last message
        const lastMessage = CHAT_STATE.sort(
          (a, b) => b.created - a.created
        ).find(message => message.user.id === user.id);

        // If slow mode affects user
        if (
          dbUser.rank < 3 &&
          lastMessage &&
          lastMessage.created + slowModeBuffer > Date.now()
        ) {
          return socket.emit(
            "notify-error",
            "Slow down, you can only send messages every 3 seconds!"
          );
        }

        // If chat pause affects user
        if (CHAT_PAUSED && dbUser.rank < 3) {
          return socket.emit("notify-error", "Chat is temporarily paused!");
        }

        // Construct a new message
        const message = {
          user: {
            username: dbUser.username,
            avatar: dbUser.avatar,
            rank: dbUser.rank,
            level: getVipLevelFromWager(dbUser.wager),
            id: dbUser.id,
          },
          content,
          msgId: uuid.v4(),
          created: Date.now(),
        };

        // Add message to local state
        CHAT_STATE.push(message);

        // Broadcast message to all clients
        return io.of("/chat").emit("new-chat-message", message);
      } catch (error) {
        console.log("Error while sending a chat message:", error);
        return socket.emit(
          "notify-error",
          "Internal server error, please try again later!"
        );
      }
    });

    // Enter an active rain
    socket.on("enter-rain", async recaptchaResponse => {
      const dbUser = await User.findOne({ _id: user.id });

      if (dbUser.wager < 20)
        return socket.emit(
          "rain-join-error",
          "You need to be atleast level 5 to be able to join rain!"
        );

      // Validate user input
      if (typeof recaptchaResponse !== "string")
        return socket.emit(
          "rain-join-error",
          "Invalid ReCaptcha Response Type!"
        );
      if (!RAIN_STATE.active)
        return socket.emit(
          "rain-join-error",
          "There is currently no active rain to enter!"
        );
      if (!loggedIn)
        return socket.emit("rain-join-error", "You are not logged in!");

      // Check that user hasn't entered before
      if (RAIN_STATE.players.filter(userId => userId === user.id).length > 0) {
        return socket.emit(
          "rain-join-error",
          "You have already entered this rain!"
        );
      }

      try {
        // Verify reCaptcha response
        const valid = await verifyRecaptchaResponse(recaptchaResponse);

        // If reCaptcha was valid
        if (valid) {
          // Add user to the players array
          RAIN_STATE.players.push(user.id);

          // Notify user
          socket.emit("rain-join-success", "Successfully joined rain!");
        } else {
          return socket.emit(
            "rain-join-error",
            "Your captcha wasn't valid, please try again later!"
          );
        }
      } catch (error) {
        console.log(
          "Error while validating reCaptcha response for rain:",
          error
        );
        return socket.emit(
          "rain-join-error",
          "Couldn't join this rain: Internal server error, please try again later!"
        );
      }
    });

    // User disconnects
    socket.on("disconnect", () => {
      // Update online users count
      io.of("/chat").emit(
        "users-online",
        Object.keys(io.of("/chat").sockets).length
      );
    });
  });
};

// Export functions
module.exports = { listen, getChatMessages, getRainStatus };
