import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWTSECRET_KEY, {
    expiresIn: "7d",
  });
};
