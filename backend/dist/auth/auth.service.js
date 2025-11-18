"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("El email ya está registrado");
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            nombre: registerDto.nombre,
            email: registerDto.email,
            password: hashedPassword,
            telefono: registerDto.telefono,
            dni: registerDto.dni,
            fechaNacimiento: registerDto.fechaNacimiento,
            direccion: registerDto.direccion,
            role: registerDto.role || "user",
        });
        await this.userRepository.save(user);
        const result = {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            dni: user.dni,
            fechaNacimiento: user.fechaNacimiento,
            direccion: user.direccion,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        const token = this.generateToken(user);
        return {
            user: result,
            access_token: token,
        };
    }
    async login(loginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Credenciales inválidas");
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Credenciales inválidas");
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException("Usuario inactivo");
        }
        const result = {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            dni: user.dni,
            fechaNacimiento: user.fechaNacimiento,
            direccion: user.direccion,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        const token = this.generateToken(user);
        return {
            user: result,
            access_token: token,
        };
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        }
        const isOldPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new common_1.UnauthorizedException("Contraseña actual incorrecta");
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return { message: "Contraseña actualizada exitosamente" };
    }
    async resetPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return { message: "Si el email existe, recibirás instrucciones" };
        }
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        console.log(`🔐 Contraseña temporal para ${email}: ${tempPassword}`);
        return { message: "Si el email existe, recibirás instrucciones" };
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        }
        return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            dni: user.dni,
            fechaNacimiento: user.fechaNacimiento,
            direccion: user.direccion,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async updateProfile(userId, updateProfileDto) {
        console.log("📝 Actualizando perfil del usuario:", userId);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        }
        if (updateProfileDto.nombre !== undefined) {
            user.nombre = updateProfileDto.nombre;
            console.log("✏️ Nombre actualizado:", updateProfileDto.nombre);
        }
        if (updateProfileDto.telefono !== undefined) {
            user.telefono = updateProfileDto.telefono;
            console.log("✏️ Teléfono actualizado:", updateProfileDto.telefono);
        }
        if (updateProfileDto.direccion !== undefined) {
            user.direccion = updateProfileDto.direccion;
            console.log("✏️ Dirección actualizada:", updateProfileDto.direccion);
        }
        await this.userRepository.save(user);
        console.log("✅ Perfil actualizado exitosamente");
        return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            dni: user.dni,
            fechaNacimiento: user.fechaNacimiento,
            direccion: user.direccion,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async getAllUsers() {
        console.log("📍 Obteniendo todos los usuarios");
        const users = await this.userRepository.find({
            select: [
                "id",
                "email",
                "nombre",
                "telefono",
                "dni",
                "fechaNacimiento",
                "direccion",
                "role",
                "isActive",
                "createdAt",
            ],
            order: { createdAt: "DESC" },
        });
        console.log("✅ Usuarios encontrados:", users.length);
        return users;
    }
    async deleteUser(userId) {
        console.log("🗑️ Eliminando usuario:", userId);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        }
        await this.userRepository.remove(user);
        console.log("✅ Usuario eliminado");
        return { message: "Usuario eliminado exitosamente" };
    }
    async toggleUserActive(userId) {
        console.log("🔄 Toggle activo para usuario:", userId);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        }
        user.isActive = !user.isActive;
        await this.userRepository.save(user);
        console.log("✅ Usuario", user.isActive ? "activado" : "desactivado");
        return {
            message: `Usuario ${user.isActive ? "activado" : "desactivado"} exitosamente`,
            isActive: user.isActive,
        };
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map