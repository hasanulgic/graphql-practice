import jwt, { Secret } from "jsonwebtoken";

require("dotenv").config();

export const jwtHelper = async (payload: {userId: number}, secret: Secret) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
  return token;
};
