import * as jwtUtil from "../utils/jwt.util.js";

export function verifyStudyAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증 필요"});
  }

  const token = auth.split(" ")[1];
  const decoded = jwtUtil.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "토큰이 유효하지 않습니다" });
  }

  // 요청 객체에 스터디 ID 저장
  req.studyIdFromToken = decoded.studyId;

  next();
}