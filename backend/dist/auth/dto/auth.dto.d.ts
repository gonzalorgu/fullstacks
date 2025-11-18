export declare class RegisterDto {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
    dni: string;
    fechaNacimiento: string;
    direccion: string;
    role?: "user" | "admin";
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class ResetPasswordDto {
    email: string;
}
export declare class UpdateProfileDto {
    nombre?: string;
    telefono?: string;
    direccion?: string;
}
