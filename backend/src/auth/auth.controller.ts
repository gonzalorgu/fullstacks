import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AdminGuard } from "./guards/admin.guard"; // ✅ NUEVO GUARD

// ✨ Interfaz mejorada para tipar el Request
interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // ========================================
  // 🔓 RUTAS PÚBLICAS
  // ========================================

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(resetPasswordDto.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ========================================
  // 🔒 RUTAS DEL USUARIO (AUTENTICADO)
  // ========================================

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Request() req: RequestWithUser) {
    try {
      return await this.authService.getProfile(req.user.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      return await this.authService.updateProfile(
        req.user.userId,
        updateProfileDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("change-password")
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      return await this.authService.changePassword(
        req.user.userId,
        changePasswordDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ========================================
  // 👨‍💼 RUTAS ADMIN (SOLO ADMIN)
  // ========================================

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get("users")
  async getAllUsers(@Request() req: RequestWithUser) {
    console.log(`👮 Admin ${req.user.email} consultando usuarios`);
    try {
      return await this.authService.getAllUsers();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get("users/:id")
  async getUserById(@Request() req: RequestWithUser, @Param("id") id: string) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestException("ID de usuario inválido");
      }
      return await this.authService.getProfile(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put("users/:id")
  async updateUser(
    @Request() req: RequestWithUser,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateProfileDto,
  ) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestException("ID de usuario inválido");
      }

      console.log(`👮 Admin ${req.user.email} actualizando usuario ${userId}`);
      return await this.authService.updateProfile(userId, updateUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete("users/:id")
  async deleteUser(@Request() req: RequestWithUser, @Param("id") id: string) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestException("ID de usuario inválido");
      }

      // ✅ PREVENIR AUTO-ELIMINACIÓN
      if (userId === req.user.userId) {
        throw new ForbiddenException(
          "No puedes eliminar tu propia cuenta como admin",
        );
      }

      console.log(`👮 Admin ${req.user.email} eliminando usuario ${userId}`);
      return await this.authService.deleteUser(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put("users/:id/toggle-active")
  async toggleUserActive(
    @Request() req: RequestWithUser,
    @Param("id") id: string,
  ) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestException("ID de usuario inválido");
      }

      // ✅ PREVENIR AUTO-DESACTIVACIÓN
      if (userId === req.user.userId) {
        throw new ForbiddenException(
          "No puedes desactivar tu propia cuenta como admin",
        );
      }

      console.log(
        `👮 Admin ${req.user.email} toggleando estado del usuario ${userId}`,
      );
      return await this.authService.toggleUserActive(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
