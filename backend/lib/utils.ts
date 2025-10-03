import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response): string => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // will determine if its https or http
  });

  return token;
};
