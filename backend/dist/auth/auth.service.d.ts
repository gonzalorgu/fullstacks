import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "./entities/user.entity";
import { RegisterDto, LoginDto, ChangePasswordDto, UpdateProfileDto } from "./dto/auth.dto";
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
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
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(email: string): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<{
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
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<{
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
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: number): Promise<{
        message: string;
    }>;
    toggleUserActive(userId: number): Promise<{
        message: string;
        isActive: boolean;
    }>;
    private generateToken;
}
