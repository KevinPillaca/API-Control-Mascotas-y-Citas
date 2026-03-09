import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "token_secreto_veterinaria_2026";

/**
 * Genera un token firmado para el usuario
 */
export const generateToken = (payload: { id: number; username: string }) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "8h",
  });
};

/**
 * Verifica si un token es válido (Lo usaremos para proteger rutas más adelante)
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};