import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret";
const EXPIRES = process.env.JWT_EXPIRES || "1h";

// 토큰 생성
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

// 토큰 검증
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}