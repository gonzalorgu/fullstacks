import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ChangePasswordDto, ResetPasswordDto, UpdateProfileDto } from "./dto/auth.dto";
interface RequestWithUser extends Request {
    user: {
        userId: number;
        email: string;
        role: string;
    };
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            email: string;
            nombre: string;
            telefono: string;
            dni: string;
            fechaNacimiento: string;
            direccion: string;
            role: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
            nombre: string;
            telefono: string;
            dni: string;
            fechaNacimiento: string;
            direccion: string;
            role: string;
            isActive: true;
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: RequestWithUser): Promise<{
        id: number;
        email: string;
        nombre: string;
        telefono: string;
        dni: string;
        fechaNacimiento: string;
        direccion: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: RequestWithUser, updateProfileDto: UpdateProfileDto): Promise<{
        id: number;
        email: string;
        nombre: string;
        telefono: string;
        dni: string;
        fechaNacimiento: string;
        direccion: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: RequestWithUser, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getAllUsers(req: RequestWithUser): Promise<import("./entities/user.entity").User[]>;
    getUserById(req: RequestWithUser, id: string): Promise<{
        id: number;
        email: string;
        nombre: string;
        telefono: string;
        dni: string;
        fechaNacimiento: string;
        direccion: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(req: RequestWithUser, id: string, updateUserDto: UpdateProfileDto): Promise<{
        id: number;
        email: string;
        nombre: string;
        telefono: string;
        dni: string;
        fechaNacimiento: string;
        direccion: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(req: RequestWithUser, id: string): Promise<{
        message: string;
    }>;
    toggleUserActive(req: RequestWithUser, id: string): Promise<{
        message: string;
        isActive: boolean;
    }>;
}
export {};
