import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  //POST LOGIN
  public login = async ({ body }: Request, res: Response) => {
    try {
      const response = await this.authService.loginUser(body);
      return res.status(200).json(response);
    } catch (error: any) {
      // Mapeo de errores para evitar IFs anidados
      const errors: Record<string, number> = {
        USER_NOT_FOUND: 404,
        INVALID_PASSWORD: 401,
      };

      const status = errors[error.message] || 500;
      const message = status === 500 ? "Internal Server Error" : error.message;

      return res.status(status).json({ message });
    }
  };
}