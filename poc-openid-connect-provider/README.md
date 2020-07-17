# Proof-of-Concept OpenID Connect Provider

This is just a simple POC for OpenID Connect provider implementation to log user in.

Created for a quick demo purpose. Has only one user.

# URLs

| URL                      | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `GET /oauth2/authorize`  | Login form                                        |
| `POST /oauth2/authorize` | Check user credentials + redirect to redirect URI |
| `POST /oauth2/token`     | The URL where ID token is fetched from            |

# Installing dependencies

```bash
yarn install
```

# RS256 version

## Running

```bash
node server_rs256.js
```

# Generating a new key to sign ID toekn using RS256 algorithm

Demo key is provided in `rs256/jwt-rs256-key.key`.

```bash
openssl genrsa -out rs256/jwt-rs256-key.key 4096
```

## Environment variables

| Name             | Default value           | Description                       |
| ---------------- | ----------------------- | --------------------------------- |
| PORT             | 3000                    | Web server port                   |
| CLIENT_ID        | clientid0123456789      | OpenID Connect provider client ID |
| PRIVATE_KEY_FILE | rs256/jwt-rs256-key.key | Path to private key file          |
| USER_LOGIN       | test                    | User login                        |
| USER_PASS        | pass                    | User password                     |

# HS256 version

## Running

```bash
node server.js
```

## Environment variables

| Name          | Default value      | Description                       |
| ------------- | ------------------ | --------------------------------- |
| PORT          | 3000               | Web server port                   |
| CLIENT_ID     | clientid0123456789 | OpenID Connect provider client ID |
| CLIENT_SECRET | secret0123456789   | OpenID Connect provider secret    |
| USER_LOGIN    | test               | User login                        |
| USER_PASS     | pass               | User password                     |
