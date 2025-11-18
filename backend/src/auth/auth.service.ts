import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ✅ REGISTRO CON NUEVOS CAMPOS
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException("El email ya está registrado");
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

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Usuario inactivo");
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

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    const isOldPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException("Contraseña actual incorrecta");
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { message: "Contraseña actualizada exitosamente" };
  }

  async resetPassword(email: string) {
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

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
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

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    console.log("📝 Actualizando perfil del usuario:", userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
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

  // ========================================
  // ✨ GESTIÓN DE USUARIOS
  // ========================================

  async getAllUsers() {
    console.log("📍 Obteniendo todos los usuarios");

    const users = await this.userRepository.find({
      select: [
        "id",
        "email",
        "nombre",
        "telefono",
        "dni",
        "fechaNacimiento", // ✅ ⬅️ CAMPO AGREGADO
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

  async deleteUser(userId: number) {
    console.log("🗑️ Eliminando usuario:", userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    await this.userRepository.remove(user);
    console.log("✅ Usuario eliminado");

    return { message: "Usuario eliminado exitosamente" };
  }

  async toggleUserActive(userId: number) {
    console.log("🔄 Toggle activo para usuario:", userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    user.isActive = !user.isActive;
    await this.userRepository.save(user);

    console.log("✅ Usuario", user.isActive ? "activado" : "desactivado");

    return {
      message: `Usuario ${user.isActive ? "activado" : "desactivado"} exitosamente`,
      isActive: user.isActive,
    };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
