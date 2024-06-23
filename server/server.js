const express = require("express");
const cors = require("cors");
const session = require("express-session");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();
const app = express();
const localhostPort = process.env.REACT_APP_LOCALHOST_PORT || 3000;
const serverPort = process.env.REACT_APP_PORT || 3001;

const structured_data = require("./structured_quotes.json");

app.use(express.json());
app.use(cors({origin: [`http://localhost:${localhostPort}`], credentials: true}));

app.use(
  session({
    secret: process.env.REACT_APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if you are using https
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sample API",
      version: "1.0.0",
    },
  },
  apis: ["./server/server.js"], // Path to the API docs, adjust the path as necessary
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to serve static files
app.use("/images", express.static(path.join(__dirname, "images")));

// Specific route to serve images
app.get("/images/:type/:filename", (req, res) => {
  const type = req.params.type;
  const filename = req.params.filename;
  const options = {
    root: path.join(__dirname, "images", type),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile(filename, options, function (err) {
    if (err) {
      console.log(err);
      res.status(404).send("Sorry! Can't find that file!");
    } else {
      console.log("Sent:", filename);
    }
  });
});

/**
 * @swagger
 * /api/champions:
 *  get:
 *    summary: Returns the list of all the champions
 *    responses:
 *      200:
 *        description: The list of the champions
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 */
app.get("/api/champions", (req, res) => {
  res.json(structured_data);
});

/**
 * @swagger
 * /api/login:
 *  post:
 *    summary: Log in user
 *    responses:
 *      200:
 *        description: Log in user with his data
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 */
app.post("/api/login", (req, res) => {
  const {username, password} = req.body;
  const filePath = path.join(__dirname, `./data/users/${username}.json`);
  if (!fs.existsSync(filePath)) {
    console.log("User file does not exist");
    return res.status(401).json({message: "Invalid username or password"});
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (data.password === password) {
      req.session.user = {
        // Setting user data in session
        username: username,
        password: password,
        favChampion: data.favChampion,
        userPicture: data.userPicture,
      };
      console.log("Session set for user:", req.session.user);
      res.json({
        message: "Login successful",
        username,
        password,
        favChampion: data.favChampion,
        userPicture: data.userPicture,
      });
    } else {
      console.log("Password mismatch");
      res.status(401).json({message: "Invalid username or password"});
    }
  } catch (err) {
    console.error("Error reading user file:", err);
    res.status(500).json({message: "Server error. Please try again later."});
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({message: "Failed to log out"});
    }
    res.clearCookie("connect.sid");
    res.json({message: "Logged out successfully"});
  });
});

/**
 * @swagger
 * /api/user:
 *  post:
 *    summary: Returns the list of all the users
 *    responses:
 *      200:
 *        description: The list of the users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 */
// Route to fetch user data
app.get("/api/user", isAuthenticated, async (req, res) => {
  try {
    const {username} = req.session.user;
    const filePath = path.join(__dirname, `./data/users/${username}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));
    res.json(data);
  } catch (err) {
    console.error("Failed to read user file:", err);
    res.status(500).json({message: "Server error reading user data."});
  }
});

app.post("/api/changeUser1Champion", (req, res) => {
  const {favChampion, username} = req.body;

  if (!favChampion) {
    return res.status(400).json({message: "New champion is required"});
  }

  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, `./data/users/${username}.json`)));

    data.favChampion = favChampion;
    data.userPicture = `${favChampion.toLowerCase()}.png`;

    fs.writeFileSync(path.join(__dirname, `./data/users/${username}.json`), JSON.stringify(data, null, 2));

    if (req.session.user) {
      req.session.user.favChampion = favChampion;
      req.session.user.userPicture = data.userPicture;
    }
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.REACT_APP_EMAILHOST,
  port: 465,
  secure: true, // Use true for port 465
  auth: {
    user: process.env.REACT_APP_EMAIL,
    pass: process.env.REACT_APP_PASSWORD,
    clientId: process.env.REACT_APP_CLIENTID,
    clientSecret: process.env.REACT_APP_CLIENTSECRET,
  },
  tls: {
    rejectUnauthorized: false, // This allows self-signed certificates
  },
});

// Consolidated register API
app.post("/api/register", async (req, res) => {
  const {username, password, email} = req.body;

  if (fs.existsSync(path.join(__dirname, `./data/users/${username}.json`))) {
    return res.status(409).json({message: "User already exists"});
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");

  const newUser = {
    username,
    password, // Remember to hash passwords in production
    email,
    verificationToken,
    verified: false,
    userPicture: "Azir",
    favChampion: "Azir",
  };

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Account Verification",
    text: `Hi ${username}, please verify your account by clicking on this link: http://localhost:${localhostPort}/verify?token=${verificationToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email could not be sent:", error);
      res.status(500).json({message: "Email could not be sent, please try again"});
    } else {
      fs.writeFileSync(path.join(__dirname, `./data/users/${username}.json`), JSON.stringify(newUser, null, 2));
      console.log("Verification email sent: " + info.response);
      res.status(201).json({message: "Registration successful! Please check your email to verify your account."});
    }
  });
});

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.listen(serverPort, () => {
  console.log(`Server is running on http://localhost:${serverPort}`);
});
