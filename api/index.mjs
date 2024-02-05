import express from "express";
import cors from "cors";
import "express-async-errors";
import routes from "./routes/routes.mjs";
import landings from "./routes/landings.mjs";
import dashboard from "./routes/dashboard.mjs";
import { expressjwt } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";

const PORT = process.env.PORT || 5050
const app = express();

const secret = await expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://mdb-atlas.us.auth0.com/.well-known/jwks.json`
});
const jwt = expressjwt({
  secret,
  audience: "mdb-atlas",
  issuer: "https://mdb-atlas.us.auth0.com/",
  algorithms: ["RS256"]
});

const jwtExceptWhitelist = function(req, res, next) {
  const whitelist = [
    { url: "/routes/redirect", method: "POST" },
    { url: /\/landings\/[a-z0-9_-]*/i, method: "GET"}
  ];
  const isWhitelisted = !!whitelist.filter(item => {
    return req.url.match(item.url) && req.method === item.method;
  }).length;
  if (isWhitelisted) {
    next();
  } else {
    jwt(req, res, next);
  }
}

app.use(cors());
app.use(express.json());
app.use(jwtExceptWhitelist);

// Load the routes
app.use("/routes", routes);
app.use("/landings", landings);
app.use("/dashboard", dashboard);

// Global error handling
app.use((err, _req, res, next) => {
  console.log(err);
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});