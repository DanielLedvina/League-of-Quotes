const express = require("express");
const cors = require("cors");
const session = require("express-session");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const localhostPort = 3000;
const serverPort = 3001;

const structured_data = require("./structured_quotes.json");
const secret_key = "your_secret_key";

app.use(express.json());
app.use(cors({origin: [`http://localhost:${localhostPort}`], credentials: true}));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if you are using https
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

const corsOptions = {
  origin: "http://localhost:3000", // or whichever port your frontend is on
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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

/**
 * @swagger
 * /api/champions:
 *  get:
 *    summary: Returns the list of all the users
 *    responses:
 *      200:
 *        description: The list of the users
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
 *    summary: Returns the list of all the users
 *    responses:
 *      200:
 *        description: The list of the users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 */
app.post("/api/login", (req, res) => {
  const {username, password} = req.body;
  const filePath = path.join(__dirname, `./data/users/${username}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(401).json({message: "Invalid username or password"});
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (data.password === password) {
      req.session.user = {
        username: data.username,
        password: data.password,
        favChampion: data.favChampion,
        userPicture: data.userPicture,
      };
      console.log(req.session.user); // Log the session to see if user data is being set correctly
      res.json({
        message: "Login successful",
        favChampion: data.favChampion,
        userPicture: data.userPicture,
      });
    } else {
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

app.get("/api/user", async (req, res) => {
  console.log(req.session);
  console.log(req.session.user);
  if (req.session.user) {
    try {
      const {username} = req.session.user;
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, `./data/users/${username}.json`)));
      res.json(data);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(401).json({message: "Unauthorized"});
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
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465
  auth: {
    user: "leagueofquotes.loq@gmail.com",
    pass: "mwkh gmst lfvl iziq",
    clientId: "55280600050-khsneq3002dquhna6b8mdn3oennlg7kv.apps.googleusercontent.com",
    clientSecret: "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",
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
    from: "leagueofquotes.loq@gmail.com", // Sender email
    to: email, // Recipient email
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

app.listen(serverPort, () => {
  console.log(`Server is running on http://localhost:${serverPort}`);
});
