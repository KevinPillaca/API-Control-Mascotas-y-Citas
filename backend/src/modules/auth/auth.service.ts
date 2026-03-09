import { LoginDTO } from "./auth.dto";
import prisma from "../../config/db";
import { generateToken } from "../../utils/jwt.handle"; // Importamos el util

export class AuthService {
  public loginUser = async (data: LoginDTO) => {
    // 1. Prisma (ORM) busca en la tabla usuario de MySQL
    const user = await (prisma as any).usuario.findUnique({
      where: { usuario: data.usuario },
    });   

    if (!user) throw new Error("USER_NOT_FOUND");

    // 2. Comparación de contraseña (Texto plano como acordamos)
    if (data.password !== user.password) throw new Error("INVALID_PASSWORD");

    // 3. Generación de Token usando nuestro util
    const token = generateToken({ id: user.id, username: user.usuario });

    return {
      user: { id: user.id, usuario: user.usuario },
      token,
    };
  };
}