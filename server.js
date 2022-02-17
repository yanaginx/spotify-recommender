const express = require("express");
const session = require("cookie-session");
const hpp = require("hpp");
const csurf = require("csurf");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

/* Import Config */
dotenv.config({ path: path.resolve(__dirname, ".env") });

/* Create express app */
const app = express();

/* Set security configs */
app.use(helmet());
app.use(hpp());

/* Set cookie settings */
app.use(
  session({
    name: "session",
    secret: process.env.COOKIE_SECRET,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours = 24*60*60*1000 ms
  })
);
app.use(csurf());

var sess;
app.get("/", function (req, res) {
  sess = req.session;
  res.setHeader("Content-Type", "text/html");
  res.write("<p>name: " + sess.name + "</p>");
  res.write("<p>secret: " + sess.secret + "</p>");
  res.end();
});

const authRoutes = require("./routes/auth");
// use the middleware function authRoutes when the requested path matched '/auth'
app.use("/auth", authRoutes);

app.listen(8080, () => {
  console.log("I'm listening!");
});

module.exports = app;
