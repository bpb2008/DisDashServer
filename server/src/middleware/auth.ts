import { expressjwt } from "express-jwt";
import JwksRsa from "jwks-rsa";

export const checkJwt = expressjwt({
  secret: "randomstring",
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});