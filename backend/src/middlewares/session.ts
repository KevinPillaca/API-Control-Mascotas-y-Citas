import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.handle";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Obtener el token del header (Ej: "Bearer eyJhbGci...")
    const jwtByUser = req.headers.authorization || "";
    const jwt = jwtByUser.split(" ").pop(); // Nos quedamos solo con el string del token

    // 2. Validar si el token existe
    if (!jwt) {
      return res.status(401).json({ message: "SESSION_INVALID_OR_NOT_FOUND" });
    }

    // 3. Verificar la firma del token con nuestro util
    const isUser = verifyToken(jwt);

    if (!isUser) {
      return res.status(401).json({ message: "INVALID_TOKEN" });
    }

    // 4. Si todo está bien, pasamos al siguiente controlador
    next();
  } catch (error) {
    console.error("[Session Middleware Error]:", error);
    res.status(400).json({ message: "SESSION_INVALID" });
  }
};