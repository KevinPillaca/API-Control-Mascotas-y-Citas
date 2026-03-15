import clienteAxios from '../api/axiosConfig';
import type { LoginRequest, AuthResponse } from '../interfaces/auth.interfaces';

export const loginUser = async (datos: LoginRequest): Promise<AuthResponse> => {
    // Tu backend usa la ruta /auth/login
    const { data } = await clienteAxios.post<AuthResponse>('/auth/login', datos);
    return data;
};