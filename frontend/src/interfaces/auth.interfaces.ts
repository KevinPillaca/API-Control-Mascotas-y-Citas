export interface LoginRequest {
    usuario: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        usuario: string;
    };
}