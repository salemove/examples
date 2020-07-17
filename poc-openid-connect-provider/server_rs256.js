const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const username = process.env.USER_LOGIN || "test";
const password = process.env.USER_PASS || "pass";
const clientId = process.env.CLIENT_ID || "clientid0123456789";
const privateKeyFile =
  process.env.PRIVATE_KEY_FILE || "rs256/jwt-rs256-key.key";

const privateKey = fs.readFileSync(privateKeyFile, "utf8");

app.get("/oauth2/authorize", (req, res) => {
  const hiddenField = (name, value) => {
    return `<input type="hidden" name=${name} value="${value}">`;
  };

  const form =
    '<form method="post">' +
    '<input type="text" name="username" placeholder="username">' +
    '<input type="password" name="password" placeholder="password">' +
    hiddenField("redirect_uri", req.query.redirect_uri) +
    hiddenField("scope", req.query.scope) +
    hiddenField("state", req.query.state) +
    hiddenField("nonce", req.query.nonce) +
    hiddenField("response_type", req.query.response_type) +
    hiddenField("response_mode", req.query.response_mode) +
    '<input type="submit" name="ok" value="login">' +
    "</form>";

  res.status(200).send(form);
});

app.post("/oauth2/authorize", (req, res) => {
  const redirectUri = req.body.redirect_uri;
  const code = "test-code";

  if (req.body.username === username && req.body.password === password) {
    return res.redirect(redirectUri + `?state=${req.body.state}&code=${code}`);
  }

  res.redirect(
    redirectUri +
      `?state=${req.body.state}&error=unauthorized&error_description=invalid_credentials`
  );
});

app.post("/oauth2/token", (req, res) => {
  const reqClientId = req.body.client_id;
  const reqClientSecret = req.body.client_secret;

  if (reqClientId !== clientId || reqClientSecret !== privateKey) {
    return res.status(401).json({
      error: "unauthorized",
      error_description: "invalid client id or secret",
    });
  }

  const idTokenPayload = {
    iss: "https://example.com",
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 60 * 60, // 60 minutes
    aud: req.body.client_id,
    sub: "example-user-id-123",
    name: "John Smith",
    email: "hello@example.com",
  };

  let idToken = jwt.sign(idTokenPayload, privateKey, { algorithm: "RS256" });

  let response = {
    id_token: idToken,
    token_type: "Bearer",
    expires_in: 3600,
    scope: "openid email profile",
    access_token: "example-token",
  };

  res.status(200).json(response);
});

app.listen(port, () => {
  console.info(`Running on: http://localhost:${port}/`);
});
